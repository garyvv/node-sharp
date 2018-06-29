
const Router = require('koa-router')();
const CateringPermissions = require('../../catering_permissions')
const Session = require('../../controller/catering/session')
const Customer = require('../../controller/catering/customer')

module.exports = function () {
    /**
     * 用户微信登陆
     */
    Router.post('/api/catering/v1/sessions', CateringPermissions('guest'), Session.wxLogin)

    // 用户信息
    Router.get('/api/catering/v1/customers/:uid', CateringPermissions('user'), Customer.detail)
    // 编辑用户
    Router.put('/api/catering/v1/customers/:uid', CateringPermissions('user'), Customer.edit)
    
    // 申请开通店铺
    Router.post('/api/catering/v1/customers/:uid/sellers', CateringPermissions('user'), Customer.applySeller)

    // 统一图片处理
    Router.post('/api/catering/v1/customers/:uid/oss', CateringPermissions('user'), Customer.oss)

    // 小程序码
    Router.post('/api/catering/v1/customers/:uid/mina_qrcodes', CateringPermissions('user'), Customer.minaQRcode)
    
    return Router;
}