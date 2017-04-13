import Button from './Button'

//
//
// ---
// API Reference:
// https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template
//
// EXAMPLE default_action:
// ---
// "default_action": {
//   "type": "web_url",
//   "url": "https://facebook.com/messengerbotboilerplate",
//   "messenger_extensions": true,
//   "webview_height_ratio": "tall",
//   "fallback_url": "https://facebook.com/messengerbotboilerplate"
// }
export default class Generic {
  constructor(props) {
    this.title = props.title || null
    this.image_url = props.image_url || null
    this.default_action = props.default_action || null
    this.subtitle = props.subtitle || null
    this.buttons = props.buttons || []
  }
}

export const COSTUDIO_TEMPLATE = new Generic({
  title: 'Built with 💜 by Co Studio',
  subtitle: 'Bringing bots to your business',
  image_url: 'https://s3.amazonaws.com/webot/logo-large.png',
  buttons: [
    new Button({
      type: 'web_url',
      title: 'View Co Studio',
      url: 'https://costudio.io'
    }),
  ]
})
