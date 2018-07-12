const Response = require('../../util/response')
const ServiceCategory = require('../../services/catering/category')

module.exports = {
    /**
     * @api {get} /api/catering/v1/stores/:storeId/categories category列表
     * @apiGroup category
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
                    "name": "早餐",
                    "sort": 2,
                    "status": 1,
                    "created_at": "2018-07-12T05:56:46.000Z",
                    "updated_at": "2018-07-12T05:56:46.000Z"
                },
                {
                    "id": 3,
                    "store_id": 1,
                    "name": "午餐",
                    "sort": 3,
                    "status": 1,
                    "created_at": "2018-07-12T05:57:00.000Z",
                    "updated_at": "2018-07-12T05:57:00.000Z"
                }
            ],
            "message": "请求成功"
        }
     */
    index: async function (ctx) {
        let data = await ServiceCategory.list(ctx.params.storeId)

        return Response.output(ctx, data)
    },


    /**
     * @api {get} /api/catering/v1/stores/:storeId/categories/:categoryId category详细
     * @apiGroup category
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
                "name": "早餐",
                "sort": 2,
                "status": 1,
                "created_at": "2018-07-12T05:56:46.000Z",
                "updated_at": "2018-07-12T05:56:46.000Z"
            },
            "message": "请求成功"
        }
     */
    detail: async function (ctx) {
        let data = await ServiceCategory.detail(ctx.params.storeId, ctx.params.categoryId)

        return Response.output(ctx, data)
    },

    /**
     * @api {post} /api/catering/v1/stores/:storeId/categories 新增category
     * @apiGroup category
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
                "name": "午餐",
                "sort": 3,
                "id": 3
            },
            "message": "请求成功"
        }
     */
    add: async function (ctx) {

        let result = await ServiceCategory.add(ctx.params.storeId, ctx.input)

        return Response.output(ctx, result)
    },

    /**
     * @api {put} /api/catering/v1/stores/:storeId/categories/:categoryId 编辑category
     * @apiGroup category
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
                "name": "早餐2"
            },
            "message": "请求成功"
        }
     */
    edit: async function (ctx) {
        let result = await ServiceCategory.edit(ctx.params.storeId, ctx.params.categoryId, ctx.input)

        return Response.output(ctx, result)
    },

    /**
     * @api {delete} /api/catering/v1/stores/:storeId/categories/:categoryId 删除category
     * @apiGroup category
     * @apiPermission store
     * @apiVersion 1.0.0
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "data": [],
            "message": "请求成功"
        }
     */
    delete: async function (ctx) {
        let data = {
            status: -1
        }
        await ServiceCategory.edit(ctx.params.storeId, ctx.params.categoryId, data)
        return Response.output(ctx, [])
    },

}
