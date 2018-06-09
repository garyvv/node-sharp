/**
 * API错误名称
 * 10000: 程序底层错误 SQL、redis链接查询错误
 * 20000: 参数校验错误 
 * 30000: 权限校验错误
 * 40000: 业务不匹配
 */
const apiErrorNames = {
    'db.queryError': { code: 1001, message: '查询异常', status: 500 },
    'db.insertError': { code: 1002, message: '写入异常', status: 500 },
    'db.updateError': { code: 1003, message: '更新异常', status: 500 },

    'wechat.configNotExist': { code: 20001, message: '微信配置文件不存在' },
    'wechat.common': { code: 20002, message: ' %s ' },

    'auth.error': { code: 3001, message: '登录异常 %s', status: 500 }, // 判断 3001 ，终端引导登录
    'role.notExist': { code: 3002, message: '角色不存在', status: 500 },
    'auth.notPermission': { code: 3003, message: '没有访问权限', status: 500 },
    'auth.forbiddenTeam': { code: 3004, message: '不支持团队版访问，请先切换个人身份', status: 500 },
    'auth.notMatch': { code: 3101, message: '帐号/密码不正确', status: 500 },

    'common.all': { code: 4000, message: ' %s ', status: 500 },
    'common.notExist': { code: 4001, message: ' %s 不存在', status: 500 },
    'common.hadExist': { code: 4002, message: ' %s 已存在', status: 500 },
    'common.statusOff': { code: 4003, message: ' %s 审核中', status: 500 },
    'warning': { code: 4004, message: ' %s ', status: 200 },
    'common.hadDelete': { code: 4006, message: ' %s 已删除', status: 500 },

    'validate.error': { code: 50001, message: '参数异常 %s ' },

}

module.exports = function (errorName, params) {
    if (apiErrorNames[errorName]) {
        let result = {
            code: apiErrorNames[errorName].code,
            message: apiErrorNames[errorName].message,
            status: apiErrorNames[errorName].status,
        }
        params.forEach(element => {
            result.message = (result.message).replace('%s', element)
        })
        return result
    } else {
        return {
            code: 5001,
            message: '服务器内部错误'

        }
    }
}
