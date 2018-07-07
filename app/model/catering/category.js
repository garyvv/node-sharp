const DB = require('../../libraries/db')
const ModelBase = require('../../model/base')

const table = 'mist_category'

module.exports = {
    add: async function (data) {
        let res = await ModelBase.execInsert(table, data)
        return res;
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
	}

}
