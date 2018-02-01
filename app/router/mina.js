const Router = require('koa-router')()

const Session = require('../controller/session')
const User = require('../controller/user')
const Template = require('../controller/template')
const Recommand = require('../controller/recommand')
const Permissions = require('../permissions')

module.exports = function() {
    Router.prefix('/api/mina/v1')

    Router.post('/login', Permissions('guest'), Session.login)
    Router.get('/rcmd', Permissions('guest'), Recommand.list)

    Router.get('/users', Permissions('user'), User.detail)
    Router.put('/users', Permissions('user'), User.edit)

    Router.get('/templates/:templateId', Permissions('guest'), Template.detail)

    return Router
}