const DB = require('../../libraries/db')
const config = require('../../../config/config')
const ModelBase = require('../../model/base')
const ApiError = require('../../util/api_error')

const table = 'mist_customer'

module.exports = {
    add: async function (data) {
        let res = await ModelBase.execInsert(table, data)
        return res;
    },

	getCustomerByOpenId: async function (openid) {

		let user = await DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('openid', openid)

		return user

	},

	first: async function (customerId) {

		let user = await DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('id', customerId)

		return user

	},

	edit: async function (data, where, notWhere = {}) {
		let result = await ModelBase.execUpdate(table, data, where, notWhere)

		return result
	}

}