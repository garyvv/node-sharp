//页面错误处理
module.exports = async function (ctx, next) {
	await next();
	if (parseInt(ctx.status) === 404) {
		ctx.body = {
			code: 500,
			success: false,
			data: [],
			msg: '没有找到页面'
		}
	}
	else if (parseInt(ctx.status) === 403) {
		ctx.body = {
			code: 500,
			success: false,
			data: [],
			msg: '权限不足'
		}
	}
	else if (parseInt(ctx.status) === 500) {
		ctx.body = {
			code: 500,
			success: false,
			data: [],
			msg: !!this.message === true ? this.message : '内部错误,服务器开小差'
		}
	}
};

