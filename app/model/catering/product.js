const DB = require('../../libraries/db')
const ModelBase = require('../../model/base')
const _ = require('underscore')

const table = 'mist_product'

module.exports = {
    add: async function (data) {
        let res = await ModelBase.execInsert(table, data)
        return res;
    },

	list: async function (storeId, filter) {

		let result = DB.readMysql.select(
			'*'
		)
			.from(table)
			.where('store_id', storeId)
			.whereNot('status', -1)

		if (_.has(filter, 'status')) result.where('status', filter.status)

		if (_.has(filter, 'category_id')) {
			// todo
		}

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
		let result = ModelBase.execUpdate(table, data, where, notWhere)

		return await result
	}

}
