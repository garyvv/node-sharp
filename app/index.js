const Koa = require('koa')
const app = new Koa()
const Config = require('../config/config')
const koaBody = require('koa-body')

// app.use(koaBody())
app.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200*1024*1024 // 设置上传文件大小最大限制，默认2M
    }
  }))

app.use(require('./handlers'))

// 应用路由
var appRouter = require('./router/index')()
// 小程序路由
var minaRouter = require('./router/mina')()
// 餐饮
var cateringRouter = require('./router/catering/index')()

app.use(appRouter.routes())
app.use(minaRouter.routes())
app.use(cateringRouter.routes())

app.listen(Config.port)

module.exports = app