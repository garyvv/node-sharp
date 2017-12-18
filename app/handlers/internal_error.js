//处理内部错误，写错误日志

const logger = require('./logger.js')

module.exports = async function(ctx,next) {
  	let timeStart = new Date().getTime()
	try{
	
		await next()  
		let timeEnd = new Date().getTime()

		let req = ctx.request
		let res = ctx.response
		let fields = {
			status:res.status,
			accept:req.header['accept'],
			cookie:req.header['cookie'],
			ua:req.header['user-agent'],
		 	method:req.method,
		 	reqBody:req.body,
		 	url:req.url,
		 	consuminmg:timeEnd-timeStart
		}
	
		logger.getLogger().trace('success',fields)
	}catch(e){
		let status = e.status||500
		let msg = e.message||e
		ctx.status = status
		
		let req = ctx.request
		let res = ctx.response
		let timeEnd = new Date().getTime()
		let fields = {
			status:res.status,
			accept:req.header['accept'],
			cookie:req.header['cookie'],
			ua:req.header['user-agent'],
		 	method:req.method,
		 	reqBody:req.body,
		 	url:req.url,
		 	consuminmg:timeEnd-timeStart
		}
		
		console.log(fields)
		if(status === 500){
			//报错在console
			ctx.app.emit('error', e, this);
			//写错误日志
			logger.getLogger('error').error('error',fields);
		}
		else{
			logger.getLogger('exception').warn('error',fields);
		}
		

	}
};

