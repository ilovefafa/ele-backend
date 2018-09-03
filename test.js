const Delegate = require('./delegate')
const log = console.log

class Request {
    constructor() {
        this.request = 're'
    }
    sayHI() {
        console.log(this.request)
    }
}

let requestInstance = new Request()

class Ctx {
    constructor() {
        this.ctx = 'ctx'
    }
    sayCtx() {
        console.log('Ctx')
    }
}

Ctx.prototype.request = requestInstance
let ctxInstance = new Ctx()

delegateInstance = Delegate(Ctx.prototype, 'request')
delegateInstance.method('sayHI')

ctxInstance.sayHI()

aaa = {
    a: 1,
    c() {
        console.log(this.a)
    }
}

bbb = {
    a: 2
}

aaa.c.call(bbb)