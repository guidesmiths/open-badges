const functions = require('firebase-functions')
const { setToken } = require('./store')
const { generateToken, getBadgesList } = require('./badgr')
const { badgesDigestor } = require('./utils/index')
const { notify } = require('./slack')

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

exports.BadgeNotifier = functions.database.ref('data/users/{userId}/badges/{badgeId}').onWrite((change, context) => {
  const userId = context.params.userId
  const badgeId = context.params.badgeId
  const badgeContent = change.after.val()

  const message = JSON.stringify({ userId, badgeId, badgeContent })

  console.log('Retrieved message content: ', message)
  const slackMsg = `User: (${userId}) has archived *${badgeContent.name} (${badgeId})* :muscle:.${badgeContent.description}\n.\n${badgeContent.image}`
  notify(slackMsg)
  console.log(slackMsg)
})
