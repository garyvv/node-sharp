const Redis = require('./libraries/redis')
const Constant = require('./libraries/constant')
const ApiError = require('./util/api_error')
const _ = require('underscore')

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

			sessionKey = Constant.CATERING_SESSION + token
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

		// 检查header
		if (!_.has(ctx.request.headers, 'store-id')) {
			throw new ApiError('validate.error', 'store-id')
		}
		if (!_.has(ctx.request.headers, 'mina-source')) {
			throw new ApiError('validate.error', 'mina-source')
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
