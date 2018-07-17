const Response = require('../../util/response')
const ServiceSeller = require('../../services/catering/seller')

module.exports = {
    /**
     * @api {get} /api/catering/v1/sellers/:sellerId/stores 商家的店铺列表
     * @apiGroup seller
     * @apiPermission user
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "data": [
                {
                    "seller_id": 1,
                    "name": "吕松东🇧🇷🇫🇷",
                    "thumb": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eo13vc2RhqKyJI8f5qaGCcj2ZeRfic696O0a2PDZvJ2JrGL8ia8EJHA6KjR37ia2neD11IBcNJ4HianZg/132",
                    "store_type_id": 0,
                    "theme": "",
                    "tel": "",
                    "wechat": "",
                    "license": "",
                    "address": "",
                    "approve_status": 0,
                    "status": 1,
                    "audit_id": 0,
                    "id": 1
                }
            ],
            "message": "请求成功"
        }
     */
    stores: async function (ctx) {
        let data = await ServiceSeller.storeList(ctx.uid)

        return Response.output(ctx, data)
    },


}
