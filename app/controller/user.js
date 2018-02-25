const Response = require('../util/response')
const Validate = require('../util/validate')
const ModelUser = require('../model/users')
const General = require('../helpers/general')
const ApiError = require('../util/api_error')

module.exports = {

	detail: async function (ctx) {

		let data = await ModelUser.getUser(ctx.uid)
		return Response.output(ctx, data)
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
			throw new ApiError('common.paramsEmpty', '更新内容')
		} else {
			let data = await ModelUser.editUser(updateData, where)
			return Response.output(ctx, {})
		}

	}

}