const Redis = require('./libraries/redis')
const Constant = require('./libraries/constant')
const ApiError = require('./util/api_error')
module.exports = function (permission) {

	return async function (ctx, next) {

		async function checkToken() {
			let token = (typeof (ctx.request.headers.token) == 'undefined' || !ctx.request.headers.token) ?
				ctx.cookies.get('token') : ctx.request.headers.token
			let uid = (typeof (ctx.request.headers.uid) == 'undefined' || !ctx.request.headers.uid) ?
				ctx.cookies.get('uid') : ctx.request.headers.uid

			if (!token || !uid) {
				console.log('token: ' + token)
				console.log('uid: ' + uid)
				throw new ApiError('auth.error', 'token missing')
			}

			sessionKey = Constant.WECHAT_SESSION + token
			session = await Redis.get(sessionKey)
			session = JSON.parse(session)
			if (!session) {
				throw new ApiError('auth.error', 'token error')
			}

			if (session.uid == uid) {
				ctx.uid = uid
				return true
			} else {
				throw new ApiError('auth.error', 'no permission')
			}
			
		}

		async function checkUser() {
			await checkToken()
			await next()
		}

		// guest
		if (permission === 'guest') {
			await next()
		} else if (permission === 'user') {
			return await checkUser()
		} else {
			throw new ApiError('role.notExist')
		}

	}

}
