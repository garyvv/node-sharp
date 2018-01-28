const Response = require('../util/response.js')
const Validate = require('../util/validate.js')
const General = require('../helpers/general')

module.exports = {

	list: async function (ctx, next) {

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
		];

		Response.output(ctx, images)
	},


}