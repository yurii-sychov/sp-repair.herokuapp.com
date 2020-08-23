const express = require('express');
const router = express.Router();
sha1 = require('js-sha1');

const mysql = require('mysql2');
const configMysql = require('./../config/database');
// const connection = mysql.createConnection(configMysql);

const pool = mysql.createPool(configMysql);

router.get('/', function (req, res, next) {
	let data = {};
	data.title = 'Вход в приложение';

	res.render('auth/index', data);
});

router.post('/signin', function (req, res, next) {
	if (!req.body.email) return res.json({status: "ERROR", message: "Введите email!"});
	if (!req.body.password) return res.json({status: "ERROR", message: "Введите пароль!"});
	
	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sql = `SELECT * FROM users WHERE email = '${req.body.email}' AND password = '${sha1(req.body.password)}' AND status = 1`;
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else if (results.length) {
				req.session.isLogin = true;
				req.session.userData = results[0];
				return res.json(results[0]);
			}
			else {
				return res.json({status: "ERROR", message: "Не правильный логин или пароль. Возможно вы не активированы в системе."});
			}
		});
	});
});

router.post('/signup', function (req, res, next) {
	if (!req.body.email) return res.json({status: "ERROR", message: "Введите email!"});
	if (!req.body.password) return res.json({status: "ERROR", message: "Введите пароль!"});
	if (!req.body.repassword) return res.json({status: "ERROR", message: "Введите пароль ещё раз!"});
	if (req.body.password !== req.body.repassword) return res.json({status: "ERROR", message: "Пароли не равны!"});

	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		// let email = `SELECT email FROM users WHERE email = '${req.body.email}'`;
		// connection.query(email, (err, results, fields) => {
		// 	if (err) {
		// 		return res.json(err);
		// 	}
		// 	else {
		// 		return res.json({status: "SUCCESS", message: "Пользователь с таким email уже зарегистрирован в системе!"});
		// 	}
		// });

		let sql = `INSERT INTO users (id, email, password, status, created_at, created_by, users.group) VALUES (NULL, '${req.body.email}', '${sha1(req.body.password)}', 1, NOW(), 0, 'user')`;
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				return res.json({ status: "SUCCESS", message: "Пользователь зарегистрирован." });
			}
		});
	});
});

router.get('/logout', function (req, res, next) {
	req.session.destroy();
	res.redirect('/auth');
});

module.exports = router;
