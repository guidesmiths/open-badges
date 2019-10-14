const fs = require('fs')
const path = require('path')

const mockToken = () => ({
  access_token: 'acc3ss_t0k3n',
  token_type: 'Bearer',
  expires_in: 86400,
  refresh_token: 'r3fr3sh_t0k3n',
  scope: 'rw:profile rw:issuer rw:backpack'
})

const getJSONContent = (filename) => () => JSON.parse(fs.readFileSync(path.join(__dirname, `/${filename}.json`), 'utf8'))

module.exports = {
  mockToken,
  mockBadgeClasses: getJSONContent('badgeclasses'),
  mockBadgeClassesAsserts: getJSONContent('badgeclassesasserts'),
  mockBadgesList: getJSONContent('badgeslist')
}
