const DB = require('../../libraries/db')
const ModelBase = require('../../model/base')

const table = 'mist_audit'

module.exports = {
    add: async function (data) {
        let res = await ModelBase.execInsert(table, data)
        return res;
    },

	first: async function (id) {

		let result = await DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('audit_id', id)
			.where('status', 1)

		return result

	},

	edit: async function (data, where, notWhere = {}) {
		let result = await ModelBase.execUpdate(table, data, where, notWhere)

		return result
	}

}