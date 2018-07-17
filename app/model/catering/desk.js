const DB = require('../../libraries/db')
const ModelBase = require('../../model/base')

const table = 'mist_desk'

module.exports = {
    add: async function (data) {
        let res = await ModelBase.execInsert(table, data)
        return res;
    },

	list: async function (storeId) {

		let result = await DB.readMysql.select(
			'*'
		)
			.from(table)
			.where('store_id', storeId)
			.where('status', '!=', -1)

		return result

	},

	first: async function (id) {

		let result = await DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('id', id)

		return result

	},

	edit: async function (data, where, notWhere = {}) {
		let result = await ModelBase.execUpdate(table, data, where, notWhere)

		return result
	}

}
