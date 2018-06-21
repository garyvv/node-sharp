const Response = require('../../util/response')
const Validate = require('request-validate')
const ModelCustomer = require('../../model/catering/customer')
const ApiError = require('../../util/api_error')
const _ = require('underscore')

module.exports = {

	detail: async function (ctx) {

		let data = await ModelCustomer.first(ctx.uid)
		return Response.output(ctx, data)
	},

	edit: async function (ctx) {
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

		if (_.isEmpty(updateData)) {
			throw new ApiError('common.paramsEmpty', '更新内容')
		} else {
			let data = await ModelCustomer.edit(updateData, where)
			return Response.output(ctx, {})
		}

	}

}