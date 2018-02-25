const ApiError = require('../util/api_error')
const Constant = require('../libraries/constant')

module.exports = function (ctx, rules, message = {}) {
    let msgKey
    let input = ctx.input

    for (let field in rules) {
        rules[field].split('|').forEach(rule => {
            // 普通的message key名称
            msgKey = field + '.' + rule

            if (rule === 'required') {
                if (!!input[field] === false) {
                    let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 不能为空'
                    throw new ApiError('validate.error', msg)
                }
                return true
            }

            // 非必填项，有值再进行判断
            if (!!input[field] === false) return true

            // 特殊条件
            if (rule.indexOf(':') > 0) {
                let checkRule = rule.split(':')
                msgKey = field + '.' + checkRule[0]
                switch (checkRule[0]) {
                    case 'in':
                        let ruleData = checkRule[1].split(',')
                        // 数组
                        if (ruleData instanceof Array === true) {
                            if (ruleData.indexOf(input[field]) === -1) {
                                let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 非法'
                                throw new ApiError('validate.error', msg)
                            }
                        } else {
                            let msg = '规则设置错误'
                            throw new ApiError('validate.error', msg)
                        }
                        break
                    case 'min':
                        // todo
                        break
                    case 'max':
                        // todo
                        break
                    default:
                        console.log('error “：” rule: ' + rule)
                        let msg = '参数验证详细规则错误'
                        throw new ApiError('validate.error', msg)
                        break
                }
                return true
            }

            // 简单条件
            switch (rule) {
                case 'numeric':
                    if (isNaN(input[field]) === true) {
                        let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 必须为数字'
                        throw new ApiError('validate.error', msg)
                    }
                    break
                default:
                    console.log('error rule: ' + rule)
                    let msg = '参数验证规则错误'
                    throw new ApiError('validate.error', msg)
                    break
            }
            return true
        })

    }

}