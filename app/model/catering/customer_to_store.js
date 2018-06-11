const DB = require('../../libraries/db')
const ApiError = require('../../util/api_error')
const config = require('../../../config/config')
const ModelBase = require('../base')

const table = 'mist_customer_to_store'

module.exports = {
    add: async function (data) {
        let res = await ModelBase.execInsert(table, data)
        return res
    },
}