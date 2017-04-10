import engine from '../index'
const debug = require('debug')('messenger')

export const messenger = {

  type: 'messenger',

  listen() {
    setTimeout(this.emit, 1000)
    setTimeout(this.emit, 5000)
    // while(true) {
    // }
    return
  },

  emit(event) {
    engine.core.emit('in', 1, 'messenger')
  },

  send(pkt) {
    debug(pkt)
  },

}
