const Compose = require ('koa-compose')

const HttpError = require('./http_error')
const InternalError = require('./internal_error')
const Input = require('./input')

module.exports = Compose([
	HttpError,
	InternalError,
	Input
])

