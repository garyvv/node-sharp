const Constant = require('../../libraries/constant')
const Moment = require('moment')
const Redis = require('../../../config/db').redis
const ModelStatisticsStore = require('../../../app/model/mist/statisticsStore')

var INSERT_PER_TIMES = 1000

var statistics = async function () {
    let accessDate = Moment().subtract(1, 'days').format('YYYY-MM-DD')
    let statisticsDay = Moment().subtract(1, 'days').format('YYYYMMDD')
    // let accessDate = Moment().format('YYYY-MM-DD')
    // let statisticsDay = Moment().format('YYYYMMDD')
    let uvCachePrefix = 'MIST:ST_UV:DATE:' + statisticsDay + ':STORE_ID:'
    let pvCacheKey = 'MIST:ST_PV:DATE:' + statisticsDay

    // 根据storeID前缀 1-9 
    let keywords
    let uvKeys

    // insert update data
    let insertData = []

    for (let index = 1; index < 10; index++) {
        keywords = uvCachePrefix + index.toString() + '*'
        uvKeys = await Redis.keys(keywords)
        for (let i = 0; i < uvKeys.length; i++) {
            element = uvKeys[i]
            let storeId = element.replace(uvCachePrefix, '')

            let tmpUv = await Redis.bitcount(element)
            let tmpPv = await Redis.hget(pvCacheKey, storeId)

            let tmp = {
                store_id: storeId,
                access_date: accessDate,
                pv: tmpPv,
                uv: tmpUv,
            }
            // console.log(tmp)
            // console.log('---------------------------')

            insertData.push(tmp)
            // 每1000条插入一次
            if (insertData.length >= INSERT_PER_TIMES) {
                console.log('---- insert DB ---- count: ' + insertData.length)
                ModelStatisticsStore.add(insertData)
                insertData.length = 0
            }
            
        }
    }

    if (insertData.length > 0) {
        console.log('---- last insert DB ---- count: ' + insertData.length)
        await ModelStatisticsStore.add(insertData)
    }

    // update total
    await ModelStatisticsStore.updateStatisticsTotal(accessDate)
    console.log('ok statistics.js ' + Moment().format('YYYYMMDD HH:mm:ss'))
}

module.exports = statistics