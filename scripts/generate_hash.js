const { hashEmail } = require('../functions/utils')
const [,, email] = process.argv

console.log(`
------ MD5 HASH -----
input: ${email}
output: ${hashEmail(email)}
---------------------
`)