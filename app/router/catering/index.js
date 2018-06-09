
const Router = require('koa-router')();
const CateringPermissions = require('../../catering_permissions')
const Session = require('../../controller/catering/session')

module.exports = function () {
    /**
     * 用户微信登陆
     */
    Router.post('/api/catering/v1/sessions', CateringPermissions('guest'), Session.wxLogin)
    
    return Router;
}