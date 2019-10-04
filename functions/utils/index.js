const crypto = require('crypto')
const isEmail = require('email-validator')
const { saveAllBadges, saveUserBadges } = require('../store')
const { getBadgeAssertions } = require('../badgr')

function badgesListTransformation (list) {
  if (!Array.isArray(list)) throw (new Error('No list provided!'))
  const badges = {}
  list.forEach(badge => {
    badges[badge.entityId] = badge
  })
  return badges
}

function generateMd5Hash (txt) {
  return crypto.createHash('md5').update(txt).digest('hex')
}

function hashEmail (email) {
  if (!email || !isEmail.validate(email)) {
    throw new Error('No valid email')
  }
  return generateMd5Hash(email)
}

async function badgesDigestor (list) {
  if (!Array.isArray(list)) throw (new Error('No list provided!'))
  const userBadges = {}
  const badgesList = badgesListTransformation(list)

  await saveAllBadges(list)

  const badgesIdsList = list.map(badge => badge.entityId)

  const badgesAssetsDetails = await Promise.all(badgesIdsList.map(getBadgeAssertions))

  badgesAssetsDetails.forEach(badge => {
    badge.forEach(assertion => {
      const email = assertion.recipient.plaintextIdentity
      const userId = hashEmail(email)
      const { badgeclass, issuedOn, evidence, revoked, revocationReason } = assertion

      if (!userBadges[userId]) userBadges[userId] = []

      const badgeData = Object.assign({}, badgesList[badgeclass], { issuedOn, evidence, revoked, revocationReason })

      const hasBadge = userBadges[userId].filter(badgeStore => badgeStore.entityId === badgeData.badgeclass)
      if (hasBadge.length === 0) {
        userBadges[userId].push(badgeData)
      }
    })
  })

  await Promise.all(Object.keys(userBadges).map(userId => saveUserBadges(userId, userBadges[userId])))
}

module.exports = { hashEmail, badgesDigestor }
