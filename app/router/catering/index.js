
const Router = require('koa-router')();
const CateringPermissions = require('../../catering_permissions')
const Session = require('../../controller/catering/session')
const Customer = require('../../controller/catering/customer')

module.exports = function () {
    /**
     * 用户微信登陆
     */
    Router.post('/api/catering/v1/sessions', CateringPermissions('guest'), Session.wxLogin)

    Router.get('/api/catering/v1/customers/:uid', CateringPermissions('user'), Customer.detail)
    Router.put('/api/catering/v1/customers/:uid', CateringPermissions('user'), Customer.edit)
    
    return Router;
}