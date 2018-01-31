const Response = require('../util/response.js')
const Validate = require('../util/validate.js')
const ModelUser = require('../model/users')
const General = require('../helpers/general')

module.exports = {

	detail: async function (ctx) {

		let data = await ModelUser.getUser(ctx.uid)
		Response.output(ctx, data)
	},

	edit: async function (ctx) {
		console.log('--------- ctx-uid: --------' + ctx.uid)
		console.log(ctx.input.nickname)
		let updateData = {}
		if (!!ctx.input.nickname) updateData.nickname = ctx.input.nickname
		if (!!ctx.input.gender) updateData.gender = ctx.input.gender
		if (!!ctx.input.avatar) updateData.avatar = ctx.input.avatar
		if (!!ctx.input.country) updateData.country = ctx.input.country
		if (!!ctx.input.province) updateData.province = ctx.input.province
		if (!!ctx.input.city) updateData.city = ctx.input.city
		if (!!ctx.input.mobile) updateData.mobile = ctx.input.mobile
		if (!!ctx.input.language) updateData.language = ctx.input.language

		let where = {
			'id': ctx.uid,
		}

		if (await General.isEmpty(updateData)) {
			this.message = '更新内容不能为空'
			ctx.throw(500)
		} else {
			let data = await ModelUser.editUser(updateData, where)
			Response.output(ctx, {})
		}

	}

}