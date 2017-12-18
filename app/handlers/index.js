const compose = require ('koa-compose')

const httpError = require('./http_error')
const internalError = require('./internal_error')


module.exports = compose([
	httpError,
	internalError
])

