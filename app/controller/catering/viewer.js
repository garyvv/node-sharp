const Response = require('../../util/response')
const ServiceViewer = require('../../services/catering/viewer')
const ServiceCategories = require('../../services/catering/category')
const ServiceProducts = require('../../services/catering/product')
const Validate = require('request-validate')

module.exports = {
    /**
     * @api {get} /api/catering/v1/viewers viewer列表
     * @apiGroup viewer
     * @apiPermission todo
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "message": "请求成功",
            "data": [
                {
                    "id": 1,
                },
                ....
            ]
        }
     */
    index: async function (ctx) {
        let data = await ServiceViewer.list()

        return Response.output(ctx, data)
    },

    /**
     * @api {get} /api/catering/v1/viewers/:viewerId/categories 访问店铺的分类
     * @apiGroup viewer
     * @apiPermission guest
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "message": "请求成功",
            "data": [
                {
                    "id": 1,
                },
                ....
            ]
        }
     */
    categories: async function (ctx) {
        let data = await ServiceCategories.list(ctx.params.viewerId, { status: 1 })

        return Response.output(ctx, data)
    },

    /**
     * @api {get} /api/catering/v1/viewers/:viewerId/products 访问店铺的商品
     * @apiGroup viewer
     * @apiPermission guest
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "message": "请求成功",
            "data": [
                {
                    "id": 1,
                },
                ....
            ]
        }
     */
    products: async function (ctx) {
        Validate(ctx.input, {
            'category_id': 'required|nunumericm'
        })
        let data = await ServiceProducts.list(ctx.params.viewerId, { status: 1, categroy_id: ctx.input.category_id })

        return Response.output(ctx, data)
    },

}
