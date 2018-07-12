const DB = require('../../libraries/db')
const ModelBase = require('../../model/base')

const table = 'mist_category'

module.exports = {
	add: async function (data) {
		let res = await ModelBase.execInsert(table, data)
		return res;
	},

	list: async function (storeId) {

		let result = DB.readMysql.select(
			'*'
		)
			.from(table)
			.where('store_id', storeId)
			.where('status', '!=', -1)

		return await result

	},

	first: async function (id) {

		let result = DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('id', id)

		return await result

	},

	edit: async function (data, where, notWhere = {}) {
		let result = await ModelBase.execUpdate(table, data, where, notWhere)

		return await result
	},

	getMaxSort: async function (storeId) {
		return await DB.readMysql.first('sort').from(table).where({ store_id: storeId }).orderBy('sort', 'DESC')
	}

}
