const db = require('../../config/db.js')

module.exports = {
	
	insert:async function(table, data){ 
		
		let result = new Promise((resolve, reject) => {
            db.read_mysql.query(sql, data).then(function(res){
                resolve(res)
			}).catch(function(error) {
		      	console.log(error)
		      	reject(error)
		    });
        })
        return await result
	}

}