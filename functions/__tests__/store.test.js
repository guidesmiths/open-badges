const { getToken, setToken } = require('../store')
const admin = require('firebase-admin')

afterEach(() => {
  admin.flush()
  jest.clearAllMocks()
})

describe('Set Token', () => {
  test('Should store the data', async () => {
    const tokenData = {
      access_token: 'acc3ss_t0k3n',
      token_type: 'Bearer',
      expires_in: 86400,
      refresh_token: 'r3fr3sh_t0k3n',
      scope: 'rw:profile rw:issuer rw:backpack'
    }

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
    const tokenData = {
      access_token: 'acc3ss_t0k3n',
      token_type: 'Bearer',
      expires_in: 86400,
      refresh_token: 'r3fr3sh_t0k3n',
      scope: 'rw:profile rw:issuer rw:backpack'
    }
    admin.setDatabase({ 'secrets/badgr': tokenData })
    const token = await getToken()
    expect(token).toStrictEqual(tokenData)
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual('secrets/badgr')
    expect(admin.once.mock.calls.length).toBe(1)
    expect(admin.once.mock.calls[0][0]).toStrictEqual('child_added')
  })
  test('Should return an error if the token is not stored', async () => {
    await expect(getToken()).rejects.toThrowError('No token stored!')
    expect(admin.database.mock.calls.length).toBe(1)
    expect(admin.database.mock.calls[0][0]).toStrictEqual(undefined)
    expect(admin.ref.mock.calls.length).toBe(1)
    expect(admin.ref.mock.calls[0][0]).toStrictEqual('secrets/badgr')
    expect(admin.once.mock.calls.length).toBe(1)
    expect(admin.once.mock.calls[0][0]).toStrictEqual('child_added')
  })
})
