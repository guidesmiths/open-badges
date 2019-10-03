const { generateToken, getBadgesList, getBadgeAssertions } = require('../badgr')
const { mockToken, mockBadgeClasses, mockBadgeClassesAsserts } = require('../__samples__/index')
const { mockTokenRequest, mockBadgeClassesRequest, mockBadgeClassesAssertsRequest } = require('../__helpers__/index')
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

  test('It should return a list of asserts from an specific badge', async () => {
    admin.setDatabase({ 'secrets/badgr': mockToken() })
    const badgeId = 'badgeId-001'
    mockBadgeClassesAssertsRequest(badgeId)

    const response = mockBadgeClassesAsserts()
    const list = await getBadgeAssertions(badgeId)
    expect(list).toStrictEqual(response.result)
  })

  test('It should throw an error if the badgeId is missing', async () => {
    admin.setDatabase({ 'secrets/badgr': mockToken() })
    mockBadgeClassesAssertsRequest()

    expect(getBadgeAssertions()).rejects.toEqual(new Error('Missing badgeId!'))
  })
})
