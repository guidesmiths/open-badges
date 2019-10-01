const functions = require('firebase-functions')
const { setToken } = require('./store')
const { generateToken } = require('./badgr')

exports.dailyCrontab = functions.region('us-central1').pubsub.schedule('* 6 * * *').onRun(async (context) => {
    console.log('[TOKEN] Refresh has started');
    try {
        const token = await generateToken();
        await setToken(token);
        console.log('[TOKEN] Refresh has been updated');
    } catch(err) {
        console.error('[TOKEN] ERROR!', err);
    }
});
