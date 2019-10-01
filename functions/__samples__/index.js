
const mockToken = () => ({
  access_token: 'acc3ss_t0k3n',
  token_type: 'Bearer',
  expires_in: 86400,
  refresh_token: 'r3fr3sh_t0k3n',
  scope: 'rw:profile rw:issuer rw:backpack'
})

module.exports = { mockToken }
