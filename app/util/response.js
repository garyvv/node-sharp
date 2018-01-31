
module.exports = {
  output: function (ctx, data, code = 200, msg = '请求成功') {
    var json = {}
    json.success = true
    json.code = code
    json.data = data
    json.message = msg

    ctx.body = JSON.stringify(json)
    ctx.status = 200
  }
}