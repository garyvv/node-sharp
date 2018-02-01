const Api = require('../controller/api.js')
const Permissions = require('../permissions.js')
const Router = require('koa-router')()

module.exports = function() {
    Router.prefix('/api/v1')

    Router.get('/test', Permissions('guest'), Api.test)
    Router.get('/edit', Permissions('guest'), Api.edit)
    Router.get('/test/:test', Permissions('user'), Api.test)
    
    return Router
}