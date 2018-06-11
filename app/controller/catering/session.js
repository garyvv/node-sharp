const ServiceSession = require('../../services/catering/session')
const Validate = require('request-validate');
const Response = require('../../util/response');
const Config = require('../../../config/config')

module.exports = {
    /**
     * @api {post} /api/catering/v1/sessions 用户微信登陆
     * @apiGroup session
     * @apiPermission guest
     * @apiParam {String} wx_js_code 小程序js_code
     * @apiParam {String} wx_encrypted_data 小程序用户加密数据
     * @apiParam {String} wx_iv 小程序微信iv
     * @apiParam {String} store_id 访问的小程序id,从header传递
     * @apiVersion 1.0.0
     * @apiSuccessExample {json} Visual Preview:
    {
        "code": 200,
        "message": "请求成功",
        "data": {
            "id": 2,
            "username": "oTj1As__sB0-n5qv8Cs5Le99k1jk",
            "unionid": "oTj1As__sB0-n5qv8Cs5Le99k1jk",
            "nickname": "大飞",
            "avatar": "https://wx.qlogo.cn/mmopen/vi_32/2I8gWeWUwNEXSNXaMVAmaCm48ibXBcCPWFc7pYT3b1XXD5KdkIIzd4Vyyoc3UHQQ2OgOFsialBJHv4MsI3YgHaCA/0",
            "user_balance": 0,
            "status": 1,
            "uid": 2,
            "gender": "0",
            "token": "1102e330-07bf-11e8-a078-1ff77849336d",
            "wx_openid": "oAXj6jnk9PEyDlTZRxktZ3kfUifo"
        }
    }
     */
    wxLogin:async function (ctx, next) {
        Validate(ctx.input, {
            // 'wx_js_code': 'required',
            // 'wx_encrypted_data': 'required',
            // 'wx_iv': 'required',
            'code': 'required',
        })
        let storeId = ctx.header['store-id']
        let config = ctx.header['mina-source']
        
        let result = await ServiceSession.wxLogin(ctx.input.code, config)
        return Response.output(ctx, result);
    },
}