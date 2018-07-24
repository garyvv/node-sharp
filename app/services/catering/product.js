const ModelProduct = require('../../model/catering/product')
const ApiError = require('../../util/api_error')
const Validate = require('request-validate')
const _ = require('underscore')
const ConfigOss = require('../../../config/oss')

module.exports = {
    list: async function (storeId, filter = {}) {
        let result = await ModelProduct.list(storeId, filter)
        result.forEach(element => {
            element.thumb = ConfigOss.catering.view_server + element.thumb
            element.status_text = element.status == 1 ? '上架' : '下架'
        })
        return result
    },

    detail: async function (storeId, id) {
        let result = await ModelProduct.first(id)
        if (_.isEmpty(result)) {
            throw new ApiError('common.notExist', 'product')
        }

        if (result.store_id != storeId) {
            throw new ApiError('common.notExist', 'product')
        }

        if (result.status == -1) {
            throw new ApiError('common.notExist', 'product')
        }
        
        return result
    },

    add: async function (storeId, data) {
        Validate(data, {
            title: 'required',
            thumb: 'required',
            description: 'required',
            price: 'required',
        })
        let insertData = {
            title: data.title,
            thumb: data.thumb,
            description: data.description,
            price: data.price,
            store_id: storeId
        }
        let insertResult = await ModelProduct.add(insertData)
        insertData.id = insertResult.insertId

        return insertData
    },

    edit: async function (storeId, id, data) {
        let detail = await this.detail(storeId, id)

        let where = {
            id: id
        }

        let updateData = {
            title: _.has(data, 'title') ? data.title : detail.title,
            thumb: _.has(data, 'thumb') ? data.thumb : detail.thumb,
            description: _.has(data, 'description') ? data.description : detail.description,
            price: _.has(data, 'price') ? data.price : detail.price,
            status: _.has(data, 'status') ? data.status : detail.status
        }

        let editResult = await ModelProduct.edit(updateData, where)

        return updateData
    },

}
