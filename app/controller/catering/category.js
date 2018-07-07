const Validate = require('request-validate')
const Response = require('../../util/response')
const ServiceCategory = require('../../services/catering/category')

module.exports = {
    /**
     * @api {get} /api/catering/v1/categorys category列表
     * @apiGroup category
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
        let data = []

        return Response.output(ctx, data)
    },

    /**
     * @api {post} /api/catering/v1/categorys 新增category
     * @apiGroup category
     * @apiPermission todo
     * @apiVersion 1.0.0
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "message": "请求成功",
            "data": {
                "id": "1",
            }
        }
     */
    add: async function (ctx) {
        Validate(ctx.input, {
            name: 'required',
        })

        let result = []

        return Response.output(ctx, result)
    },

    /**
     * @api {put} /api/catering/v1/categorys/:categoryId 编辑category
     * @apiGroup category
     * @apiPermission todo
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} param 参数
     * @apiSuccess {String} data 返回数据
     * 
     * @apiSuccessExample {json} Visual Preview:
     * {
            "success": true,
            "code": 200,
            "message": "请求成功",
            "data": {
                "name": "name",
            }
        }
     */
    edit: async function (ctx) {
        Validate(ctx.input, {
            exchange_banner_id: 'numeric',
        })
        let result = await ServiceCategory.edit()

        return Response.output(ctx, result)
    },

    /**
     * @api {delete} /api/catering/v1/categorys/:categoryId 删除category
     * @apiGroup category
     * @apiPermission todo
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
        return Response.output(ctx)
    },

}
