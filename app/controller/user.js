const Response = require('../util/response.js')
const Validate = require('../util/validate.js')
const ModelUser = require('../model/users')
const General = require('../helpers/general')

module.exports = {

	detail: async function (ctx, next) {

		let data = await ModelUser.getUser(ctx.uid)
		Response.output(ctx, data)
	},

	edit: async function (ctx, next) {
		console.log('--------- ctx-uid: --------' + ctx.uid)
		console.log(ctx.request.body.nickname)
		let updateData = {}
		if (!!ctx.request.body.nickname) updateData.nickname = ctx.request.body.nickname
		if (!!ctx.request.body.gender) updateData.gender = ctx.request.body.gender
		if (!!ctx.request.body.avatar) updateData.avatar = ctx.request.body.avatar
		if (!!ctx.request.body.country) updateData.country = ctx.request.body.country
		if (!!ctx.request.body.province) updateData.province = ctx.request.body.province
		if (!!ctx.request.body.city) updateData.city = ctx.request.body.city
		if (!!ctx.request.body.mobile) updateData.mobile = ctx.request.body.mobile
		if (!!ctx.request.body.language) updateData.language = ctx.request.body.language

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