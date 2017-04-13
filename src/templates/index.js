import request from 'request-promise'

export * as Generic from './Generic'
export * as Button from './Button'
export * as QuickReply from './QuickReply'
export * as ListItem from './ListItem'

// export default class Message {
//
//   constructor(recipientId) {
//     this.recipient = { id: recipientId }
//     this.message = {}
//   }
//
//   quick_replies = (quick_replies) => {
//     if (!Array.isArray(quick_replies)) {
//       throw new TypeError('quick_replies must be an Array!')
//     }
//     else {
//       this.message.quick_replies = quick_replies
//       return this
//     }
//   }
//
//   text = (text) => {
//     if (typeof(text) !== 'string') {
//       throw new TypeError('text must be a String!')
//     }
//     else {
//       this.message.text = text
//       return this
//     }
//   }
//
//   send = async (ACCESS_TOKEN) => {
//     const requestData = {
//       url: 'https://graph.facebook.com/v2.8/me/messages',
//       qs: { access_token: ACCESS_TOKEN },
//       method: 'POST',
//       json: {
//         recipient: this.recipient,
//         message: this.message,
//       }
//     }
//     const body = await request(requestData).catch(this.handleError)
//     if (body.error) {
//       throw new Error(body.error)
//     }
//   }
//
//   handleError = (err) => {
//     throw new Error(err)
//   }
//
// }

class MessengerMessage {

  constructor(ACCESS_TOKEN, Message) {
    this.url = 'https://graph.facebook.com/v2.8/me/messages'
    this.qs = { access_token: ACCESS_TOKEN }
    this.method = 'POST'
    this.recipient = { id: Message.destination }
    this.message = {
      text: this.parseText(Message),
      // attachments: this.parseAttachments(Message)
    }
  }

  get body() {
    return {
      url: this.url,
      qs: this.qs,
      method: this.method,
      json: {
        recipient: this.recipient,
        message: this.message,
      }
    }
  }

  parseText = (Message) => Message.text || null

  parseAttachments = (Message) => null

}

export default MessengerMessage

export async function textMessage(recipientId, text, quick_replies = null) {
  const messageData = {
    recipient: { id: recipientId },
    message: {
      quick_replies: quick_replies,
      text: text
    }
  }
  await _send(messageData)
}

export async function templateMessage(recipientId, templates, quick_replies = null, image_aspect_ratio = null) {
  const messageData = {
    recipient: { id: recipientId },
    message: {
      quick_replies: quick_replies,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: templates,
          image_aspect_ratio: image_aspect_ratio
        }
      }
    }
  }
  await _send(messageData)
}

export async function buttonMessage(recipientId, text, buttons, quick_replies = null) {
  const messageData = {
    recipient: { id: recipientId },
    message: {
      quick_replies: quick_replies,
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: text,
          buttons: buttons
        }
      }
    }
  }
  await _send(messageData)
}
