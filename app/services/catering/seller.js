const ModelStore = require('../../model/catering/store')
const ServiceCustomer = require('../../services/catering/customer')
const ApiError = require('../../util/api_error')
const Validate = require('request-validate')
const _ = require('underscore')
const ConfigOss = require('../../../config/oss')

module.exports = {
    storeList: async function (sellerId) {
        let result = await ModelStore.getSellerStores(sellerId)
        
        // 默认开店
        if (result.length <= 0) {
            let customerInfo = await ServiceCustomer.getCustomerInfo(sellerId)
            let storeInfo = {
                seller_id: customerInfo.id,
                name: customerInfo.nickname,
                thumb: customerInfo.avatar,
                store_type_id: 0, theme: '', tel: '', wechat: '', license: '', address: '', 
                approve_status: 0, status: 1, audit_id: 0
            }
            let storeRes = await ModelStore.add(storeInfo)
            storeInfo.id = storeRes.insertId
            result = [storeInfo]
        }

        result.forEach(element => {
            element.preview_thumb = element.thumb
            element.preview_license = element.license
            if (element.thumb && element.thumb.indexOf('http') < 0) element.preview_thumb = ConfigOss.catering.view_server + element.thumb + '?x-oss-process=style/preview'
            if (element.license && element.license.indexOf('http') < 0) element.preview_license = ConfigOss.catering.view_server + element.preview_license + '?x-oss-process=style/preview'
        })

        return result
    },

}
