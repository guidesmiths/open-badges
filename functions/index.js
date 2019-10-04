const functions = require('firebase-functions')
const { setToken } = require('./store')
const { generateToken, getBadgesList } = require('./badgr')
const { badgesDigestor } = require('./utils/index')

exports.dailyCrontab = functions.region('us-central1').pubsub.schedule('* 6 * * *').onRun(async (context) => {
  console.log('[TOKEN] Refresh has started')
  try {
    const token = await generateToken()
    await setToken(token)
    console.log('[TOKEN] Refresh has been updated')
  } catch (err) {
    console.error('[TOKEN] ERROR!', err)
  }
})

exports.hourlyCrontab = functions.region('us-central1').pubsub.schedule('0 * * * *').onRun(async (context) => {
  console.log('[Badges] collection has started')
  try {
    const badgesList = await getBadgesList()
    await badgesDigestor(badgesList)
    console.log('[Badges] collection has been updated')
  } catch (err) {
    console.error('[Badges] collection ERROR!', err)
  }
})
