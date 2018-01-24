const Response = require('../util/response.js')
const Validate = require('../util/validate.js')
const ModelUser = require('../model/users')

module.exports = {

	detail: async function (ctx, next) {

		let data = await ModelUser.getUser(ctx.header.uid)
		Response.output(ctx, data)
	},

}