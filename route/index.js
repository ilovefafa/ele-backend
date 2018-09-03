module.exports = function (app) {
    require("./login.js")(app)
    require("./shops.js")(app)
    require("./user.js")(app)
}