//页面错误处理
module.exports = async function (ctx, next) {
	await next()
	if (parseInt(ctx.status) === 404) {
		ctx.body = {
			code: 404,
			success: false,
			data: [],
			msg: '没有找到页面'
		}
	}
	else if (parseInt(ctx.status) === 403) {
		ctx.body = {
			code: 403,
			success: false,
			data: [],
			msg: '权限不足'
		}
	}
}

