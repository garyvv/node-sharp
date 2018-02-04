const MULTIPLY_BASE = 1000
var General = require('../helpers/general')

module.exports = {

  uniqueIdOfToday: async function (serverId = 1) {
    let timebase = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let time = Date.now() + Math.random()  // 没有锁，增加随机因子

    let elapse = (time - timebase) * MULTIPLY_BASE            // 阿里云执行保证不重复
    let elapseBin = (parseInt(Math.pow(2, 37) - 1) + parseInt(elapse)).toString(2) // 38bit
    let serverIdBin = (Math.pow(2, 4) - 1 + serverId).toString(2)     // 5bit // 1 to 2^4-1 ，即最大支持15台服务器
    let random = parseInt(Math.random() * (Math.pow(2, 6) - 1 - 1 + 1) + 1, 10)               //
    let randomBin = (Math.pow(2, 6) - 1 + random).toString(2)     // 7bit
    let resultBin = elapseBin + serverIdBin + randomBin   // 50bit
    // let result = await General.bindec(resultBin)
    let result = parseInt(resultBin, 2)
    return result
  },

  /* 在部署集群时需要修改不同机器的这个编号。范围1-15 */
  // 生成订单号
  genOrderNo: async function () {

    return await General.today() + await this.uniqueIdOfToday(1)//AppConfig:: getInstance() -> get('server_id')
  },

}