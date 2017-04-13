import request from 'request-promise'

export * as Generic from './Generic'
export * as Button from './Button'
export * as QuickReply from './QuickReply'
export * as ListItem from './ListItem'

class MessengerMessage {

  constructor(ACCESS_TOKEN, Message) {
    this.url = 'https://graph.facebook.com/v2.8/me/messages'
    this.qs = { access_token: ACCESS_TOKEN }
    this.method = 'POST'
    this.recipient = { id: Message.destination }
    this.createMessage({
      text: this.parseText(Message),
      buttons: this.parseButtons(Message),
      image: this.parseImages(Message),
      // attachments: this.parseAttachments(Message)
    })
  }

  get body() {
    console.log(this.message.attachment.payload.buttons)
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
  parseButtons = (Message) => Message.buttons || null
  parseImages = (Message) => Message.image || null
  parseAttachments = (Message) => null

  createMessage = ({ text, buttons, image }) => {
    if (buttons.length !== 0) {
      this.message = this.buttonMessage({ text, buttons })
    }
    else if (image !== null) {
      this.message = this.imageMessage({ text, image })
    }
    else {
      this.message = { text }
    }
  }

  buttonMessage = ({text, buttons }) => {
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: text,
          buttons: buttons.map(this.formatButton)
        }
      }
    }
  }

  formatButton(button) {
    const messengerButton = {
      title: button.label
    }
    if (button.url) {
      messengerButton.type = 'web_url'
      messengerButton.url = button.url
    }
    else if (button.payload) {
      messengerButton.type = 'postback'
      messengerButton.payload = button.payload
    }
    return messengerButton
  }

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
