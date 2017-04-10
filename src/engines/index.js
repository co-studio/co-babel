import EventEmitter from 'events'

import { messenger } from './messenger'

export const core = new EventEmitter()

export default {
  // Core Engine
  core,
  // Platform Engines
  messenger
}
