var api = require('../controller/api.js')
var permissions = require('../permissions.js')

module.exports = function(router) {
    router.get('/api/v1/test', permissions('guest'), api.test);
    router.get('/api/v1/test/:test', permissions('user'), api.test);
};