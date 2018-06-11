const _ = require('underscore')
const ApiError = require('../api_error')
const Request = require('request')
const WXBizDataCrypt = require('./WXBizDataCrypt.js')

// 可配置的
const WECHAT_CONFIG = ['mina', 'catering']

class WeChatSDK {
    
    constructor(config) {
        if (_.indexOf(WECHAT_CONFIG, config) === -1) throw new ApiError('wechat.configNotExist')
        try {
            this.config = require('../../../config/wechat_' + config)
        } catch (e) {
            throw new ApiError('wechat.configNotExist')
        }
    }

    async minaLogin(code) {
        console.log(this.config)
        let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + this.config.app_id + '&secret=' + this.config.app_secret + '&js_code=' + code + '&grant_type=authorization_code'

		let result = await new Promise((resolve, reject) => {
			Request(url, function (err, response, body) {
				if (err) {
					reject(err)
				}
				resolve(JSON.parse(body.toString()))
			})
        })
        console.log(result)
        if (!_.has(result, 'openid')) {
            throw new ApiError('wechat.common', result.errcode + ' ' + result.errmsg)
        }
        
        return result
    }

    minaUserInfo(params) {
        let sessionData = this.minaSession(params.wx_js_code)
        try {
            let pc = new WXBizDataCrypt(this.config.app_id, sessionData.session_key)
            let info = pc.decryptData(params.wx_encrypted_data, params.wx_iv)
            return info
        } catch (err) {
            console.log(err)
            throw new ApiError('wechat.common', '解密微信信息错误')
        }
    }

    async minaSession(code) {
        let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.config.app_id}&secret=${this.config.app_secret}&js_code=${code}&grant_type=authorization_code`
        let sessionPromise = await new Promise((resolve, reject) => {
			Request(url, function (err, response, body) {
				if (err) {
					reject(err)
				}
				resolve(JSON.parse(body.toString()))
			})
		})

        let data = await sessionPromise
        console.log(data)
        if (data.errcode && data.errcode != 0) {
            throw new ApiError('wechat.common', data.errcode + ' ' + data.errmsg)
        }

        return data
    }

}

module.exports = WeChatSDK