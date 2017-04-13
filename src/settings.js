import request from 'request-promise'
const debug = require('debug')('engine-messenger')

"https://graph.facebook.com/v2.8/me/subscribed_apps?access_token=PAGE_ACCESS_TOKEN"
const BASE_URL = 'https://graph.facebook.com/v2.8/'

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
