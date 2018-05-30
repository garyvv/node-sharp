module.exports = {

    isEmpty: async function(value) {
        return (Array.isArray(value) && value.length === 0) ||
            (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0)
    },

    /**
     * 二进制转十进制
     */
    bindec: async function(binNum) {
        let result = 0
        let total = binNum.length
        for (let index = 1; index <= total; index++) {
            let tmp = binNum.slice(total - index, total - index + 1)
            let tmpAdd = parseInt(tmp) * parseInt(Math.pow(2, index - 1))
            result += tmpAdd
        }

        return result
    },

    /**
     * 
     */
    today: async function(symbol = '') {
        let date = new Date()
        return date.getFullYear() + symbol + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + symbol + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    },

    versionCompare: function(v1, v2) {
        let version1pre = parseFloat(v1)
        let version2pre = parseFloat(v2)
        let version1next = v1.replace(version1pre + ".", "")
        let version2next = v2.replace(version2pre + ".", "")
        if (version1pre > version2pre) {
            return true;
        } else if (version1pre < version2pre) {
            return false;
        } else {
            if (version1next >= version2next) {
                return true;
            } else {
                return false;
            }
        }
    },

    checkObject: function(object, fields, tips) {
        let result = {}
        if (!UnderScore.isObject(object)) {
            console.log('not object')
            object = JSON.parse(object)
        }

        fields.forEach(element => {
            if (UnderScore.has(object, element) !== true) {
                throw new ApiError('validate.error', tips + ' 对象缺 ' + element + ' 属性')
            }
            result[element] = object[element]
        })

        return result
    },

}