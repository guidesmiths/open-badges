const csvFilePath = './org.csv'
const csv = require('csvtojson')
const fs = require('fs');

csv()
.fromFile(csvFilePath)
.then((users)=> {
    const finalData = {
        data: {
            users: {}
        }
    }
    users.forEach(user => {
        finalData.data.users[user.uuid] = user
    })
    fs.writeFileSync('./org.json', JSON.stringify(finalData, null, 4), 'utf8')
})