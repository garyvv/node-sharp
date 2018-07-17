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
        let data = await Service${apiClass}.list()

        return Response.output(ctx, data)
    },

    /**
     * @api {get} /api/${folder}v1/${apiName}s/:${apiName}Id ${apiName}详情
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
    detail: async function (ctx) {
        let data = await Service${apiClass}.detail(ctx.params.${apiName}Id)

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
        let result = await Service${apiClass}.add(ctx.input)

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
        let result = await Service${apiClass}.edit(ctx.params.${apiName}Id, ctx.input)

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
        let data = {
            status: -1
        }
        let result = await Service${apiClass}.edit(ctx.params.${apiName}Id, data)
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
const Validate = require('request-validate')
const _ = require('underscore')

module.exports = {
    list: async function (kid) {
        let result = await Model${apiClass}.list(kid)
        return result
    },

    detail: async function (id) {
        let result = await Model${apiClass}.first(id)
        if (_.isEmpty(result)) {
            throw new ApiError('common.notExist', '${apiName}')
        }

        if (result.status == -1) {
            throw new ApiError('common.notExist', '${apiName}')
        }
        
        return result
    },

    add: async function (data) {
        Validate(data, {
            name: 'required',
        })
        let insertData = {
            name: data.name
        }
        let insertResult = await Model${apiClass}.add(insertData)
        insertData.id = insertResult.insertId

        return insertData
    },

    edit: async function (id, data) {
        let detail = await this.detail(id)

        let where = {
            id: id
        }

        let updateData = {
            name: _.has(data, 'name') ? data.name : detail.name,
            status: _.has(data, 'status') ? data.status : detail.status
        }

        let editResult = await Model${apiClass}.edit(updateData, where)

        return updateData
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
        let res = ModelBase.execInsert(table, data)
        return await res;
    },

	list: async function (kid) {

		let result = DB.readMysql.select(
			'*'
		)
			.from(table)
			.where('kid', kid)
			.where('status', '!=', -1)

		return await result

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
		let result = ModelBase.execUpdate(table, data, where, notWhere)

		return await result
	}

}
EOL

