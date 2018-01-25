const config = require('../../config/config.js')

const ioredis = require('ioredis')

const logger = require('../handlers/logger.js')

//redis单例
class redis{
  constructor(){

    this.redis = new ioredis(config.redis)
    logger.getLogger('system').trace('redis init')
    this.redis.on('error', function (err) {
      logger.getLogger('system').error('redis fail',err)
    })
  
  }
}

module.exports = new redis().redis