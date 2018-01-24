const DB = require('../../config/db')
const ModelBase = require('./base')

let table = 'fc_users'
ModelBase.setTable(table)


module.exports = {

	getUserByOpenId: async function (openid) {

		let user = new Promise((resolve, reject) => {
			DB.read_mysql.query('select * from fc_users where openid = ?', openid).then(function (rows) {
				resolve(rows[0])
			}).catch(function (error) {
				console.log(error)
				reject(error)
			})
		})
		return await user

	},

	getUser: async function (uid) {

		let user = new Promise((resolve, reject) => {
			DB.read_mysql.query('select * from fc_users where id = ?', uid).then(function (rows) {
				resolve(rows[0])
			}).catch(function (error) {
				console.log(error)
				reject(error)
			})
		})
		return await user

	},

	addUser: async function (data) {
		let result = await ModelBase.execInsert(data)

		return await result
	},

	editUser: async function (data, where, notWhere = {}) {
		let result = await ModelBase.execUpdate(data, where, notWhere)

		return await result
	}

}