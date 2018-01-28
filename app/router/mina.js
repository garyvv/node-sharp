var Session = require('../controller/session')
var User = require('../controller/user')
var Template = require('../controller/template')
var Recommand = require('../controller/recommand')
var Permissions = require('../permissions')

module.exports = function(router) {
    router.post('/api/mina/v1/login', Permissions('guest'), Session.login)
    router.get('/api/mina/v1/rcmd', Permissions('guest'), Recommand.list)

    router.get('/api/mina/v1/users', Permissions('user'), User.detail)
    router.put('/api/mina/v1/users', Permissions('user'), User.edit)

    router.get('/api/mina/v1/templates/:templateId', Permissions('guest'), Template.detail)

}