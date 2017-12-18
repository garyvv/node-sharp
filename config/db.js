const config = require('./config.js')

const promiseMysql = require('promise-mysql');
const ioredis = require('ioredis');

const logger = require('../app/handlers/logger.js')

//db单例
class db{
  constructor(){

    this.redis = new ioredis(config.redis)
    logger.getLogger('system').trace('redis init')
    this.redis.on('error', function (err) {
      logger.getLogger('system').error('redis fail',err)
    });
  
    this.read_mysql = promiseMysql.createPool(config.read_mysql)
    logger.getLogger('system').trace('read_mysql init')

    this.write_mysql = promiseMysql.createPool(config.write_mysql)
    logger.getLogger('system').trace('write_mysql init')

  }
};

module.exports = new db();