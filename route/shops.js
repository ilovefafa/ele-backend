const Router = require('koa-router');
// const Mock = require('mockjs')
Shops = require("../mongoose/model/shop.js")
function sparateRouteFile(app) {
    let router = new Router({
        prefix: "/api/shops"
    })

    router.get('/get', async (ctx) => {
        let query = ctx.request.query
        let skip = parseInt(query.skip)
        let limit = parseInt(query.limit)
        let shopList = await Shops.find().skip(skip).limit(limit)
        ctx.body = {
            code: 20000,
            data: [
                ...shopList
            ]
        };
    });

    router.get('/test', async (ctx, next) => {
        console.log(ctx.request)
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}


module.exports = sparateRouteFile