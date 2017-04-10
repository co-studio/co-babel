import process from 'process'
const debug = require('debug')('kit')

import { core } from './engines'

//
// kit
// ==================================================
// ==================================================
//

export default {

  middleware: [],
  engines: [],

  config(config) {
    this.middleware = config.middleware || []
    this.engines = config.engines || []
    return this
  },

  listen() {
    const pkt = this.initPkt()
    this.handleIn(pkt)
    this.engines.map(engine =>
      engine.listen()
    )
  },

  handleIn(pkt) {
    core.on('in', async (event, engineType) => {
      debug('EVENT IN')
      debug(event, engineType)

      const [ engine ] = this.filterEngines(engineType, this.engines)
      pkt.in = { event }
      pkt.out = {}
      pkt.engine = engine

      this.handleOut(await this.applyMiddleware(pkt))
    })
  },

  async applyMiddleware(pkt) {
    pkt.out.event = await applyRecursive(pkt, this.middlewareFns)
    .catch(handleError)

    return pkt
  },

  handleOut(pkt) {
    pkt.engine.send(pkt.out.event)
  },

  //
  // Helper Functions
  // ==================================================
  // ==================================================
  //

  initPkt() {
    return {}
  },

  filterEngines(engineType, engines) {
    return engines.filter(engine => engine.type === engineType)
  },

  get middlewareFns() {
    return this.middleware.slice(0)
  },

}

// END kit
// ==================================================
// ==================================================
//

async function applyRecursive(event, fnQueue) {
  if (fnQueue.length === 0) {
    return event
  }
  else {
    const fn = fnQueue.shift()
    return await applyRecursive(fn(event), fnQueue)
  }
}

function handleError(err) {
  console.error(err)
}
