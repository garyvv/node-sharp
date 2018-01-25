const response = require('../util/response.js')
const validate = require('../util/validate')
const modelUser = require('../model/users')

module.exports = {

	test: async function (ctx, next) {

		let rules = {
			'uid': 'required|numeric|in:"0","3","4"',
			'filter': 'in:1,2,3',
			'test': 'required'
		}

		let message = {
			'uid.required': 'kkkk',
			'uid.numeric': '数字数字',
			'uid.in': 'uid 必须在xxx范围内'
		}

		validate(ctx, rules, message)

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

		// let data = await modelUser.addUser(insertData)

		response.output(ctx, insertData)
	},

	edit: async function (ctx, next) {
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

		let data = await modelUser.editUser(updateData, where, notWhere)

		response.output(ctx, data)
	},

}