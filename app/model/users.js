const DB = require('../libraries/db')
const ModelBase = require('./base')

let table = 'fc_users'


module.exports = {

	getUserByOpenId: async function (openid) {

		let user = DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('openid', openid)

		return await user

	},

	getUser: async function (uid) {

		let user = DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('id', uid)

		return await user

	},

	addUser: async function (data) {
		let result = await ModelBase.execInsert(table, data)

		return await result
	},

	editUser: async function (data, where, notWhere = {}) {
		let result = await ModelBase.execUpdate(table, data, where, notWhere)

		return await result
	}

}