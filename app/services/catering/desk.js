const ModelDesk = require('../../model/catering/desk')
const ApiError = require('../../util/api_error')
const Validate = require('request-validate')
const _ = require('underscore')

module.exports = {
    list: async function (storeId) {
        let result = await ModelDesk.list(storeId)
        return result
    },

    detail: async function (storeId, id) {
        let result = await ModelDesk.first(id)
        if (_.isEmpty(result)) {
            throw new ApiError('common.notExist', 'desk')
        }

        if (result.store_id != storeId) {
            throw new ApiError('common.notExist', 'desk')
        }

        if (result.status == -1) {
            throw new ApiError('common.notExist', 'desk')
        }
        
        return result
    },

    add: async function (storeId, data) {
        Validate(data, {
            name: 'required',
        })
        let insertData = {
            store_id: storeId,
            name: data.name
        }
        let insertResult = await ModelDesk.add(insertData)
        insertData.id = insertResult.insertId

        return insertData
    },

    edit: async function (storeId, id, data) {
        let detail = await this.detail(storeId, id)

        let where = {
            id: id
        }

        let updateData = {
            name: _.has(data, 'name') ? data.name : detail.name,
            status: _.has(data, 'status') ? data.status : detail.status
        }

        let editResult = await ModelDesk.edit(data, where)

        return updateData
    },

}
