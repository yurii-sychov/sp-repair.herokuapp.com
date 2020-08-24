const express = require('express');

const router = express.Router();

const mysql = require('mysql2');
const configMysql = require('./../config/database');
// const connection = mysql.createConnection(configMysql);

const pool = mysql.createPool(configMysql);

router.get('/sms', function (req, res, next) {
	return res.json({ sms: 'sms' });
});

router.get('/', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.right_read === 0) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Профіль';
	data.page = 'profile';

	pool.getConnection(function (err, connection) {
		if (err) {
			return res.json(err);
		}
		let sql;
		// sql = `SELECT * FROM users WHERE  id = '${req.session.userData.id}'`;
		sql = `SELECT * FROM users WHERE  id = 1`;

		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				data.user = results[0];
				return res.render('profile/index', data);
			}
		});
	});
});

router.put('/change_password', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.right_update === 0) return res.redirect('/auth');
	if (!req.body.new_password) return res.json({ status: "ERROR", message: "Введите пароль!" });
	if (!req.body.new_repassword) return res.json({ status: "ERROR", message: "Введите пароль ещё раз!" });
	if (req.body.new_password !== req.body.new_repassword) return res.json({ status: "ERROR", message: "Пароли не равны!" });
	sha1 = require('js-sha1');
	let password = sha1(req.body.new_password);

	pool.getConnection(function (err, connection) {
		if (err) {
			return res.json(err);
		}
		let sql = `UPDATE users SET password = '${password}' WHERE users.id = '${req.session.userData.id}'`;
		connection.query(sql, 'post', (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err, sql);
			}
			else {
				return res.json({ status: "SUCCESS", message: "Данные изменены.", results });
			}

		});
	});
});

router.post('/upload_foto', function (req, res) {
	console.log(req.file);
	res.status(200).json({ files: req.files });
});

module.exports = router;