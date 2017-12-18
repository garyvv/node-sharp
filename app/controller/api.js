const response = require('../util/response.js')
module.exports = {

	test: async function (ctx, next) {
		console.log(ctx.params)
		let data = {
			'test': 'Hello'
		}
		response.output(ctx, data)
	}

}