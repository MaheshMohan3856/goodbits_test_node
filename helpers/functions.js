let connectionProvider = require("../server/dbConnectionProvider"),
	merge = require('merge'),
	fs = require('fs'),
	mysql = require('mysql'),
	jsonfile = require('jsonfile'),
	config = require('../server/config'),
	jwt = require('jsonwebtoken');


let functions = {
    get(table, cond) {
		var self = this;
        var sql = "SELECT * FROM " + table;        
		if (typeof (cond) == "object") {
			sql += " WHERE ";
			for (var key in cond) {
				sql += key + " = '" + cond[key] + "' AND ";
			}
			sql = sql.substring(0, sql.length - 4);
        }        
        return self.selectQuery(sql);
	},
	insert(table, data) {
		var self = this;
		var sql = "INSERT INTO " + table + " SET ?";
		if (typeof (data) == "object") {
			return self.processQuery(sql, data);
		} else {
			return false;
		}
	},
	update(table, fields, cond) {
		var self = this;
		var sql = "UPDATE " + table + " SET ";
		for (var key in fields) {
			sql += key + " = ?,";
		}
		sql = sql.substring(0, sql.length - 1) + " WHERE ";
		for (var ky in cond) {
			sql += ky + " = ? AND ";
		}
		sql = sql.substring(0, sql.length - 4);

		var original = merge(fields, cond);
		var data = [];
		for (var attr in original) {
			data.push(original[attr]);
		}
		return self.processQuery(sql, data);
	},
	delete(table, cond) {
		var self = this;
		var sql = "DELETE FROM " + table + " WHERE 1";
		if (typeof (cond) == 'object') {
			for (var key in cond) {
				sql += " AND " + key + "='" + cond[key] + "'";
			}
			return self.selectQuery(sql);
		} else {
			return false;
		}
	},
	selectQuery(sql) {
		return new Promise((resolve, reject) => {
			let connection = connectionProvider.dbConnectionProvider.getMysqlConnection();
			connection.query(sql, (err, result)=>{
				if(err) reject(err);
				else resolve(result);
			});
			connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
		}) 
	},
	
    processQuery(sql, data) {
		return new Promise((resolve, reject)=> {
			let connection = connectionProvider.dbConnectionProvider.getMysqlConnection();			
			connection.query(sql, data, (err, result) => {
				if(err) reject(err);
				else resolve(result);
			})
			connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
		})
    },
    getCount(table, cond) {
		var self = this;
		var sql = "SELECT count(*) as count FROM " + table;
		if (typeof (cond) == "object") {
			sql += " WHERE ";
			for (var key in cond) {
				sql += key + " = '" + cond[key] + "' AND ";
			}
			sql = sql.substring(0, sql.length - 4);
		}
		return self.selectQuery(sql);
	},
	

	createRefreshTokenJsonFile(user, refreshToken){
		let refreshTokenMapping = {};
		let jsonFilePath  = 'public/uploads/';

		if(!fs.existsSync(jsonFilePath)) fs.mkdirSync(jsonFilePath, 0777);

		jsonFilePath += 'users/';

		if(!fs.existsSync(jsonFilePath)) fs.mkdirSync(jsonFilePath, 0777);

		jsonFilePath += user.user_id + "/";

		if(!fs.existsSync(jsonFilePath)) fs.mkdirSync(jsonFilePath, 0777);

		jsonFilePath += 'refreshtoken.json';

		refreshTokenMapping[refreshToken] = user.email;

		return jsonfile.writeFileSync(jsonFilePath, refreshTokenMapping);
	},
	

	middleware(req, res, next){
		
		let token = req.headers['authtoken'] || '';

    	let method = req.method;           

		token = token.replace(/^Bearer\s/, '');  
		
		let verify_response = function(err, decoded){

			if(!err){
				req.decoded = decoded;

				next();
				
			} else if(err.name == 'TokenExpiredError'){

				
				return res.json({ status: false, error: 'Failed to authenticate token.', 'statusCode': "TokenInvalid" });
			}
		}

		if(method != 'OPTIONS'){
			if (token) {            
				jwt.verify(token, config.secret, verify_response);  

			} else {           
				return res.status(403).send({
					status: 'fail', 
					error: 'No token provided.',
					statusCode: "TokenMissing"
				});
			}
		}else{
			return res.json({status: "success", "message": "Server preflight verification success."});
		}
	}
	

}

module.exports = functions;