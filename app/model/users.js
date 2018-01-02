const db = require('../../config/db.js')
const base = require('./base')

let table = 'st_depots'
base.setTable(table)


module.exports = {
	
	getUser:async function(){ 
		
		let user = new Promise((resolve,reject)=>{
            db.read_mysql.query('select * from platv4_user where id = ?', 2435374).then(function(rows){
                resolve(rows[0])
			}).catch(function(error) {
		      	console.log(error)
		      	reject(error)
		    });
        })
		return await user
		
	},

	addUser:async function(data) {
		let result = await base.execInsert(data);

		return await result
	}

}