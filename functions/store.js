const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

async function getToken () {
  const snapshot = await admin.database().ref('secrets/badgr').once('child_added')
  const data = snapshot.val()
  if (!data) throw (new Error('No token stored!'))
  return data
}

module.exports = {
  getToken
}
