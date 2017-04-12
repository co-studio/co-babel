import { EngineCore } from 'co-kit'
import express from 'express'
import bodyParser from 'body-parser'
import catchPromiseErrors from 'async-error-catcher'
import localtunnel from 'localtunnel'
import colors from 'colors'
import crypto from 'crypto'

import { parseEvents } from './events'
import * as settings from './settings'

const debug = require('debug')('engine-messenger')
class EngineMessenger {

  constructor(config) {
    if (!config.core) throw new Error('EngineMessenger() requires argument kit.core!')
    this.type = 'messenger'
    this.core = config.core
    this.endpoint = '/kit/engine/messenger'
    this.subdomain = config.subdomain || null
    this.APP_SECRET = config.APP_SECRET || ''
    this.ACCESS_TOKEN = config.ACCESS_TOKEN || ''
    this.VERIFY_TOKEN = config.VERIFY_TOKEN || ''
    this.settings = settings
    // settings.subscribe(this.ACCESS_TOKEN)
  }

  listen() {
    const app = express()
    const port = (process.env.PORT || 3434)
    app.set('port', port)
    app.use(bodyParser.json({ verify: this.verifyRequestSignature }))
    app.get('/', (req, res) => res.send('kit-engine-messenger is good to go!'))
    app.get(this.endpoint, this.handleWebhookGet)
    app.post(this.endpoint, this.handleWebhookPost)
    app.use((err, req, res, next) => {
      console.error(err.stack || err)
      res.sendStatus(200)
    })
    app.listen(port, () => {
      console.log(`kit-engine-messenger listening on`.cyan + ` port ${port}`.bold.magenta)
      // this.core.emitEvent(this.type, { type: 'postback' })
      if (process.env.NODE_ENV !== 'production') {
        const opts = (this.subdomain)
          ? { subdomain: this.subdomain }
          : null
        localtunnel(port, opts, (err, tunnel) => {
          if (err) throw new Error(err)
          tunnel.on('error', (err) => {
            throw new Error(err)
          })
          console.log(`webhook url: `.cyan + `${tunnel.url}${this.endpoint}`.bold.magenta)
        })
      }
    })
  }

  // Arrow function to maintain 'this' reference
  handleWebhookGet = (req, res) => {
    if (req.query['hub.verify_token'] === this.VERIFY_TOKEN) {
      res.send(req.query['hub.challenge'])
    }
    else {
      res.send('Error, wrong token')
    }
  }

  handleWebhookPost = (req, res) => {
    res.sendStatus(200)
    const [ events ] = parseEvents(req.body.entry)
    events.map(
      event => this.core.emitEvent(this.type, event)
    )
  }

  verifyRequestSignature = (req, res, buf) => {
    let signature = req.headers["x-hub-signature"];
    if (!signature) {
      throw new Error('Unable to validate request signature!')
    }
    else {
      let elements = signature.split('=');
      let method = elements[0];
      let signatureHash = elements[1];
      let expectedHash = crypto.createHmac('sha1', this.APP_SECRET)
      .update(buf)
      .digest('hex');
      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }

  send(pkt) {
    debug(pkt)
  }

}

export default EngineMessenger
