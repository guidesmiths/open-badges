const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)
const tokenRef = 'secrets/badgr'

async function setToken (data) {
  if (!data || !data.access_token) throw (new Error('No token provided!'))
  return admin.database().ref(tokenRef).set(data)
}
async function getToken () {
  const snapshot = await admin.database().ref(tokenRef).once('child_added')
  const data = snapshot.val()
  if (!data) throw (new Error('No token stored!'))
  return data
}

async function saveAllBadges (list) {
  if (!Array.isArray(list)) throw (new Error('No list provided!'))

  const badges = {}
  list.forEach(badge => {
    badges[badge.entityId] = badges
  })

  return admin.database().ref('data/badgr/badges').set(badges)
}

async function getAllBadges () {
  const snapshot = await admin.database().ref('data/badgr/badges').once('value')
  const data = snapshot.val()
  if (data) return Object.values(data)
  return []
}

module.exports = {
  getToken, setToken, saveAllBadges, getAllBadges
}
