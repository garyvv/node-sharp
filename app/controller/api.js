const response = require('../util/response.js')
const modelUser = require('../model/users')

module.exports = {

	test: async function (ctx, next) {
		console.log(ctx.params)
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

		let data = await modelUser.addUser(insertData)

		response.output(ctx, data)
	},

}