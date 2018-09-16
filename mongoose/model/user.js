var mongoose = require("mongoose");
var Schema = mongoose.Schema({
  userInfo: {
    name: {
      type: String,
      default: function makeid() {
        var text = "";
        var possible =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let length = 10;
        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      }
    },
    balance: {
      type: Number,
      default: 0.0
    },
    redEnvelope: {
      type: Number,
      default: 0
    },
    gold: {
      type: Number,
      default: 0
    },
    encryptPhoneNumber: {
      type: String,
      default: `no phone`
    },
    headImg: {
      type: String
    },
    changeName: {
      type: Boolean,
      default: false
    },
    addresses: [
      {
        name: String,
        gender: String,
        address: {
          name: String,
          detail: String
        },
        houseNumber: String,
        phoneNumber: String,
        addressLabel: String
      }
    ]
  },
  account: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  token: String
});

module.exports = mongoose.model("users", Schema);
