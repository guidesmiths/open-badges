const functions = require('firebase-functions')
const rp = require('request-promise')

function generateToken () {
  const { pass: password, user: username } = functions.config().badgr
  const url = 'https://api.badgr.io/o/token/'
  return rp({
    method: 'POST',
    url,
    qs:
        {
          username,
          password
        }
  }).then(data => JSON.parse(data))
}
module.exports = {
  generateToken
}
