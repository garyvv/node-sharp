const Koa = require('koa')
const app = new Koa()
const config = require('../config/config.js')
const koaBody = require('koa-body')

const db = require('../config/db.js')
const response = require('./util/response.js')

app.use(require('./handlers'))

app.use(koaBody())
// 路由
var router = require('koa-router')()
//应用路由
var appRouter = require('./router')
appRouter(router)

// 小程序路由
var minaRouter = require('./router/mina')
minaRouter(router)

app.use(router.routes())


app.listen(config.port)

module.exports = app