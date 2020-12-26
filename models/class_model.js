const mysql = require('mysql2');
const configMysql = require('../config/database');
const pool = mysql.createPool(configMysql);
const promisePool = pool.promise();

class class_model {
	async get_data(sql) {
		const [data] = await promisePool.query(sql);
		return data;
	}
}

const model = new class_model();

module.exports = model;