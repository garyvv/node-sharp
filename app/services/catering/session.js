const ModelCustomer = require('../../model/catering/customer')
const WeChatSDK = require('../../util/wechat/wechat_sdk')
const Redis = require('../../libraries/redis')
const Constant = require('../../libraries/constant')
const Crypto = require('crypto')

module.exports = {
    wxLogin: async function (code, config) {
        let wechatSdk = new WeChatSDK(config)
        let result = await wechatSdk.minaLogin(code)
        let userInfo = await ModelCustomer.getCustomerByOpenId(result.openid)

        let uid
        let defaultStore = 0
        if (!userInfo) {
            let insertData = {
                'openid': result.openid
            }
            insertRes = await ModelCustomer.add(insertData)
            uid = insertRes.insertId
        } else {
            uid = userInfo.id
            defaultStore = userInfo.default_store
        }

        let salt = 'OPENID:' + result.openid + ':CATERING-LOGIN:' + new Date().getTime()
        let token = Crypto.createHash('md5').update(salt).digest('hex').toUpperCase()

        let ckey = Constant.CATERING_SESSION + token
        let cacheData = {
            'open_id': result.openid,
            'uid': uid,
        }
        Redis.set(ckey, JSON.stringify(cacheData))
        Redis.expire(ckey, 86400 * 30)

        let data = {
            'token': token,
            'uid': uid,
            'default_store': defaultStore
        }

        return data
    },


    getCustomerInfo: async function (customerId) {
        let cacheKey = Constant.CUSTOMER_INFO + customerId
        let customerInfo = await Redis.get(cacheKey)
        if (!customerInfo) {
            customerInfo = await ModelCustomer.detail({ id: customerId })
            if (!customerInfo) return false
            if (customerInfo) await Redis.set(cacheKey, JSON.stringify(customerInfo))
        } else {
            customerInfo = JSON.parse(customerInfo)
        }

        // 每次拿都刷新时间
        await Redis.expire(cacheKey, Constant.EXPIRE_REFRESH)

        return customerInfo
    },

}