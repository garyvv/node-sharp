const db = require('../../config/db.js')
var table;

module.exports = {

	setTable(t) {
		table = t
	},
	
	execInsert:async function(data, mode = false, link = 'plat'){ 

		if (!table) return false;

		let prepareData = [];

		if (!!data[0]) {
			prepareData = data
		} else {
			prepareData[0] = data
		}

		// deal insert keys
		let keys = '';
		for(let key in prepareData[0]) {
			keys += '`' + key + '`,'
		}
		keys = keys.slice(0, -1)
		// console.log(...Object.keys(prepareData[0]))

		// row
		let rowNum = prepareData.length;

		// col
		let colNum = Object.keys(prepareData[0]).length

		let symbol = '?, '
		let rowValue = '(' + ''.padEnd(symbol.length * colNum, symbol).slice(0, -2) + '),'

		let values = ''.padEnd(rowValue.length * rowNum, rowValue).slice(0, -1) + ';'

		let sql;
		if (mode === 'ignore') {
			sql = 'INSERT IGNORE INTO `' + table + '`(' + keys + ') VALUES ' + values
		}
		else if(mode === 'update') {
			values = values.slice(0, -1)
			let keyArr = Object.keys(prepareData[0])
			let modeRaw;
			keyArr.forEach(key => {
				modeRaw = '`' + key + '` = VALUES(' + key + '),'
			})
			modeRaw = modeRaw.slice(0, -1)

			sql = 'INSERT INTO `' + table + '`(' + keys + ') VALUES ' + values + ' ON DUPLICATE KEY UPDATE ' + modeRaw
		}
		else {
			sql = 'INSERT INTO `' + table + '`(' + keys + ') VALUES ' + values
		}

		let finalData = [];
		prepareData.forEach(element => {
			for (let k in element) {
				finalData.push(element[k])
			}
		});

		let result = new Promise((resolve, reject) => {
            db.read_mysql.query(sql, finalData).then(function(res){
                resolve(res)
			}).catch(function(error) {
		      	console.log(error)
		      	reject(error)
		    });
		})

        return await result
	},

	execUpdate:async function(data, where, notWhere = {}, link = 'plat'){ 
		if (!table) return false;
	}

}