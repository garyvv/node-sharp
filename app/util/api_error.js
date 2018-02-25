const ApiErrorName = require('./api_error_name')

class ApiError extends Error {
    //构造方法
    constructor(errorName, ...params) {
        super()

        let errorInfo = ApiErrorName(errorName, params)

        this.name = errorName
        this.code = errorInfo.code
        this.message = errorInfo.message
    }
}

module.exports = ApiError
