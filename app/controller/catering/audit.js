const Response = require('../../util/response')
const ModelCustomer = require('../../model/catering/customer')
const ModelSeller = require('../../model/catering/seller')
const ModelStore = require('../../model/catering/store')
const ApiError = require('../../util/api_error')
const _ = require('underscore')

module.exports = {

	/**
     * @api {post} /api/catering/v1/audits/:uid/sellers/:sellerId 审核商家
	 * @apiVersion 1.0.0
     * @apiGroup audit
     * @apiPermission audit
	 * 
	 * @apiDescription 分销人员审核商家,默认给商家开一个店铺
	 * 
	 * 
	 * @apiSuccess {String} data response data
	 * 
     * @apiSuccessExample {json} Visual Preview:
		{
			"success": true,
			"code": 200,
			"data": {
				"seller_id": "1",
				"name": "新视觉烧烤",
				"thumb": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eo13vc2RhqKyJI8f5qaGCcj2ZeRfic696O0a2PDZvJ2JrGL8ia8EJHA6KjR37ia2neD11IBcNJ4HianZg/132",
				"tel": "234",
				"address": "12",
				"id": 1
			},
			"message": "请求成功"
		}
	 * @apiSampleRequest https://garylv.com/api/catering/v1/audits/:uid/sellers/:sellerId
     */
	seller: async function (ctx) {

		let sellerInfo = await ModelSeller.first(ctx.params.sellerId)
		if (_.isEmpty(sellerInfo)) {
			throw new ApiError('common.notExist', '商家')
		}
		if (sellerInfo.approve_status == 1) throw new ApiError('audit.hadPass')

		let storeData = {
			seller_id: ctx.params.sellerId,
			name: sellerInfo.company,
			thumb: sellerInfo.avatar,
			tel: sellerInfo.tel,
			address: sellerInfo.address,
		}

		let updateSeller = {
			approve_status: 1
		}

		let [data, u1] = await Promise.all([
			ModelStore.add(storeData),
			ModelSeller.edit(updateSeller, { seller_id: ctx.params.sellerId }),
		])
		storeData.id = data.insertId

		let updateCustomer = {
			default_store: storeData.id
		}
		await ModelCustomer.edit(updateCustomer, { id: ctx.params.sellerId })

		return Response.output(ctx, storeData)

	},

}