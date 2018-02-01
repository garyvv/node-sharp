
module.exports = {
  output: function (ctx, data, code = 200, msg = '请求成功') {
    var json = {}
    json.success = true
    json.code = code
    json.data = data
    json.message = msg

    ctx.body = JSON.stringify(json)
    ctx.status = 200
  },

  fail: function (ctx, msg = '操作失败', code = 500) {
    var json = {}
    json.success = false
    json.code = code
    json.data = {}
    json.message = msg

    ctx.body = JSON.stringify(json)
    ctx.status = 500
  }
}