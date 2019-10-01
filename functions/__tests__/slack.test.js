const { notify } = require('../slack')
const nock = require('nock')

describe('Should notify slack', () => {
  test('Should notify slack through http request', () => {
    const body = {
      text: 'This is just a sample text',
      link_names: 1
    }

    nock('https://hooks.slack.com/services/ID1/ID2/ID3')
      .post('/', JSON.stringify(body))
      .reply(200)

    return notify('This is just a sample text')
  })

  test('Should return an error if the text is missing', () => {
    return expect(notify()).rejects.toThrowError('Missing text!')
  })
})
