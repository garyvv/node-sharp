const Redis = require('./libraries/redis')
const Constant = require('./libraries/constant')
const ApiError = require('./util/api_error')
const _ = require('underscore')
const ServiceAudit = require('./services/catering/audit')
const ServiceStore = require('./services/catering/store')

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

		async function checkAudit() {
			await checkToken()
			await isAudit()
			await next()
		}

		async function checkStore() {
			await checkToken()
			await ownerStore()
			await next()
		}

		async function isAudit() {
			let check = await ServiceAudit.getAudit(ctx.uid)
			if (_.isEmpty(check)) throw new ApiError('auth.error', 'no permission audit')
			return true
		}

		async function ownerStore() {
			let storeId = ctx.params.storeId
			let check = await ServiceStore.getStore(storeId)
			if (_.isEmpty(check)) throw new ApiError('auth.error', 'no permission store')
			if (check.seller_id != ctx.uid) throw new ApiError('auth.notPermission')
			return true
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
		} else if (permission === 'audit') {
			return await checkAudit()
		} else if (permission === 'store') {
			return await checkStore()
		} else {
			throw new ApiError('role.notExist')
		}

	}

}
