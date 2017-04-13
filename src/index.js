import { EngineCore } from 'co-kit'
import express from 'express'
import bodyParser from 'body-parser'
import catchPromiseErrors from 'async-error-catcher'
import localtunnel from 'localtunnel'
import colors from 'colors'
import crypto from 'crypto'
import request from 'request-promise'

import { parseEvents } from './events'
import * as settings from './settings'
import MessengerMessage from './templates'

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
    this.MessengerMessage = MessengerMessage.bind(null, this.ACCESS_TOKEN)
    // settings.subscribe(this.ACCESS_TOKEN)
  }

  listen = () => {
    this.core.listenSend(this, this.send)
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
      event => this.core.emitReceive(this.type, event)
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

  send = (packet) => {
    debug('send packet:\n%O', packet)
    packet.events
    .map(this.formatEvent)
    .map(this.sendEvent)
  }

  sendEvent = async (event) => {
    debug('sending event.body:\n%O', event.body)
    debug('-----')
    const body = await request(event.body).catch(this.handleError)
    if (body.error) {
      throw new Error(body.error)
    }
  }

  formatEvent = (event) => {
    debug('formatting event:\n%O', event)
    return new this.MessengerMessage(event)
  }

  handleError = (err) => {
    throw new Error(err)
  }

}

export default EngineMessenger
