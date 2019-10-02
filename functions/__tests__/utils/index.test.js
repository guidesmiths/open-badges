const { hashEmail } = require('../../utils/index')
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
