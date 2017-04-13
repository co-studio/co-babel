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
        .map(parseMessageText)
        .map(parsePostbackPayload)
        .map(parseEventMeta)
    )
  }
}

const types = Object.keys(eventProps)

function parseEventType(event) {
  const [ type ] = types.filter(type => event[type])
  return { type, _event: event }
}

const parseTypeProps = ({ type, _event }) => ({
  type,
  [type]: _event[type],
  _event,
})

const parseMessageText = (eventPacket) => {
  if (eventPacket.type === 'message') {
    eventPacket.message = eventPacket.message.text
  }
  return eventPacket
}

const parsePostbackPayload = (eventPacket) => {
  if (eventPacket.type === 'postback') {
    eventPacket.postback = eventPacket.postback.payload
  }
  return eventPacket
}

const parseEventMeta = (eventPacket) => {
  const { _event } = eventPacket
  eventPacket['meta'] = {
    src: 'messenger',
    receive: _event.recipient.id,
    send: _event.sender.id,
    timestamp: _event.timestamp,
  }
  return eventPacket
}

export default eventProps
