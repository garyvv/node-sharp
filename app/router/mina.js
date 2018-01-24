var session = require('../controller/session')
var user = require('../controller/user')
var permissions = require('../permissions')

module.exports = function(router) {
    router.post('/api/mina/v1/login', permissions('guest'), session.login)

    router.get('/api/mina/v1/users', permissions('user'), user.detail)
}