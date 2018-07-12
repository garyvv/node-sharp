const ModelCategory = require('../../model/catering/category')
const ApiError = require('../../util/api_error')
const Validate = require('request-validate')
const _ = require('underscore')

module.exports = {
    list: async function (storeId, filter = {}) {
        let result = await ModelCategory.list(storeId)
        return result
    },

    detail: async function (storeId, categoryId) {
        let result = await ModelCategory.first(categoryId)
        if (_.isEmpty(result)) {
            throw new ApiError('common.notExist', 'category')
        }

        if (result.store_id != storeId) {
            throw new ApiError('common.notExist', 'category')
        }

        if (result.status == -1) {
            throw new ApiError('common.notExist', 'category')
        }

        return result
    },

    add: async function (storeId, data) {
        Validate(data, {
            name: 'required',
        })

        let maxSortData = await ModelCategory.getMaxSort(storeId)
        let maxSort = 0
        if (!_.isEmpty(maxSortData)) maxSort = parseInt(maxSortData.sort)

        let insertData = {
            store_id: storeId,
            name: data.name,
            sort: maxSort + 1,
        }
        let insertResult = await ModelCategory.add(insertData)
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
            status: _.has(data, 'status') ? data.status : detail.status,
        }

        let editResult = await ModelCategory.edit(updateData, where)

        return updateData
    },

}
