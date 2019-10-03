const functions = require('firebase-functions')
const rp = require('request-promise')
const { getToken } = require('./store')

const generateToken = () => {
  const { pass: password, user: username } = functions.config().badgr
  const url = 'https://api.badgr.io/o/token/'
  return rp({
    method: 'POST',
    url,
    qs:
        {
          username,
          password
        }
  }).then(data => JSON.parse(data))
}

const getBadgesList = async () => {
  const url = 'https://api.badgr.io/v2/badgeclasses'
  const token = await getToken()
  return rp({
    method: 'GET',
    url,
    headers:
    {
      Authorization: `Bearer ${token.access_token}`
    }
  }).then(response => {
    const responseData = JSON.parse(response)
    return responseData.result
  })
}

const getBadgeAssertions = async (badgeId) => {
  if (!badgeId) throw new Error('Missing badgeId!')
  const url = `https://api.badgr.io/v2/badgeclasses/${badgeId}/assertions`
  const token = await getToken()
  return rp({
    method: 'GET',
    url,
    headers:
    {
      Authorization: `Bearer ${token.access_token}`
    }
  }).then(response => {
    const responseData = JSON.parse(response)
    return responseData.result
  })
}

module.exports = {
  generateToken, getBadgesList, getBadgeAssertions
}
