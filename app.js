//数据库配置
require("./mongoose/index.js");
//koa实例
const Koa = require("koa");
const app = new Koa();
//跨域
let cors = require("koa2-cors");
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true
  })
);
//解决前端history
const historyFallback = require('koa2-history-api-fallback')
app.use(historyFallback())

// 解析数据
const koaBody = require("koa-body");
app.use(koaBody());
// 配置静态资源
const serve = require("koa-better-static2");
app.use(serve("."));
app.use(serve("static/dist", { index: "index.html" }));
//session
app.keys = ["some secret hurr"];
const session = require("koa-session");
const CONFIG = {
  key: "koa:sess" /** (string) cookie key (default is koa:sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: true /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));
app.use(async (ctx, next) => {
  ctx.body = {};
  await next();
  if (ctx.body.message === "session错误") {
    ctx.session = null;
    ctx.body.login = false;
  } else if (ctx.session && ctx.session.id) {
    ctx.body.login = true;
  } else {
    ctx.body.login = false;
  }
});

//路由
require("./route")(app);

// //开启https服务
// const fs = require('fs');
// const https = require('https');
// // const enforceHttps = require('koa-sslify');
// var options = {
//     key: fs.readFileSync('./ssl/1525362960640.key'),
//     cert: fs.readFileSync('./ssl/1525362960640.pem')
// };

// https.createServer(options, app.callback()).listen(3002);

app.listen(3005);
