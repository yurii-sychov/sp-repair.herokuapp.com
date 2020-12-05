const express = require('express');
const router = express.Router();

const mysql = require('mysql2/promise');
const configMysql = require('./../config/database');

const model = require('./../models/own_needs');

router.get('/', async function (req, res, next) {
	// if (!req.session.isLogin || req.session.userData.right_read === 0) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Власні потреби';
	data.page = 'own_needs';
    data.datatable = false;

    model.get_data();    
   
    const connection = await mysql.createConnection(configMysql);

    let sql;
    sql = `SELECT * FROM stantions ORDER BY name ASC`;
    
    const [stantions] = await connection.execute(sql);
    res.json(data);
});

module.exports = router;
