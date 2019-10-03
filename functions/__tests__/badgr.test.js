const { generateToken, getBadgesList } = require('../badgr')
const { mockToken, mockBadgeClasses } = require('../__samples__/index')
const { mockTokenRequest, mockBadgeClassesRequest } = require('../__helpers__/index')
const admin = require('firebase-admin')

afterEach(() => {
  admin.flush()
  jest.clearAllMocks()
})

describe('Generate Token', () => {
  test('It should generate a valid token', async () => {
    mockTokenRequest()
    const response = mockToken()
    const token = await generateToken()
    expect(token).toStrictEqual(response)
  })
})

describe('handle API Rest', () => {
  test('It should return a full badges list from an issuer', async () => {
    admin.setDatabase({ 'secrets/badgr': mockToken() })
    mockBadgeClassesRequest()

    const response = mockBadgeClasses()
    const list = await getBadgesList()
    expect(list).toStrictEqual(response.result)
  })
})
