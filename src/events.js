const debug = require('debug')('engine-messenger')

/**
 *
 * All Messenger event types with properties
 *
 *
 */
const eventProps = {
  default: [
    'sender',
    'recipient',
    'timestamp'
  ],
  message: [
    'text',
    'sticker_id',
    'attachments',
    'quick_reply',
    'is_echo',
    'seq',
  ],
  postback: [
    'text',
    'payload',
    'referral',
  ],
  optin: [
    'optin',
  ],
  delivery: [
    'delivery',
  ],
  read: [
    'read',
  ],
  referral: [
    'referral',
  ],
  account_linking: [
    'account_linking',
  ]
}

/**
 *
 * Parse each event object into the form of:
 *
 *  {
 *    type: String,
 *    event: Object (raw Messenger Object),
 *    [type]: Object (type specific event properties),
 *    meta: Object
 *  }
 *
 */
export function parseEvents(entries) {
  if (!entries) {
    return []
  }
  else {
    return entries
    .filter(entry => entry.messaging != undefined)
    .map(
      ({ messaging }) =>
        messaging
        .map(parseEventType)
        .map(parseTypeProps)
        .map(parseEventMeta)
    )
  }
}

const types = Object.keys(eventProps)

function parseEventType(event) {
  const [ type ] = types.filter(type => event[type])
  return { type, event }
}

const parseTypeProps = ({ type, event }) => ({
  type,
  event,
  [type]: event[type]
})

const parseEventMeta = (eventPacket) => {
  const { event } = eventPacket
  eventPacket['meta'] = {
    receive: event.recipient.id,
    send: event.sender.id,
    timestamp: event.timestamp,
  }
  return eventPacket
}

export default eventProps
