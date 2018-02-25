const Koa = require('koa')
const app = new Koa()
const Config = require('../config/config')
const koaBody = require('koa-body')

app.use(koaBody())

app.use(require('./handlers'))

// 应用路由
var appRouter = require('./router/index')()
// 小程序路由
var minaRouter = require('./router/mina')()

app.use(appRouter.routes())
app.use(minaRouter.routes())

app.listen(Config.port)

module.exports = app