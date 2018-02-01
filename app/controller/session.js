const Response = require('../util/response')
const Validate = require('../util/validate')
const ModelUser = require('../model/users')
const WechatMina = require('../../config/wechat_mina')
const Request = require('request')
const Constant = require('../libraries/constant')
const Redis = require('../libraries/redis')
const Crypto = require('crypto')

module.exports = {

	login: async function (ctx) {

		Validate(ctx, {
			'code': 'required',
		})

		let appId = WechatMina.app_id
		let appSecret = WechatMina.app_secret
		code = ctx.request.body.code

		let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + appSecret + '&js_code=' + code + '&grant_type=authorization_code'

		let result = await new Promise((resolve, reject) => {
			Request(url, function (err, response, body) {
				if (err) {
					reject(err)
				}
				resolve(JSON.parse(body.toString()))
			})
		})

		// result.openid = 'test' + new Date().getTime() // debug

		if (!!result.openid) {
			let userInfo = await ModelUser.getUserByOpenId(result.openid)
			let uid

			if (!!userInfo === false) {
				let insertData = {
					'openid': result.openid
				}
				insertRes = await ModelUser.addUser(insertData)
				uid = insertRes.insertId
			} else uid = userInfo.id

			let salt = 'OPENID:' + result.openid + ':CARD-LOGIN:' + new Date().getTime()
			let token = Crypto.createHash('md5').update(salt).digest('hex').toUpperCase()

			let ckey = Constant.WECHAT_SESSION + token
			let cacheData = {
				'open_id': result.openid,
				'uid': uid,
			}
			Redis.set(ckey, JSON.stringify(cacheData))
			Redis.expire(ckey, 86400 * 30)

			let data = {
				'token': token,
				'uid': uid
			}

			Response.output(ctx, data)
		} else {
			this.message = 'code 错误'
			ctx.throw(500)
		}


	},


}