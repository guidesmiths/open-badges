const nock = require('nock')
const { mockToken, mockBadgeClasses } = require('../__samples__/index')

const mockTokenRequest = () => {
  nock('https://api.badgr.io/o/token')
    .post('/')
    .query({ username: 'demo-user', password: 'demo-pass' })
    .reply(200, JSON.stringify(mockToken()))
}

const mockBadgeClassesRequest = (accessToken = mockToken().access_token) => {
  nock('https://api.badgr.io/v2/', {
    reqheaders: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .get('/badgeclasses')
    .reply(200, JSON.stringify(mockBadgeClasses()))
}

module.exports = { mockTokenRequest, mockBadgeClassesRequest }
