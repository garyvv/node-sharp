const Response = require('../../util/response')
const ServiceProduct = require('../../services/catering/product')

module.exports = {
    /**
     * @api {get} /api/catering/v1/stores/:storeId/products product列表
     * @apiGroup product
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
                    "id": 1,
                    "store_id": 1,
                    "title": "123",
                    "thumb": "products/1/sda",
                    "description": "ddd",
                    "price": 5,
                    "online_time": "2018-07-12T07:04:42.000Z",
                    "sort": 0,
                    "set_top": 0,
                    "product_type_id": 0,
                    "status": 1,
                    "approved_id": 1,
                    "viewed": 0,
                    "sales_volume": 0,
                    "created_at": "2018-07-12T07:04:42.000Z",
                    "updated_at": "2018-07-12T07:06:51.000Z"
                },
                {
                    "id": 2,
                    "store_id": 1,
                    "title": "炒螺",
                    "thumb": "products/1/sda",
                    "description": "ddd",
                    "price": 15,
                    "online_time": "2018-07-12T07:06:57.000Z",
                    "sort": 0,
                    "set_top": 0,
                    "product_type_id": 0,
                    "status": 0,
                    "approved_id": 1,
                    "viewed": 0,
                    "sales_volume": 0,
                    "created_at": "2018-07-12T07:06:57.000Z",
                    "updated_at": "2018-07-12T07:06:57.000Z"
                }
            ],
            "message": "请求成功"
        }
     */
    index: async function (ctx) {
        let data = await ServiceProduct.list(ctx.params.storeId)

        return Response.output(ctx, data)
    },

    /**
     * @api {get} /api/catering/v1/stores/:storeId/products/:productId product详情
     * @apiGroup product
     * @apiPermission store
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "data": {
                "id": 1,
                "store_id": 1,
                "title": "炒螺",
                "thumb": "products/1/sda",
                "description": "ddd",
                "price": 5,
                "online_time": "2018-07-12T07:04:42.000Z",
                "sort": 0,
                "set_top": 0,
                "product_type_id": 0,
                "status": 0,
                "approved_id": 1,
                "viewed": 0,
                "sales_volume": 0,
                "created_at": "2018-07-12T07:04:42.000Z",
                "updated_at": "2018-07-12T07:04:42.000Z"
            },
            "message": "请求成功"
        }
     */
    detail: async function (ctx) {
        let data = await ServiceProduct.detail(ctx.params.storeId, ctx.params.productId)

        return Response.output(ctx, data)
    },

    /**
     * @api {post} /api/catering/v1/stores/:storeId/products 新增product
     * @apiGroup product
     * @apiPermission store
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "data": {
                "title": "炒螺",
                "thumb": "products/1/sda",
                "description": "ddd",
                "price": "15",
                "store_id": "1",
                "id": 2
            },
            "message": "请求成功"
        }
     */
    add: async function (ctx) {
        let result = await ServiceProduct.add(ctx.params.storeId, ctx.input)

        return Response.output(ctx, result)
    },

    /**
     * @api {put} /api/catering/v1/stores/:storeId/products/:productId 编辑product
     * @apiGroup product
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
                "title": "123",
                "thumb": "products/1/sda",
                "description": "ddd",
                "price": 5,
                "status": "1"
            },
            "message": "请求成功"
        }
     */
    edit: async function (ctx) {
        let result = await ServiceProduct.edit(ctx.params.storeId, ctx.params.productId, ctx.input)

        return Response.output(ctx, result)
    },

    /**
     * @api {delete} /api/catering/v1/stores/:storeId/products/:productId 删除product
     * @apiGroup product
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
        let result = await ServiceProduct.edit(ctx.params.storeId, ctx.params.productId, data)
        return Response.output(ctx)
    },

}
