let account = require('./account')
let mongoose = require('mongoose')
let config = mongoose.connect(`mongodb://${account.username}:${account.password}@localhost:27017/ele`, { useNewUrlParser: true })
    .then(() => {
        console.log("connecting")
    }, err => {
        console.log(err)
    })
module.exports = config

// `mongodb://zheng2154:a47447741@localhost:27017/ele`