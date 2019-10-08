const functions = require('firebase-functions')
const { setToken, getUserData } = require('./store')
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

exports.BadgeNotifier = functions.database.ref('data/users/{userId}/badges/{badgeId}').onWrite(async (change, context) => {
  const userId = context.params.userId
  const badgeId = context.params.badgeId
  const badgeContent = change.after.val()
  const userData = await getUserData(userId)

  if (!userData || !userData.slackUser) throw new Error(`user: ${userId} is not registered in the database.`)

  const message = JSON.stringify({ userId, badgeId, userData, badgeContent })
  console.log('[Notification] Information available:', message)

  const slackMsg = `<${userData.slackUser}> just received *${badgeContent.name} badge*\n_${badgeContent.description}._\n<${badgeContent.image}>`

  notify(slackMsg)
  console.log('[Notification] Notification sent:', slackMsg)
})
