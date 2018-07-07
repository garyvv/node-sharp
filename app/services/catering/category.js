const ModelCategory = require('../../model/catering/category')
const ApiError = require('../../util/api_error')

module.exports = {
    list: async function () {
        return []
    },

    detail: async function (id) {
        return await ModelCategory.first(id)
    },

    add: async function (data) {
        let insertResult = await ModelCategory.add(data)
        
        return insertResult
    },

    edit: async function (id, data) {
        let where = {
            id: id
        }
        let editResult = await ModelCategory.edit(data, where)

        return editResult
    },

}
