//role:public,private,protect
//actions:get,post,put,delete
//relations:role,owner

const permissions = {
	"guest": [
		{ role: ['public'] }
	],
	"user": [
		{ role: ['private'] }
	],
}

const db = require('../config/db.js')
const redis = db.redis
module.exports = function (resource) {

	return async function (ctx, next) {

		async function pass() {
			await next()
		}

		async function checkToken() {
			let token = (typeof (ctx.request.headers.token) == 'undefined' || !ctx.request.headers.token) ?
				ctx.cookies.get('token') : ctx.request.headers.token
			let resourceUid = ctx.params.uid

			if (!token || !resourceUid) {
				return false
			}

			sessionKey = 'API:NODE:SESSION:' + token
			session = await redis.get(sessionKey)
			session = JSON.parse(session)
			if (!session) {
				return false
			}

			if (session.uid == resourceUid) {
				return true
			}

			return false
		}

		async function reject(code) {
			if (code === 401) await ctx.throw(401, '需要登陆')
			else if (code === 403) await ctx.throw(403, '权限不足')
			else if (code === 412) await ctx.throw(412, '不满足请求条件')
		}

		let permission = permissions[resource]
		let isInPermissions

		//public权限直接通过
		for (var i in permission) {
			if (permission[i].role.indexOf('public') >= 0) {
				isInPermissions = true
				await pass()
			}
		}

		//private权限验证token登陆通过,之后可能需要拓展角色权限
		for (var i in permission) {
			if (permission[i].role.indexOf('private') >= 0) {
				let check = await checkToken()
				if (!!check === true) {
					isInPermissions = true
					await pass()
				}
			}
		}

		if (!isInPermissions) await reject(403);
	}

};
