const Response = require('../util/response.js')
const Validate = require('../util/validate.js')
const General = require('../helpers/general')

module.exports = {

	list: async function (ctx, next) {

		let images = [
			{
				'name': 'name',
				'image': 'http://toy.garylv.com/image/cache/catalog/Banner/bianxingjingang-1140x380.jpg',
				'target_id': 1,
				'target': 'product',
			},
			{
				'name': 'name',
				'image': 'http://toy.garylv.com/image/cache/catalog/Banner/IMG_5545-1140x380.JPG',
				'target_id': 1,
				'target': 'product',
			},
			{
				'name': 'name',
				'image': 'http://toy.garylv.com/image/cache/catalog/Banner/IMG_5548-1140x380.JPG',
				'target_id': 1,
				'target': 'product',
			},
		];

		Response.output(ctx, images)
	},


}