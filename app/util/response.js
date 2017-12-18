
module.exports = {
    output: function (ctx, data, code = 200, msg = '请求成功') {
      var json = {}
      json.code = code
      json.message = msg
      json.data = data
      ctx.body = JSON.stringify(json)
      ctx.status = 200
    }
}