const db = require('../../config/db.js')

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
	}

}