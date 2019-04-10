const ModelStore = require('../../model/catering/store')
const Redis = require('../../libraries/redis')
const Constant = require('../../libraries/constant')
const _ = require('underscore')

module.exports = {
    getStore: async function (id) {
        let cacheKey = Constant.STORE_INFO + id
        let result = await Redis.get(cacheKey)
        if (_.isEmpty(result)) {
            result = await ModelStore.first(id)
            if (_.isEmpty(result)) return false
            
            result.preview_thumb = result.thumb
            result.preview_license = result.license
            if (result.thumb && result.thumb.indexOf('http') < 0) result.preview_thumb = ConfigOss.catering.view_server + result.thumb + '?x-oss-process=style/preview'
            if (result.license && result.license.indexOf('http') < 0) result.preview_license = ConfigOss.catering.view_server + result.preview_license + '?x-oss-process=style/preview'
            
            // set Cache
            await Redis.set(cacheKey, JSON.stringify(result))
        } else {
            result = JSON.parse(result)
        }

        // 每次拿都刷新时间
        await Redis.expire(cacheKey, Constant.EXPIRE_REFRESH)

        return result
    },

}
