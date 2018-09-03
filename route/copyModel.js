const Router = require('koa-router');

User = require("../mongoose/model/user.js")

function sparateRouteFile(app) {
    let router = new Router({
        prefix: "/api/user"
    })



    app.use(router.routes());
    app.use(router.allowedMethods());
}


module.exports = sparateRouteFile