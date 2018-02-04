const Response = require('../util/response')
const Validate = require('../util/validate')
const Uuid = require('../util/uuid')
const ModelUser = require('../model/users')
const Redis = require('../libraries/redis')

module.exports = {

	test: async function (ctx) {

		console.log('controller input')
		console.log(ctx.input)
		console.log(ctx.params)

		let conflict = []
		let tmpNo = 'none'
		let orderNo = []
		for (let index = 0; index < 100; index++) {
			let genNo = await Uuid.genOrderNo()
			orderNo[index] = genNo
			if (genNo === tmpNo) {
				conflict.push(genNo)
			}
			tmpNo = genNo
		}
		orderNo.reverse()

		let orderResult = {
			"conflict": conflict,
			"order": orderNo
		}

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
				'name': 'te',
				'user_id': 1,
				'description': 'uni * 2'
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

		return Response.output(ctx, orderResult)
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

		return Response.output(ctx, data)
	},

}