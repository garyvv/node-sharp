const Response = require('../util/response')
const Validate = require('../util/validate')
const General = require('../helpers/general')

module.exports = {

	detail: async function (ctx) {
		let templateId = ctx.params.templateId

		let templateInfo = {
			'id': templateId,
			'image': 'http://tools.miaoke.tech/images/card/bg' + templateId + '.png',
		}

		switch (templateId) {
			case '1':
				templateInfo.avatar = {
					'width': '6.6',
					'height': '6.6',
					'marginTop': '3.9'
				}
				templateInfo.textarea = {
					'marginTop': '2.8',
					'color': '#fff',
					'family': ''
				}
				break
			case '2':
				templateInfo.avatar = {
					'width': '6.6',
					'height': '6.6',
					'marginTop': '5'
				}
				templateInfo.textarea = {
					'marginTop': '2.8',
					'color': '#fff',
					'family': ''
				}
				break
			case '3':
				templateInfo.avatar = {
					'width': '7',
					'height': '7',
					'marginTop': '4.4'
				}
				templateInfo.textarea = {
					'marginTop': '2.8',
					'color': '#fff',
					'family': ''
				}
				break
			default:
				return Response.fail(ctx, 'error template id')
				break
		}

		return Response.output(ctx, templateInfo)
	},


}