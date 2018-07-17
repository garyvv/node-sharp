const DB = require('../../libraries/db')
const ModelBase = require('../../model/base')

const table = 'mist_seller'

module.exports = {
    add: async function (data) {
        let res = ModelBase.execInsert(table, data)
        return await res;
    },

	list: async function (kid) {

		let result = DB.readMysql.select(
			'*'
		)
			.from(table)
			.where('kid', kid)
			.where('status', '!=', -1)

		return await result

	},

	first: async function (id) {

		let result = DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('seller_id', id)

		return await result

	},

	edit: async function (data, where, notWhere = {}) {
		let result = ModelBase.execUpdate(table, data, where, notWhere)

		return await result
	}

}
