const ModelCustomer = require('../../model/catering/customer')
const Redis = require('../../libraries/redis')
const Constant = require('../../libraries/constant')
const _ = require('underscore')

module.exports = {
    getCustomerInfo: async function (customerId) {
        let cacheKey = Constant.USER_INFO + customerId
        let result = await Redis.get(cacheKey)
        if (_.isEmpty(result)) {
            result = await ModelCustomer.first(customerId)
            if (_.isEmpty(result)) return false
            else await Redis.set(cacheKey, JSON.stringify(result))
        } else {
            result = JSON.parse(result)
        }

        // 每次拿都刷新时间
        await Redis.expire(cacheKey, Constant.EXPIRE_REFRESH)

        return result
    },

}