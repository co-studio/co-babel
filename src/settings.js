import request from 'request-promise'
const debug = require('debug')('engine-messenger')

"https://graph.facebook.com/v2.8/me/subscribed_apps?access_token=PAGE_ACCESS_TOKEN"
const BASE_URL = 'https://graph.facebook.com/v2.8/'

async function _request(messageData) {
  const requestData = {
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: this.ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  }
  const body = await request(requestData)
  if (body.error) {
    throw new Error(body.error)
  }
}

export async function subscribe(ACCESS_TOKEN) {
  const res = await request({
    url: `${BASE_URL}/me/subscribed_apps`,
    qs: { access_token: ACCESS_TOKEN },
    method: 'POST'
  })
  if (res.error) {
    throw new Error(body.error)
  }
  else {
    debug(`succesfully subscribed to page ${ACCESS_TOKEN}`)
  }
}
