const Config = require('../../config/config')
const PromiseMysql = require('promise-mysql')
const Logger = require('../handlers/logger')

//db单例
class DB{
  constructor(){

    this.read_mysql = PromiseMysql.createPool(Config.read_mysql)
    Logger.getLogger('system').trace('read_mysql init')

    this.write_mysql = PromiseMysql.createPool(Config.write_mysql)
    Logger.getLogger('system').trace('write_mysql init')

  }
}

module.exports = new DB()