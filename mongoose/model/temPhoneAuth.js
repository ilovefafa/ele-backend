var mongoose = require('mongoose');
var Schema = mongoose.Schema({
    phoneNumber: String,
    authCode: String,
    expireAt: {
        type: Date,
        required: true,
    },
});
Schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('tem-phone-auth', Schema);