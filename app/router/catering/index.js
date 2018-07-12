
const Router = require('koa-router')();
const CateringPermissions = require('../../catering_permissions')
const Session = require('../../controller/catering/session')
const Customer = require('../../controller/catering/customer')
const Audit = require('../../controller/catering/audit')
const Store = require('../../controller/catering/store')
const Category = require('../../controller/catering/category')

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

    // 审核商家
    Router.post('/api/catering/v1/audits/:uid/sellers/:sellerId', CateringPermissions('audit'), Audit.seller)

    // 商店信息
    Router.get('/api/catering/v1/stores/:storeId', CateringPermissions('store'), Store.detail)
    
    // 商店分类
    Router.get('/api/catering/v1/stores/:storeId/categories', CateringPermissions('store'), Category.index)
    Router.post('/api/catering/v1/stores/:storeId/categories', CateringPermissions('store'), Category.add)
    Router.get('/api/catering/v1/stores/:storeId/categories/:categoryId', CateringPermissions('store'), Category.detail)
    Router.put('/api/catering/v1/stores/:storeId/categories/:categoryId', CateringPermissions('store'), Category.edit)
    Router.delete('/api/catering/v1/stores/:storeId/categories/:categoryId', CateringPermissions('store'), Category.delete)

    return Router;
}