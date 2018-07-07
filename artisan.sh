#!/bin/bash
set -e

if [ ! ${1} ]; then
  errmsg="${0##*/}: No argument"
  logger -s ${errmsg}
  echo "usage: ${0##*/} [apiName]"
  exit 1
fi

apiName=${1}
folder=''

# 两个参数，则默认第一个为文件夹
if [ ${2} ]; then
  folder=${1}'/'
  apiName=${2}
fi

apiClass=`echo ${apiName} | awk '{print toupper(substr($0,0,1))substr($0,2,length($0))}'`

# controller
controllerFile=app/controller/${folder}${apiName}.js
touch ${controllerFile}
cat > ${controllerFile} << EOL
const Validate = require('request-validate')
const Response = require('../../util/response')
const Service${apiClass} = require('../../services/${folder}${apiName}')

module.exports = {
    /**
     * @api {get} /api/${folder}v1/${apiName}s ${apiName}列表
     * @apiGroup ${apiName}
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
     * @api {post} /api/${folder}v1/${apiName}s 新增${apiName}
     * @apiGroup ${apiName}
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
     * @api {put} /api/${folder}v1/${apiName}s/:${apiName}Id 编辑${apiName}
     * @apiGroup ${apiName}
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
        let result = await Service${apiClass}.edit()

        return Response.output(ctx, result)
    },

    /**
     * @api {delete} /api/${folder}v1/${apiName}s/:${apiName}Id 删除${apiName}
     * @apiGroup ${apiName}
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
EOL

# services
servicesFile=app/services/${folder}${apiName}.js
touch ${servicesFile}
cat > ${servicesFile} << EOL
const Model${apiClass} = require('../../model/${folder}${apiName}')
const ApiError = require('../../util/api_error')

module.exports = {
    list: async function () {
        return []
    },

    detail: async function (id) {
        return await Model${apiClass}.first(id)
    },

    add: async function (data) {
        let insertResult = await Model${apiClass}.add(data)
        
        return insertResult
    },

    edit: async function (id, data) {
        let where = {
            id: id
        }
        let editResult = await Model${apiClass}.edit(data, where)

        return editResult
    },

}
EOL

# model
modelFile=app/model/${folder}${apiName}.js
touch ${modelFile}
cat > ${modelFile} << EOL
const DB = require('../../libraries/db')
const ModelBase = require('../../model/base')

const table = 'mist_${apiName}'

module.exports = {
    add: async function (data) {
        let res = await ModelBase.execInsert(table, data)
        return res;
    },

	first: async function (id) {

		let result = DB.readMysql.first(
			'*'
		)
			.from(table)
			.where('id', id)

		return await result

	},

	edit: async function (data, where, notWhere = {}) {
		let result = await ModelBase.execUpdate(table, data, where, notWhere)

		return await result
	}

}
EOL

