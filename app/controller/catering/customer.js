const Response = require('../../util/response')
const Validate = require('request-validate')
const ModelCustomer = require('../../model/catering/customer')
const ModelSeller = require('../../model/catering/seller')
const ApiError = require('../../util/api_error')
const WeChatSDK = require('../../util/wechat/wechat_sdk')
const _ = require('underscore')
const OssSdk = require('../../libraries/ossSdk')
const ConfigOss = require('../../../config/oss')
const Uuid = require('../../libraries/uuid')

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

	},

	/**
     * @api {post} /api/catering/v1/customer/:customerId/seller 申请成为商家
	 * @apiVersion 1.0.0
     * @apiGroup customer
     * @apiPermission user
	 * 
	 * @apiDescription 普通用户申请开店
	 * 
     * @apiParam {String} company 店铺名称
     * @apiParam {String} avatar 店铺头像
     * @apiParam {String} tel 店铺联系电话
     * @apiParam {String} address 店铺地址
     * @apiParam {String} license 店铺营业执照路径
	 * 
	 * @apiSuccess {String} data response data
	 * 
     * @apiSuccessExample {json} Visual Preview:
		{
			"code": 200,
			"message": "请求成功",
			"data": {}
		}
	 * @apiSampleRequest https://garylv.com/api/catering/v1/customers/:customerId/sellers
     */
	applySeller: async function (ctx) {
		Validate(ctx.input, {
			company: 'required',
			avatar: 'required',
			tel: 'required',
			address: 'required',
			license: 'required',
		})

		let check = await ModelSeller.getByCustomerId(ctx.uid)
		if (check) {
			let updateData = {
				company: ctx.input.company,
				avatar: ctx.input.avatar,
				tel: ctx.input.tel,
				address: ctx.input.address,
				license: ctx.input.license,
			}
			await ModelSeller.edit(updateData, {customer_id: ctx.uid})
			updateData.customer_id = ctx.uid
			updateData.id = check.id
			return Response.output(ctx, updateData)
		}

		let insertData = {
			customer_id: ctx.uid,
			company: ctx.input.company,
			avatar: ctx.input.avatar,
			tel: ctx.input.tel,
			address: ctx.input.address,
			license: ctx.input.license,
		}

		let data = await ModelSeller.add(insertData)
		insertData.id = data.insertId
		return Response.output(ctx, insertData)

	},

	/**
     * @api {post} /api/catering/v1/customer/:customerId/mina_qrcodes 小程序码
	 * @apiVersion 1.0.0
     * @apiGroup customer
     * @apiPermission user
	 * 
	 * @apiDescription 小程序码
	 * 
     * @apiParam {String} action 行为['apply_seller']
     * @apiParam {String} action_id 行为ID
	 * 
	 * @apiSuccess {String} data response data
	 * 
     * @apiSuccessExample {json} Visual Preview:
		{
			"code": 200,
			"message": "请求成功",
			"data": {}
		}
	 * @apiSampleRequest https://garylv.com/api/catering/v1/customers/:customerId/mina_qrcodes
     */
	minaQRcode: async function (ctx) {
		Validate(ctx.input, {
			action: 'required|in:apply_seller',
			action_id: 'required|numeric',
		})

		let config = ctx.header['mina-source']
		let wechatSdk = new WeChatSDK(config)

		let sence = 'seller_id=' + ctx.input.action_id
		let page = 'pages/admin/seller/audit'
		let result = await wechatSdk.minaTmpQRCode(sence, page)

		return Response.output(ctx, result)

	},

	oss: async function (ctx) {
		console.log('inputttttttttttttt')
		console.log(ctx.input)
		console.log(ctx.input.files.content)
		console.log(ctx.input.files.content.path)

		let files = ctx.input.files.content
		let postData = ctx.input.fields

		Validate(postData, {
			folder: 'required'
		})

		let ossSdk = new OssSdk(ConfigOss.catering)
		let fileType = files.type.split('/').pop()
		let object = 'customer/' + ctx.uid + '/' + postData.folder + '/' +  await Uuid.genOrderNo() + '.' + fileType
		await ossSdk.uploadFile(object, files.path)

		let resp = {
			'object': object,
			'url': ConfigOss.catering.view_server + object
		}

		return Response.output(ctx, resp)
	}

}