const Router = require("koa-router");
const koaBody = require("koa-body");
const User = require("../mongoose/model/user.js");
const NodeCache = require("node-cache");
var bcrypt = require("bcrypt");
const uploadDir = "./static/storage/img/userHeadImg";
const authCodeCache = new NodeCache({ stdTTL: 60 * 60 * 5 });
function sparateRouteFile(app) {
  let router = new Router({
    prefix: "/api/user"
  });

  router.post(
    "/upLoadHeadPicture",
    koaBody({
      multipart: true,
      formidable: {
        uploadDir: uploadDir
      }
    }),
    async ctx => {
      let file = ctx.request.body.files.file;
      let id = ctx.session.id;
      let removeUploadDir = uploadDir.substring(2) + "/";
      let getDir = "/" + uploadDir.substring(2) + "/";
      let fileName = file.path.replace(/\\/g, "/").replace(removeUploadDir, "");
      let headImg = getDir + fileName;
      await User.update({ _id: id }, { "userInfo.headImg": headImg });
      ctx.body = {
        code: 200,
        data: {
          headImg
        }
      };
    }
  );

  router.post("/name", async ctx => {
    let name = ctx.request.body.name;
    let id = ctx.session.id;
    await User.update(
      { _id: id },
      { "userInfo.name": name, "userInfo.changeName": true }
    );
    ctx.body = {
      code: 200,
      data: {
        name,
        changeName: true
      }
    };
  });

  router.post("/authCode", async ctx => {
    let id = ctx.session.id;
    let find = await User.findOne({ _id: id });
    let phoneNumber = find.phoneNumber;
    let authCode = (figures => {
      let randomNumber = "";
      for (let i = 0; i < figures; i++) {
        randomNumber += Math.floor(Math.random() * 10).toString();
      }
      return randomNumber;
    })(6);
    await authCodeCache.set(phoneNumber, authCode);
    ctx.body = {
      code: 200,
      data: {
        authCode: "验证码为:" + authCode + ",有效时间5分钟"
      }
    };
  });

  router.post("/confirmAuthCode", async ctx => {
    let authCode = ctx.request.body.authCode;
    let id = ctx.session.id;
    let find = await User.findOne({ _id: id });
    let phoneNumber = find.phoneNumber;
    let getCache = await authCodeCache.get(phoneNumber);
    if (getCache === authCode) {
      ctx.body = {
        code: 200,
        data: {}
      };
    } else {
      ctx.body = {
        code: 400,
        errMessage: "验证码错误"
      };
    }
  });

  router.post("/newPhoneAuthCode", async ctx => {
    let phoneNumber = ctx.request.body.phoneNumber;
    let authCode = (figures => {
      let randomNumber = "";
      for (let i = 0; i < figures; i++) {
        randomNumber += Math.floor(Math.random() * 10).toString();
      }
      return randomNumber;
    })(6);
    await authCodeCache.set(phoneNumber, authCode);
    ctx.body = {
      code: 200,
      data: {
        authCode: "验证码为:" + authCode + ",有效时间5分钟"
      }
    };
  });

  router.post("/newPhoneConfirmAuthCode", async ctx => {
    let authCode = ctx.request.body.authCode;
    let phoneNumber = ctx.request.body.phoneNumber;
    let encryptPhoneNumber = `${phoneNumber.slice(0, 3)}****${phoneNumber.slice(
      -4
    )}`;
    let id = ctx.session.id;
    let getCache = await authCodeCache.get(phoneNumber);
    if (getCache === authCode) {
      await User.update(
        { _id: id },
        { phoneNumber, "userInfo.encryptPhoneNumber": encryptPhoneNumber }
      );
      ctx.body = {
        code: 200,
        data: {
          encryptPhoneNumber
        }
      };
    } else {
      ctx.body = {
        code: 400,
        errMessage: "验证码错误"
      };
    }
  });

  router.post("/updatePassword", async ctx => {
    let { newPassword, oldPassword } = ctx.request.body;
    let id = ctx.session.id;
    let find = await User.findOne({ _id: id });
    if (find.password) {
      let compare = await bcrypt.compare(oldPassword, find.password);
      if (compare) {
        let password = await bcrypt.hash(newPassword, 10);
        await User.update({ _id: id }, { password });
        ctx.body = {
          code: 200
        };
      } else {
        ctx.body = {
          code: 400,
          message: "旧密码错误"
        };
        return;
      }
    }
    let password = await bcrypt.hash(newPassword, 10);
    await User.update({ _id: id }, { password });
    ctx.body = {
      code: 200
    };
  });
  router.post("/logout", async ctx => {
    ctx.session = null;
    ctx.body = {
      code: 200
    };
  });

  router.post("/address", async ctx => {
    let data = ctx.request.body;
    let _id = ctx.session.id;
    await User.update(
      { _id },
      { $push: { "userInfo.addresses": { ...data } } }
    );
    ctx.body = {
      code: 200
    };
  });

  router.get("/address", async ctx => {
    let _id = ctx.session.id;
    let find = await User.findOne({ _id });
    ctx.body = {
      code: 200,
      data: {
        addresses: find.userInfo.addresses
      }
    };
  });

  router.delete("/address", async ctx => {
    let addressID = ctx.request.query._id;
    let _id = ctx.session.id;
    let updateInfo = await User.update(
      { _id },
      { $pull: { "userInfo.addresses": { _id: addressID } } }
    );
    ctx.body = {
      code: 200,
      data: {
        updateInfo
      }
    };
  });

  router.put("/address", async ctx => {
    let data = ctx.request.body;
    let addressID = data._id;
    let _id = ctx.session.id;
    await User.update(
      { _id, "userInfo.addresses._id": addressID },
      { "userInfo.addresses.$": { ...data } }
    );
    ctx.body = {
      code: 200
    };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}

module.exports = sparateRouteFile;
