const Response = require('../util/response.js')
const Validate = require('../util/validate')
const ModelUser = require('../model/users')
const Redis = require('../libraries/redis')

module.exports = {
	
	test: async function (ctx) {

		console.log('controller input')
		console.log(ctx.input)
		let rules = {
			'uid': 'numeric|in:"0","3","4"',
			'filter': 'in:1,2,3',
		}

		let message = {
			'uid.required': 'kkkk',
			'uid.numeric': '数字数字',
			'uid.in': 'uid 必须在xxx范围内'
		}

		Validate(ctx, rules, message)

		Redis.set('testkey', JSON.stringify(message))
		Redis.expire('testkey', 86400 * 30)

		let insertData = [
			{
				'name': 'test',
				'user_id': 1,
				'description': 'test'
			},
			{
				'name': 'test2',
				'user_id': 2,
				'description': 'test2'
			},
		]

		let sigleData = {
			'name': '测试',
			'user_id': 2,
			'description': 'test4'
		}

		let realInsertData = {
			'openid': 'test' + new Date().getTime()
		}
		// insertData = await ModelUser.addUser(realInsertData)

		Response.output(ctx, insertData)
	},

	edit: async function (ctx) {
		console.log(ctx.params)
		let updateData = {
			'name': '更新',
			'description': '更新测试'
		}

		let where = {
			'user_id': 2,
			'name': ['test', 'test2', 'test3']
		}

		let notWhere = {
			'description': ['test4', 'test3']
		}

		let data = await ModelUser.editUser(updateData, where, notWhere)

		Response.output(ctx, data)
	},

}