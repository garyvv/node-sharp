module.exports = {

    isEmpty: async function (value) {
        return (Array.isArray(value) && value.length === 0)
            || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0)
    },

    /**
     * 二进制转十进制
     */
    bindec: async function (binNum) {
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
    today: async function (symbol = '') {
        let date = new Date()
        return date.getFullYear() + symbol + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + symbol + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    }

}