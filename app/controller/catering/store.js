const Response = require('../../util/response')
const ServiceStore = require('../../services/catering/store')

module.exports = {
	/**
     * @api {get} /api/catering/v1/stores/:storeId 获取店铺信息
	 * @apiVersion 1.0.0
     * @apiGroup store
     * @apiPermission store
	 * 
	 * @apiDescription API to edit the customer information.
	 * 
	 * @apiExample Example usage:
    	curl --request PUT \
			--url https://garylv.com/api/catering/v1/stores/1 \
			--header 'mina-source: catering' \
			--header 'store-id: 1'
	 * 
	 * 
	 * @apiSuccess {String} data response data
	 * 
     * @apiSuccessExample {json} Visual Preview:
		{
			"success": true,
			"code": 200,
			"data": {
				"id": 1,
				"seller_id": 1,
				"name": "新视觉烧烤",
				"thumb": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eo13vc2RhqKyJI8f5qaGCcj2ZeRfic696O0a2PDZvJ2JrGL8ia8EJHA6KjR37ia2neD11IBcNJ4HianZg/132",
				"store_type_id": 0,
				"theme": "",
				"tel": "234",
				"wechat": "",
				"address": "12",
				"status": 1,
				"created_at": "2018-07-03T06:59:01.000Z",
				"updated_at": null
			},
			"message": "请求成功"
		}
	 * @apiSampleRequest https://garylv.com/api/catering/v1/stores/:storeId
     */
	detail: async function (ctx) {

		let data = await ServiceStore.getStore(ctx.params.storeId)
		return Response.output(ctx, data)
	},

}