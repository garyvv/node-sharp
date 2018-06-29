const AliOSS = require('ali-oss')
const Validate = require('request-validate')
const co = require('co')

//redis单例
class OssSdk {
    constructor(config) {
        Validate(config, {
            'region': 'required',
            'accessKeyId': 'required',
            'accessKeySecret': 'required',
            'bucket': 'required',
        })

        this.oss = new AliOSS(config)
    }

    async uploadFile(object, filepath) {
        let client = this.oss
        let putPromise = new Promise((resolve,reject) => {
            co(function* () {
                let result = yield client.put(object, filepath)
                if (result.res.status == 200) {
                    resolve(true)
                }
                resolve(false)
            }).catch(function (err) {
                reject(err)
            })
        })
        let result = await putPromise
        return result
    }

}

module.exports = OssSdk