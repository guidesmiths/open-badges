
const admin = require('firebase-admin')
const { hashEmail, badgesDigestor } = require('../../utils/index')
const { mockBadgeClasses, mockToken, mockBadgeClassesAsserts } = require('../../__samples__/index')
const { mockBadgeClassesRequest, mockBadgeClassesAssertsRequest } = require('../../__helpers__/index')

function addToken () {
  admin.setDatabase({ 'secrets/badgr': mockToken() })
}

function mockDigestorHttpRequest () {
  mockBadgeClassesRequest()

  mockBadgeClasses().result.forEach(badge => {
    mockBadgeClassesAssertsRequest(badge.entityId)
  })
}

afterEach(() => {
  admin.flush()
  jest.clearAllMocks()
})

describe('Email hashing', () => {
  test('Should generate a valid hash', () => {
    expect(hashEmail('demo@demo.com')).toStrictEqual('53444f91e698c0c7caa2dbc3bdbf93fc')
  })

  test('Should throw an error if a wrong email was provided', () => {
    expect(() => { hashEmail('demo@demo') }).toThrow('No valid email')
    expect(() => { hashEmail('@demo.com') }).toThrow('No valid email')
    expect(() => { hashEmail('demoAtdemo.com') }).toThrow('No valid email')
  })

  test('Should throw an error if the email wasn\'t provided', () => {
    expect(() => { hashEmail() }).toThrow('No valid email')
    expect(() => { hashEmail('') }).toThrowError('No valid email')
  })
})

describe('badges digestor behaviour', () => {
  test('Should perform all the HTTP requests expected', async () => {
    addToken()
    mockDigestorHttpRequest()

    const badgesList = mockBadgeClasses().result
    await badgesDigestor(badgesList)
  })

  test('Should perform all the changes in database expected', async () => {
    addToken()
    mockDigestorHttpRequest()

    const badgesList = mockBadgeClasses().result
    await badgesDigestor(badgesList)

    const uniqueItemsCount = mockBadgeClassesAsserts().result.length
    const saveAllBadgesCount = 1
    const totalItems = uniqueItemsCount + saveAllBadgesCount

    expect(admin.set.mock.calls.length).toBe(totalItems)
  })

  test('Should return an error if there is no list', async () => {
    expect(badgesDigestor()).rejects.toThrowError('No list provided!')
    expect(admin.database.mock.calls.length).toBe(0)
    expect(admin.ref.mock.calls.length).toBe(0)
    expect(admin.set.mock.calls.length).toBe(0)
  })
})
