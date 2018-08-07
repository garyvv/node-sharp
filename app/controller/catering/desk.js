const Response = require('../../util/response')
const ServiceDesk = require('../../services/catering/desk')
const WeChatSDK = require('../../util/wechat/wechat_sdk')
const OssSdk = require('../../libraries/ossSdk')
const ConfigOss = require('../../../config/oss')
const fs = require('fs')

module.exports = {
    /**
     * @api {get} /api/catering/v1/stores/:storeId/desks desk列表
     * @apiGroup desk
     * @apiPermission store
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "data": [
                {
                    "id": 2,
                    "store_id": 1,
                    "name": "江边1",
                    "sort": 0,
                    "status": 1,
                    "created_at": "2018-07-12T06:50:27.000Z",
                    "updated_at": "2018-07-12T06:50:27.000Z"
                }
            ],
            "message": "请求成功"
        }
     */
    index: async function (ctx) {
        let data = await ServiceDesk.list(ctx.params.storeId)

        return Response.output(ctx, data)
    },

    /**
     * @api {get} /api/catering/v1/stores/:storeId/desks/:deskId desk详情
     * @apiGroup desk
     * @apiPermission store
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "data": {
                "id": 2,
                "store_id": 1,
                "name": "江边1",
                "sort": 0,
                "status": 1,
                "created_at": "2018-07-12T06:50:27.000Z",
                "updated_at": "2018-07-12T06:50:27.000Z"
            },
            "message": "请求成功"
        }
     */
    detail: async function (ctx) {
        let data = await ServiceDesk.detail(ctx.params.storeId, ctx.params.deskId)

        return Response.output(ctx, data)
    },

    /**
     * @api {post} /api/catering/v1/stores/:storeId/desks 新增desk
     * @apiGroup desk
     * @apiPermission store
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "data": {
                "store_id": "1",
                "name": "江边1",
                "id": 2
            },
            "message": "请求成功"
        }
     */
    add: async function (ctx) {
        let result = await ServiceDesk.add(ctx.params.storeId, ctx.input)

        return Response.output(ctx, result)
    },

    /**
     * @api {put} /api/catering/v1/stores/:storeId/desks/:deskId 编辑desk
     * @apiGroup desk
     * @apiPermission store
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * 
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "data": {
                "name": "haibian",
                "status": 1
            },
            "message": "请求成功"
        }
     */
    edit: async function (ctx) {
        let result = await ServiceDesk.edit(ctx.params.storeId, ctx.params.deskId, ctx.input)

        return Response.output(ctx, result)
    },

    /**
     * @api {delete} /api/catering/v1/stores/:storeId/desks/:deskId 删除desk
     * @apiGroup desk
     * @apiPermission store
     * @apiVersion 1.0.0
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "message": "请求成功",
            "data": {}
        }
     */
    delete: async function (ctx) {
        let data = {
            status: -1
        }
        let result = await ServiceDesk.edit(ctx.params.storeId, ctx.params.deskId, data)
        return Response.output(ctx)
    },


	/**
     * @api {post} /api/catering/v1/stores/:storeId/desk_qrcodes/:deskId 桌子小程序码
	 * @apiVersion 1.0.0
     * @apiGroup desk
     * @apiPermission store
	 * 
	 * @apiDescription 桌子小程序码
	 * 
	 * @apiSuccess {String} data response data
	 * 
     * @apiSuccessExample {json} Visual Preview:
		{
			"code": 200,
			"message": "请求成功",
			"data": {}
		}
	 * @apiSampleRequest https://garylv.com/api/catering/v1/stores/:storeId/desk_qrcodes/:deskId
     */
	minaQRcode: async function (ctx) {
        // check
        let data = await ServiceDesk.detail(ctx.params.storeId, ctx.params.deskId)
        
		let config = ctx.header['mina-source']
		let wechatSdk = new WeChatSDK(config)

		let sence = 'desk_id=' + ctx.params.deskId
		let page = 'pages/viewer/store'
		let imgResult = await wechatSdk.minaTmpQRCode(sence, page)

		let ossSdk = new OssSdk(ConfigOss.catering)
		let object = 'store/' + ctx.params.storeId + '/qrcode/desk-' + ctx.params.deskId + '.' + imgResult.img_type
		await ossSdk.uploadFile(object, imgResult.img_file)

		fs.unlink(imgResult.img_file, function (err) {
			if (err) {
				console.log(err)
			}
			console.log('文件:' + imgResult.img_file + '删除成功！')
		})

		let result = {
			'object': object,
			'url': ConfigOss.catering.view_server + object
		}

		return Response.output(ctx, result)

	},
}
