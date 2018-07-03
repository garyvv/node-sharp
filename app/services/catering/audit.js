const ModelAudit = require('../../model/catering/audit')
const Redis = require('../../libraries/redis')
const Constant = require('../../libraries/constant')
const _ = require('underscore')

module.exports = {
    getAudit: async function (auditId) {
        let cacheKey = Constant.AUDIT_INFO + auditId
        let auditInfo = await Redis.get(cacheKey)
        if (_.isEmpty(auditInfo)) {
            auditInfo = await ModelAudit.first(auditId)
            if (_.isEmpty(auditInfo)) return false
            else await Redis.set(cacheKey, JSON.stringify(auditInfo))
        } else {
            auditInfo = JSON.parse(auditInfo)
        }

        // 每次拿都刷新时间
        await Redis.expire(cacheKey, Constant.EXPIRE_REFRESH)

        return auditInfo
    },

}