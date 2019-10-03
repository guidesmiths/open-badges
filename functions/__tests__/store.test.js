const { getToken, setToken, saveAllBadges, getAllBadges, saveUserBadges, getUserBadges } = require('../store')
const { mockToken, mockBadgesList, mockBadgeClasses } = require('../__samples__')
const { hashEmail } = require('../utils/index')
const admin = require('firebase-admin')

afterEach(() => {
  admin.flush()
  jest.clearAllMocks()
})

function validateGetToken () {
  expect(admin.database.mock.calls.length).toBe(1)
  expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
  expect(admin.ref.mock.calls.length).toBe(1)
  expect(admin.ref.mock.calls[0][0]).toStrictEqual('secrets/badgr')
  expect(admin.once.mock.calls.length).toBe(1)
  expect(admin.once.mock.calls[0][0]).toStrictEqual('child_added')
}

describe('Set Token', () => {
  test('Should store the data', async () => {
    const tokenData = mockToken()

    await setToken(tokenData)
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual('secrets/badgr')
    expect(admin.set.mock.calls.length).toBe(1)
    expect(admin.set.mock.calls[0][0]).toStrictEqual(tokenData)
  })

  test('Should return an error if there is no data to store', async () => {
    await expect(setToken()).rejects.toThrowError('No token provided!')
    expect(admin.database.mock.calls.length).toBe(0)
    expect(admin.ref.mock.calls.length).toBe(0)
    expect(admin.set.mock.calls.length).toBe(0)
  })
})
describe('Get Token', () => {
  test('Should return a valid token', async () => {
    const tokenData = mockToken()
    admin.setDatabase({ 'secrets/badgr': tokenData })
    const token = await getToken()
    expect(token).toStrictEqual(tokenData)
    validateGetToken()
  })
  test('Should return an error if the token is not stored', async () => {
    await expect(getToken()).rejects.toThrowError('No token stored!')
    validateGetToken()
  })
})

describe('Store badges list', () => {
  test('Should store the list provided', async () => {
    const badgesList = mockBadgeClasses().result
    const badgesListToStore = mockBadgesList()

    await saveAllBadges(badgesList)
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual('data/badgr/badges')
    expect(admin.set.mock.calls.length).toBe(1)
    expect(Object.keys(admin.set.mock.calls[0][0])).toStrictEqual(Object.keys(badgesListToStore))
  })

  test('Should return an error if there is no list', async () => {
    expect(saveAllBadges()).rejects.toThrowError('No list provided!')
    expect(admin.database.mock.calls.length).toBe(0)
    expect(admin.ref.mock.calls.length).toBe(0)
    expect(admin.set.mock.calls.length).toBe(0)
  })
})

describe('Get the badges list', () => {
  test('Should return the badges list (Array)', async () => {
    const badgesListStored = mockBadgesList()
    admin.setDatabase({ 'data/badgr/badges': badgesListStored })
    const list = await getAllBadges()
    expect(list).toStrictEqual(mockBadgeClasses().result)
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual('data/badgr/badges')
    expect(admin.once.mock.calls.length).toBe(1)
    expect(admin.once.mock.calls[0][0]).toStrictEqual('value')
  })
  test('Should return an empty array if the list is empty', async () => {
    const list = await getAllBadges()
    expect(list).toStrictEqual([])
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual('data/badgr/badges')
    expect(admin.once.mock.calls.length).toBe(1)
    expect(admin.once.mock.calls[0][0]).toStrictEqual('value')
  })
})

describe('Store All the badges for an specific user', () => {
  const badgesList = mockBadgeClasses().result
  const badgesListToStore = mockBadgesList()
  const userId = hashEmail('demo@demo.com')

  test('Should store all the badges', async () => {
    await saveUserBadges(userId, badgesList)
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual(`data/${userId}/badges`)
    expect(admin.set.mock.calls.length).toBe(1)
    expect(Object.keys(admin.set.mock.calls[0][0])).toStrictEqual(Object.keys(badgesListToStore))
  })

  test('Should return an error if there is no list', async () => {
    expect(saveUserBadges(userId)).rejects.toThrowError('No list provided!')
    expect(admin.database.mock.calls.length).toBe(0)
    expect(admin.ref.mock.calls.length).toBe(0)
    expect(admin.set.mock.calls.length).toBe(0)
  })

  test('Should return an error if there is no userId', async () => {
    expect(saveUserBadges(undefined, badgesList)).rejects.toThrowError('No userId provided!')
    expect(admin.database.mock.calls.length).toBe(0)
    expect(admin.ref.mock.calls.length).toBe(0)
    expect(admin.set.mock.calls.length).toBe(0)
  })
})

describe('Get the badges list for an specific user', () => {
  const userId = hashEmail('demo@demo.com')
  const dbPath = `data/${userId}/badges`

  test('Should return the badges list (Array) for an specific user', async () => {
    const badgesListStored = mockBadgesList()

    const db = {}
    db[dbPath] = badgesListStored

    admin.setDatabase(db)
    const list = await getUserBadges(userId)
    expect(list).toStrictEqual(mockBadgeClasses().result)
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual(dbPath)
    expect(admin.once.mock.calls.length).toBe(1)
    expect(admin.once.mock.calls[0][0]).toStrictEqual('value')
  })

  test('Should return an error if there is no userId', async () => {
    expect(getUserBadges()).rejects.toThrowError('No userId provided!')
    expect(admin.database.mock.calls.length).toBe(0)
    expect(admin.ref.mock.calls.length).toBe(0)
    expect(admin.set.mock.calls.length).toBe(0)
  })

  test('Should return an empty array if there aren\'t badges stored for that specific userId.', async () => {
    const list = await getUserBadges(userId)
    expect(list).toStrictEqual([])
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual(dbPath)
    expect(admin.once.mock.calls.length).toBe(1)
    expect(admin.once.mock.calls[0][0]).toStrictEqual('value')
  })
})
