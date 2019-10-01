const { generateToken } = require('../badgr')
const nock = require('nock')

describe.only('Generate Token', () => {
  test.only('It should generate a valid token', async () => {
    const response = {
      access_token: 'acc3ss_t0k3n',
      token_type: 'Bearer',
      expires_in: 86400,
      refresh_token: 'r3fr3sh_t0k3n',
      scope: 'rw:profile rw:issuer rw:backpack'
    }

    nock('https://api.badgr.io/o/token')
      .post('/')
      .query({ username: 'demo-user', password: 'demo-pass' })
      .reply(200, JSON.stringify(response))

    const token = await generateToken()
    expect(token).toStrictEqual(response)
  })
})
