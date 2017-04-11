// import EventEmitter from 'events'
import { EngineCore } from 'co-kit'
import express from 'express'
import bodyParser from 'body-parser'
import catchPromiseErrors from 'async-error-catcher'

// import { listen } from './server'
// import { verifyRequestSignature } from './routes'
import { parseEvents } from './events'

const debug = require('debug')('messenger')
class EngineMessenger {

  constructor(config) {
    if (!config.core) throw new Error('EngineMessenger() requires argument kit.core!')
    this.type = 'messenger'
    this.core = config.core
    this.APP_SECRET = config.APP_SECRET || ''
    this.ACCESS_TOKEN = config.ACCESS_TOKEN || ''
    this.VERIFY_TOKEN = config.VERIFY_TOKEN || ''
  }

  listen() {
    const app = express()
    app.set('port', (process.env.PORT || 3434))
    app.use(bodyParser.json({ verify: this.verifyRequestSignature }))
    app.get('/', (req, res) => res.send('kit-engine-messenger is good to go!'))
    app.get('/kit/engine/messenger', catchPromiseErrors(this.handleWebhookGet))
    app.post('/kit/engine/messenger', catchPromiseErrors(this.handleWebhookPost))
    app.use((err, req, res, next) => {
      console.error(err.stack || err)
      res.sendStatus(200)
    })
    app.listen(app.get('port'), () => {
      console.log(`kit-engine-messenger: ${app.get('port')}`)
      console.log(this)
      console.log(`emitting: in:${this.type}`)
      this.core.emitEvent(this.type, { type: 'postback' })
    })
  }

  handleWebhookGet(req, res) {
    if (req.query['hub.verify_token'] === this.VERIFY_TOKEN) {
      res.send(req.query['hub.challenge'])
    }
    else {
      res.send('Error, wrong token')
    }
  }

  handleWebhookPost(req, res) {
    const events = parseEvents(req.body.entry)
    events.map(this.emitEvent)
  }

  verifyRequestSignature(req, res, buf) {
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

  // listen() {
  //   setTimeout(this.emit, 1000)
  //   setTimeout(this.emit, 5000)
  //   // while(true) {
  //   // }
  //   return
  // },

  emitEvent(event) {
    if (!event.type) throw new TypeError('incoming event has no type!')
    this.emit(`in:${this.type}`, event)
  }

  send(pkt) {
    debug(pkt)
  }

}

export default EngineMessenger
