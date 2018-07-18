const _ = require('underscore')
const ApiError = require('../api_error')
const Request = require('request')
const WXBizDataCrypt = require('./WXBizDataCrypt.js')
const Redis = require('../../libraries/redis')
const fs = require('fs')
const Uuid = require('../../util/uuid')

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

    async get(url) {
        let result = await new Promise((resolve, reject) => {
            Request(url, function (err, response, body) {
                if (err) {
                    reject(err)
                }
                resolve(JSON.parse(body.toString()))
            })
        })
        return result
    }

    async post(url, data, headers = [{name: 'Content-Type', value: 'application/json'}]) {
        let options = {
            url: url,
            headers: headers,
            method: 'POST',
            form:  JSON.stringify(data),
            encoding: null
        }
        let result = await new Promise((resolve, reject) => {
            Request(options, function (err, response, body) {
                if (err) {
                    reject(err)
                }
                resolve({
                    headers: response.headers,
                    body: body
                })
            })
        })
        return result
    }

    async getAccessToken(refresh = false) {
        let cacheKey = 'NS:API:WECHAT:ACCESS_TOKEN'
        
        if (refresh === false) {
            let cacheData = await Redis.get(cacheKey)
            if (cacheData) return cacheData
        }

        let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + this.config.app_id + '&secret=' + this.config.app_secret 

        let result = await this.get(url)
        console.log(result)
        if (result && _.has(result, 'access_token')) {
            Redis.set(cacheKey, result.access_token, 'EX', 7200 - 300)
            return result.access_token
        }

        return ''
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

    async minaTmpQRCode(scene, page, options = { width: 430 }) {
        console.log(this.config)
        let url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + await this.getAccessToken()
        let postData = {
            page: page,
            scene: scene,
        }
        if (_.has(options, 'width')) {
            postData.width = options.width
        }
        if (_.has(options, 'auto_color')) {
            postData.auto_color = options.auto_color
        }
        if (_.has(options, 'line_color')) {
            postData.line_color = options.line_color
        }
        if (_.has(options, 'is_hyaline')) {
            postData.is_hyaline = options.is_hyaline
        }

        let postRes = await this.post(url, postData)
        let imgData = postRes.body
        let contentType = postRes.headers["content-type"]
        let imgName = await Uuid.genOrderNo() + '.' + contentType.split('/').pop()
        let imgFile =  __dirname + '/../../../static/' + imgName
        let img = await new Promise((resolve, reject) => {
            fs.writeFile(imgFile, imgData, function(err) {
                if(err) {
                    console.log(err)
                    reject(false)
                }
                resolve(true)
            })
        })
        if (img != true) {
            fs.unlink(imgFile)
            throw new ApiError('wechat.minaCode')
        }
        console.log(imgFile)

        return {
            img_name: imgName,
            img_file: imgFile,
            img_data: imgData
        }
    }

}

module.exports = WeChatSDK