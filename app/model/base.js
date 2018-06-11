const DB = require('../libraries/db')
const ApiError = require('../util/api_error')

const COMMON_STATUS_NORMAL = 1
const COMMON_STATUS_OFFLINE = 0


function normalInsertData(table, data, mode = false) {

	if (!table) return false

	let prepareData = []

	if (!!data[0]) {
		prepareData = data
	} else {
		prepareData[0] = data
	}

	// deal insert keys
	let keys = ''
	for (let key in prepareData[0]) {
		keys += '`' + key + '`,'
	}
	keys = keys.slice(0, -1)
	// console.log(...Object.keys(prepareData[0]))

	// row
	let rowNum = prepareData.length

	// col
	let colNum = Object.keys(prepareData[0]).length

	let symbol = '?, '
	let rowValue = '(' + ''.padEnd(symbol.length * colNum, symbol).slice(0, -2) + '),'

	let values = ''.padEnd(rowValue.length * rowNum, rowValue).slice(0, -1) + ''

	let sql
	if (mode === 'ignore') {
		sql = 'INSERT IGNORE INTO `' + table + '`(' + keys + ') VALUES ' + values
	}
	else if (mode === 'update') {
		// values = values.slice(0, -1)
		let keyArr = Object.keys(prepareData[0])
		let modeRaw = ''
		keyArr.forEach(key => {
			modeRaw += '`' + key + '` = VALUES(' + key + '),'
		})
		modeRaw = modeRaw.slice(0, -1)

		sql = 'INSERT INTO `' + table + '`(' + keys + ') VALUES ' + values + ' ON DUPLICATE KEY UPDATE ' + modeRaw
	}
	else {
		sql = 'INSERT INTO `' + table + '`(' + keys + ') VALUES ' + values
	}

	let finalData = []
	prepareData.forEach(element => {
		for (let k in element) {
			finalData.push(element[k])
		}
	})
	return {
		sqlStr: sql,
		sqlData: finalData
	}
}


function normalUpdateData(table, data, where, notWhere = {}) {
	if (!table) return false

	let prepareData = []

	// set
	let setSql = ''
	for (let key in data) {
		if (data[key] === undefined) continue;
		setSql += (key + ' = ' + '?, ')
		prepareData.push(data[key])
	}
	setSql = setSql.slice(0, -2)

	// where
	let whereSql = ''
	for (let wk in where) {
		if (where[wk] instanceof Array === true) {
			let tmpSql = wk + ' IN ('
			where[wk].forEach(element => {
				tmpSql += '?, '
				prepareData.push(element)
			})
			tmpSql = tmpSql.slice(0, -2) + ') AND '
			whereSql += tmpSql
		}
		else {
			whereSql += (wk + ' = ' + '? AND ')
			prepareData.push(where[wk])
		}
	}
	whereSql = whereSql.slice(0, -5)

	// notWhere
	let notWhereSql = ''
	if (!!notWhere) {
		notWhereSql = ' AND '
		for (let nk in notWhere) {
			if (notWhere[nk] instanceof Array === true) {
				let tmpSql = nk + ' NOT IN ('
				notWhere[nk].forEach(element => {
					tmpSql += '?, '
					prepareData.push(element)
				})
				tmpSql = tmpSql.slice(0, -2) + ') AND '
				notWhereSql += tmpSql
			}
			else {
				notWhereSql += (nk + ' != ' + '? AND ')
				prepareData.push(notWhere[nk])
			}
		}
		notWhereSql = notWhereSql.slice(0, -5)
	}

	let sql = 'UPDATE `' + table + '` SET ' + setSql + ' WHERE ' + whereSql + notWhereSql
	return {
		sqlStr: sql,
		sqlData: prepareData
	}
}


module.exports = {

	statusNormal() { return COMMON_STATUS_NORMAL },
	statusOffline() { return COMMON_STATUS_NORMAL },

	query: async function (sql, data, link = 'plat') {
		return await DB.readMysql.raw(sql, ...data).then(function (resp) {
			if (!!resp[0]) return resp[0]
			else return []
		}).catch(function (error) {
			console.log(error)
			throw new ApiError('db.queryError')
		})
	},

	// mode ： ignore | update
	execInsert: async function (table, data, mode = false, link = 'plat') {

		let res = normalInsertData(table, data, mode)
		if (!res) return res

		let dbLink = DB.writeMysql
		if (link === 'mist') dbLink = DB.mist_write

		let result = dbLink.raw(res.sqlStr, res.sqlData).then(function (resp) {
			if (!!resp[0]) return resp[0]
			else return resp
		}).catch(function (error) {
			console.log(error)
			console.log(res.sqlStr)
			console.log(res.sqlData)
			throw new ApiError('db.insertError')
		})

		return await result
	},

	execUpdate: async function (table, data, where, notWhere = {}, link = 'plat') {

		let res = normalUpdateData(table, data, where, notWhere)
		if (!res) return res

		let dbLink = DB.writeMysql
		if (link === 'mist') dbLink = DB.mist_write
		let result = dbLink.raw(res.sqlStr, res.sqlData).then(function (resp) {
			if (!!resp[0]) return resp[0]
			else return []
		}).catch(function (error) {
			console.log(error)
			console.log(res.sqlStr, res.sqlData)
			throw new ApiError('db.updateError')
		})

		return await result
	},

	normalInsertData,
	normalUpdateData,

	execInsertWidthTransact: async function (table, data, config = {mode:false, link:'plat', transact:null}){
		let res = normalInsertData(table,data,config.mode);
		if(!res) return res;

		let dbLink = DB.writeMysql
		if (config.link === 'mist') dbLink = DB.mist_write

        let con = config.transact || dbLink
		let promise = con.raw(res.sqlStr,res.sqlData)
                    .then(function(resp){
                        if(!!resp[0])return resp[0]
                        else return resp
                    }).catch(function(err){
                        console.log(err);
                        throw(new ApiError('db.insertError'));
                    })
        return promise
	},

	execUpdateWidthTransact: async function (table, data, where, config = {notWhere: {}, transact:null, link: 'plat'}) {

		let res = normalUpdateData(table, data, where, config.notWhere)
		if (!res) return res

		let dbLink = DB.writeMysql
		if (config.link === 'mist') dbLink = DB.mist_write

		let con = config.transact || dbLink
		let promise = con.raw(res.sqlStr, res.sqlData).then(function (resp) {
			if (!!resp[0]) return resp[0]
			else return resp
		}).catch(function (error) {
			console.log(error)
			console.log(res.sqlStr, res.sqlData)
			throw new ApiError('db.updateError')
		})

		return promise

	},

}