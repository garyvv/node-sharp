const Response = require('../util/response')
const Validate = require('../util/validate')
const General = require('../helpers/general')

module.exports = {

	list: async function (ctx) {

		let images = [
			{
				'name': 'name',
				'image': 'http://tools.miaoke.tech/images/card/bg1.png',
				'template_id': 1,
			},
			{
				'name': 'name',
				'image': 'http://tools.miaoke.tech/images/card/bg2.png',
				'template_id': 2,
			},
			{
				'name': 'name',
				'image': 'http://tools.miaoke.tech/images/card/bg3.png',
				'template_id': 3,
			},
		]

		return Response.output(ctx, images)
	},


}