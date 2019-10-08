const functions = require('firebase-functions')
const rp = require('request-promise')
function notify (text) {
  if (!text) {
    return Promise.reject(new Error('Missing text!'))
  }

  return rp({
    method: 'POST',
    uri: functions.config().slack.webhook_url,
    body: {
      text,
      link_names: true
    },
    json: true
  })
}

module.exports = { notify }
