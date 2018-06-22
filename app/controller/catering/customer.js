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

	/**
     * @api {put} /api/catering/v1/customer/:customerId 编辑用户信息
	 * @apiVersion 1.0.0
	 * @apiName 编辑用户信息
     * @apiGroup customer
     * @apiPermission user
	 * 
	 * @apiDescription API to edit the customer information.
	 * 
	 * @apiExample Example usage:
    	curl --request PUT \
			--url https://garylv.com/api/catering/v1/customers/1 \
			--header 'mina-source: catering' \
			--header 'store-id: 0'
	 * 
     * @apiParam {String} [nickName] nickName
     * @apiParam {String} [gender] gender
     * @apiParam {String} [avatarUrl] avatarUrl
     * @apiParam {String} [country] country
     * @apiParam {String} [province] province
     * @apiParam {String} [city] city
     * @apiParam {String} [mobile] mobile
     * @apiParam {String} [language] language
	 * 
	 * @apiSuccess {String} data response data
	 * 
     * @apiSuccessExample {json} Visual Preview:
		{
			"code": 200,
			"message": "请求成功",
			"data": {}
		}
	 * @apiSampleRequest https://garylv.com/api/catering/v1/customers/:customerId
     */
	edit: async function (ctx) {
		let updateData = {}
		if (!!ctx.input.nickName) updateData.nickname = ctx.input.nickName
		if (!!ctx.input.gender) updateData.gender = ctx.input.gender
		if (!!ctx.input.avatarUrl) updateData.avatar = ctx.input.avatarUrl
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