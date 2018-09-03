const Router = require('koa-router');
var bcrypt = require('bcrypt');

User = require("../mongoose/model/user.js")
TemPhoneAuth = require("../mongoose/model/temPhoneAuth.js")

function sparateRouteFile(app) {
    let router = new Router({
        prefix: "/api/login"
    })

    router.get('/check', async (ctx) => {
        let find = []
        let id = ctx.session.id
        if (id) {
            find = await User.find({ _id: id })
            if (find.length !== 0) {
                ctx.body = {
                    code: 200,
                    message: '已登陆',
                    login: true,
                    userInfo: { ...find[0].userInfo }
                }
            } else {
                ctx.body = {
                    code: 400,
                    message: 'session错误',
                    login: false
                }
            }
        } else {
            ctx.body = {
                code: 400,
                message: '未登陆',
                login: false
            }
        }
    })
    router.post('/loginByAccount', async (ctx) => {
        let { account, password } = ctx.request.body
        let findData, respone
        password = await bcrypt.hash(password, 10)
        findData = await User.find({ account })
        if (findData.length === 0) {
            let insert
            insert = await User.insertMany({ [type]: account, password })
            ctx.session = { id: insert[0].id }
            respone = {
                code: 200,
                message: '注册并登录成功',
                data: { userInfo: insert[0].userInfo },
            }
        } else {
            let compare = await bcrypt.compare(plainPassword, findData[0].password);
            if (compare) {
                ctx.session = {
                    id: findData[0].id
                }
                respone = {
                    code: 200,
                    message: '登录成功',
                    data: { userInfo: findData[0].userInfo },
                }
            } else {
                respone = {
                    code: 400,
                    message: '密码错误',
                }
            }
        }
        ctx.body = {
            ...respone
        }
    })
    router.post('/loginByPhoneNumber', async (ctx) => {
        let respone
        let { phoneNumber, authCode } = ctx.request.body
        let checkAuthCode = await TemPhoneAuth.find({ phoneNumber, authCode })
        if (checkAuthCode.length !== 0) {
            let hasphoneNumber = await User.find({ phoneNumber })
            if (hasphoneNumber.length !== 0) {
                ctx.session = {
                    id: hasphoneNumber[0].id
                }
                respone = {
                    code: 200,
                    message: '登陆成功',
                    data: {
                        userInfo: hasphoneNumber[0].userInfo
                    }
                }
            } else {
                insert = await User.insertMany({ phoneNumber, userInfo: { encryptPhoneNumber: `${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-4)}` } })
                ctx.session = {
                    id: insert[0].id
                }
                respone = {
                    code: 200,
                    message: '新建用户登陆成功',
                    data: {
                        userInfo: insert[0].userInfo
                    }
                }
            }
        } else {
            respone = {
                code: 400,
                message: '验证码错误',
            }
        }
        ctx.body = {
            ...respone
        }
    })

    router.post('/getAuthCode', async (ctx) => {
        let possible = '0123456789'
        let { phoneNumber } = ctx.request.body
        let authCode = '';
        for (let i = 0; i < 4; i++) {
            authCode += possible.charAt(Math.floor(possible.length * Math.random()))
        }
        let expireAt = Date.now() + 5 * 60 * 1000
        await TemPhoneAuth.insertMany({ phoneNumber, authCode, expireAt: expireAt, })
        ctx.body = {
            message: '手机不会收到短信，验证码自动获取且五分钟内有效',
            authCode,
            phoneNumber,
        }
    })

    app.use(router.routes());
    app.use(router.allowedMethods());
}


module.exports = sparateRouteFile