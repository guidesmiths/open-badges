const functions = jest.genMockFromModule('firebase-functions')

functions.config = jest.fn(() => ({
  slack: {
    webhook_url: 'https://hooks.slack.com/services/ID1/ID2/ID3/'
  },
  badgr: {
    user: 'demo-user',
    pass: 'demo-pass'
  }
}))

module.exports = functions
