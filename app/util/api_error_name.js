/**
 * API错误名称
 * 10000: 程序底层错误 SQL、redis链接查询错误
 * 20000: 参数校验错误 
 * 30000: 权限校验错误
 * 40000: 业务不匹配
 */
const apiErrorNames = {
    'db.queryError': { code: 10001, message: '查询异常'},
    'db.insertError': { code: 10002, message: '写入异常'},
    'db.updateError': { code: 10003, message: '更新异常'},

    'auth.error': { code: 30001, message: '登录异常 %s' }, // 判断 30001 ，终端引导登录
    'role.notExist': { code: 30002, message: '角色不存在' },

    'common.notExist': { code: 40001, message: ' %s 不存在' },
    'common.paramsEmpty': { code: 40002, message: ' %s 不能为空' },

    'validate.error': { code: 50001, message: '参数异常 %s ' },
}

module.exports = function (errorName, params) {
    if (!!apiErrorNames[errorName]) {
        params.forEach(element => {
            apiErrorNames[errorName].message = (apiErrorNames[errorName].message).replace('%s', element)
        })
        return apiErrorNames[errorName]
    } else {
        return {
            code: 5001,
            message: '服务器内部错误'

        }
    }
}
