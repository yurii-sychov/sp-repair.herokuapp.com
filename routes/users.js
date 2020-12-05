var express = require('express');
var router = express.Router();

const mysql = require('mysql2');
const configMysql = require('./../config/database');
// const connection = mysql.createConnection(configMysql);

const pool = mysql.createPool(configMysql);

router.get('/', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.right_read === 0) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Пользователи';
	data.page = 'users';

	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sql = `SELECT * FROM users ORDER BY surname ASC`;
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				data.users = results;
				return res.render('users/index', data);
			}
		});
	});
});

router.get('/create', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.group !== 'root_admin') return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Форма добавления пользователей';
	data.page = 'users';

	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sqlStantions = `SELECT * FROM stantions ORDER BY name ASC`;
		connection.query(sqlStantions, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				data.stantions = results;
				return res.render('users/form', data);
			}
		});
	});
});

router.post('/create', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.group !== 'root_admin') return res.redirect('/auth');

	if (!req.body.surname) return res.json({ status: "ERROR", field: "InputSurname", message: "Введите фамилию." });
	if (!req.body.name) return res.json({ status: "ERROR", field: "InputName", message: "Введите имя." });
	if (!req.body.status) return res.json({ status: "ERROR", field: "InputStatus", message: "Введите статус пользователя." });
	// if (!req.body.stantion_id) return res.json({ status: "ERROR", field: "SelectStantion", message: "Выберите подстанцию." });

	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sql = `INSERT INTO users (id, surname, name, patronymic, status, created_at, created_by) VALUES (NULL, '${req.body.surname}', '${req.body.name}', '${req.body.patronymic}', '${req.body.status}', NOW(), '${req.session.userData.id}')`;
		connection.query(sql, (err, results, fields) => {
			// connection.release();
			if (err) {
				return res.json([err, sql]);
			}
			else {
				if (req.body.stantion_id) {
					for (let i=0; i<req.body.stantion_id.length; i++) {
						let sql = `INSERT INTO user_stantion (user_id, stantion_id) VALUES (${results.insertId}, ${req.body.stantion_id[i]})`;
						connection.query(sql, (err, results, fields) => {
							connection.release();
							if (err) {
								return res.json([err, sql]);
							}
						});
					}
				}
				return res.json({ status: "SUCCESS", message: "Данные добавлены.", results });
			}
		});
	});
});

router.get('/update/:id', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.group !== 'root_admin') return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Форма изменения пользователей';
	data.page = 'users';

	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sqlStantions = `SELECT * FROM stantions ORDER BY name ASC`;
		let stantions = {};
		connection.query(sqlStantions, (err, results, fields) => {
			// connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				return data.stantions = results;
			}
		});

		let sqlUserStantion = `SELECT stantion_id FROM users_stantions WHERE user_id = ${req.params.id}`;
		let user_stantion = [];
		connection.query(sqlUserStantion, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				for (i in results) {
					user_stantion.push(results[i].stantion_id);
					
				}
				return data.user_stantion = user_stantion;
			}
		});
	
		let sql = `SELECT * FROM users WHERE users.id=${req.params.id}`;
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				res.json(err);
			}
			else {
				data.item = results;
				res.render('users/form', data);
			}
		});
	});
});

router.put('/update', function (req, res, next) {
	if (!req.session.isLogin && req.session.userData.group !== 'root_admin') return res.redirect('/auth');
	
	if (!req.body.surname) return res.json({ status: "ERROR", field: "InputSurname", message: "Введите фамилию." });
	if (!req.body.name) return res.json({ status: "ERROR", field: "InputName", message: "Введите имя." });
	if (!req.body.status) return res.json({ status: "ERROR", field: "InputStatus", message: "Введите статус пользователя." });
	// if (!req.body.stantion_id) return res.json({ status: "ERROR", field: "SelectStantion", message: "Выберите подстанцию." });

	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sql = `UPDATE users SET surname= '${req.body.surname}', name = '${req.body.name}', patronymic = '${req.body.patronymic}', status = '${req.body.status}', updated_at = NOW(), updated_by = ${req.session.userData ? req.session.userData.id : 1} WHERE users.id = ${req.body.id}`;
		connection.query(sql, (err, results, fields) => {
			// connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				if (req.body.stantion_id) {
					let sql = `DELETE FROM users_stantions WHERE user_id = ${req.body.id}`;
					connection.query(sql, (err, results, fields) => {
						// connection.release();
						if (err) {
							return res.json(err);
						}
					});
					for (let i=0; i<req.body.stantion_id.length; i++) {
						let sql = `INSERT INTO users_stantions (user_id, stantion_id) VALUES (${req.body.id}, ${req.body.stantion_id[i]})`;
						connection.query(sql, (err, results, fields) => {
							connection.release();
							if (err) {
								return res.json(err);
							}
						});
					}
				}
				return res.json({ status: "SUCCESS", message: "Данные изменены.", results});
			}
		});
	});
});

module.exports = router;
