// const MnsConfig = require('../../config/mns-beijing')
const Validate = require('request-validate')
const AliMNS = require("ali-mns")

//redis单例
class MnsSdk {
  constructor(config, queueName) {
    Validate(config, {
      'account_id': 'required',
      'access_id': 'required',
      'access_key': 'required',
      'end_point_name': 'required',
    })
    this.account_id = config.account_id
    this.access_id = config.access_id
    this.access_key = config.access_key
    this.queueName = queueName
    this.account = new AliMNS.Account(this.account_id, this.access_id, this.access_key)
    this.mq = new AliMNS.MQ(this.queueName, this.account, config.end_point_name)
  }

  async getMessage() {
    let data = await this.mq.recvP(5)

    let result = {}
    result.handle = data.Message.ReceiptHandle
    result.body = data.Message.MessageBody
    return result
  }

  deleteQueue(handle) {
    this.mq.deleteP(handle)
  }

}

module.exports = MnsSdk