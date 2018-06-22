const Config = require('../../config/config')
const Knex = require('knex')
const Logger = require('../handlers/logger')

//db单例
class DB {
  constructor() {
    try {
      this.readMysql = Knex({
        client: 'mysql',
        connection: {
          host: Config.read_mysql.host,
          user: Config.read_mysql.user,
          password: Config.read_mysql.password,
          database: Config.read_mysql.database,
          charset: 'utf8mb4',
          collation: 'utf8mb4_unicode_ci'
        },
        pool: { min: Config.read_mysql.minConnection, max: Config.read_mysql.maxConnection }
      })
      Logger.getLogger('system').trace('readMysql init')

      this.writeMysql = Knex({
        client: 'mysql',
        connection: {
          host: Config.write_mysql.host,
          user: Config.write_mysql.user,
          password: Config.write_mysql.password,
          database: Config.write_mysql.database,
          charset: 'utf8mb4',
          collation: 'utf8mb4_unicode_ci'
        },
        pool: { min: Config.write_mysql.minConnection, max: Config.write_mysql.maxConnection }
      })
      Logger.getLogger('system').trace('writeMysql init')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new DB()