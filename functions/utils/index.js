const crypto = require('crypto')
const isEmail = require('email-validator')

function generateMd5Hash (txt) {
  return crypto.createHash('md5').update(txt).digest('hex')
}

function hashEmail (email) {
  if (!email || !isEmail.validate(email)) {
    throw new Error('No valid email')
  }
  return generateMd5Hash(email)
}

module.exports = { hashEmail }
