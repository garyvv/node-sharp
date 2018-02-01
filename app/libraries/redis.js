const Config = require('../../config/config')
const Ioredis = require('ioredis')
const Logger = require('../handlers/logger')

//redis单例
class Redis {
  constructor() {

    this.redis = new Ioredis(Config.redis)
    Logger.getLogger('system').trace('redis init')
    this.redis.on('error', function (err) {
      Logger.getLogger('system').error('redis fail', err)
    })

  }
}

module.exports = new Redis().redis