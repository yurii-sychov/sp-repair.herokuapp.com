const express = require('express');
const router = express.Router();

const mysql = require('mysql2');
const configMysql = require('./../config/database');
// const connection = mysql.createConnection(configMysql);

const pool = mysql.createPool(configMysql);

router.get('/pdf/:id', (req, res, next) => {
	
	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sql;
		sql = `SELECT filials.name as filial_name, stantions.name as stantion_name, stantions.voltage_class, protective_arsenal.*, users.surname as s, users.name as n, users.patronymic as p FROM users, filials, stantions, protective_arsenal WHERE filials.id = protective_arsenal.filial_id AND stantions.id = protective_arsenal.stantion_id AND protective_arsenal.stantion_id = ${req.params.id} AND protective_arsenal.created_by = users.id ORDER BY protective_arsenal.name ASC`;
		let protectiveArsenal = {};
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				// const QRCode = require('qrcode');
				// QRCode.toDataURL('Служба підстанцій. Відповідальний за захисні засоби Коптев А.В.', function (err, url) {
					const PDFDocument = require('../modules/pdfkit-protective_arsenal');
					const fs = require('fs');
					const doc = new PDFDocument({
						autoFirstPage: false,
						bufferPages: true
					});
					doc.registerFont('NotoSans', 'fonts/NotoSans-Regular.ttf');
					doc.registerFont('NotoSans-Bold', 'fonts/NotoSans-Bold.ttf');

					// doc.pipe(fs.createWriteStream('file.pdf'));

					doc.addPage({
						margins: {
							top: 36,
							bottom: 36,
							left: 36,
							right: 36
						},
						size: 'A4'
					});
					
					const date = new Date();
					const now = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' року.';
					doc.font('NotoSans-Bold').fontSize(14);
					doc.text('Затверджую', { align: 'right' });
					doc.text('Начальник служби підстанцій', { align: 'right' });
					doc.text('_____________________ Шерстюк В.В.', { align: 'right' });
					doc.text('" _______ " _______________ '+date.getFullYear()+' року', { align: 'right' });
					doc.moveDown(2);
					if (results.length) {
						doc.text(`Перелік електрозахисних засобів на  ${results[0].stantion_name} ${results[0].voltage_class}`, { align: 'center' });
					}

					if (results.length) {
						// let header = {
						// 	title: [ 
						// 		'Найменування засобу',
						// 		'Тип засобу',
						// 		'Інв. №  засобу',
						// 		'Місце зберігання',
						// 		'Кількість (од. вим.)'
						// 	],
						// 	width: [
						// 		123.28, 100, 100, 100, 100
						// 	]
						// };

						doc.font('NotoSans-Bold').fontSize(8);

						doc.text('Найменування засобу', 36, 195, {align: 'left', width: 200.28});
						doc.text('Тип засобу', 236.28, 195, {align: 'left', width: 70});
						doc.text('Інв. №  засобу', 306.28, 195, {align: 'center', width: 70});
						doc.text('Місце зберігання', 376.28, 195, {align: 'left', width: 100});
						doc.text('Кількість (од. вим.)', 476.28, 195, {align: 'center', width: 83});

						// // Вертикальные линии
						// doc.moveTo(36, 170).lineTo(36, 190).stroke();
						// doc.moveTo(236.28, 170).lineTo(236.28, 190).stroke();
						// doc.moveTo(306.28, 170).lineTo(306.28, 190).stroke();
						// doc.moveTo(376.28, 170).lineTo(376.28, 190).stroke();
						// doc.moveTo(476.28, 170).lineTo(476.28, 190).stroke();
						// doc.moveTo(559.28, 170).lineTo(559.28, 190).stroke();
						// // Горизонтальные линии
						// doc.moveTo(36, 170).lineTo(559.28, 170).stroke();
						doc.moveTo(36, 210).lineTo(559.28, 210).lineWidth(3).stroke();

						doc.font('NotoSans').fontSize(8);
						let heigthRow = 0;
						for (let i = 0; i < results.length; i++) {
							doc.text(results[i].name, 36, 212+heigthRow, {align: 'left', width: 200.28});
							doc.text(results[i].type, 236.28, 212+heigthRow, {align: 'left', width: 70});
							doc.text(results[i].inventory_number ? results[i].inventory_number : 'б/н', 306.28, 212+heigthRow, {align: 'center', width: 70});
							doc.text(results[i].place, 376.28, 212+heigthRow, {align: 'left', width: 100});
							doc.text(results[i].quantity + ' (' + results[i].unit + ')', 476.28, 212+heigthRow, {align: 'center', width: 83});
							// Вертикальные линии
							// doc.moveTo(36, 180+heigthRow).lineTo(36, 210+heigthRow).stroke();
							// doc.moveTo(159.28, 180+heigthRow).lineTo(159.28, 210+heigthRow).stroke();
							// doc.moveTo(259.28, 180+heigthRow).lineTo(259.28, 210+heigthRow).stroke();
							// doc.moveTo(359.28, 180+heigthRow).lineTo(359.28, 210+heigthRow).stroke();
							// doc.moveTo(459.28, 180+heigthRow).lineTo(459.28, 210+heigthRow).stroke();
							// doc.moveTo(559.28, 180+heigthRow).lineTo(559.28, 210+heigthRow).stroke();
							// Горизонтальные линии
							doc.moveTo(36, 210+heigthRow).lineTo(559.28, 210+heigthRow).lineWidth(1).stroke();
							if (i === results.length-1) {
								doc.moveTo(36, 210+heigthRow+15).lineTo(559.28, 210+heigthRow+15).lineWidth(1).stroke();
							}
							heigthRow = heigthRow+15;
						}	
						doc.font('NotoSans-Bold').fontSize(14);
						doc.moveDown(3);
						doc.text(`Відповідальний за збереження _____________________ ${results[0].s} ${results[0].n.substr(0, 1)}.${results[0].p.substr(0, 1)}.`, 36, 210+heigthRow+25, { align: 'center', width: 523.28 });
					}
					else {
						doc.text('Необходимо добавить данные!');
					}
					doc.pipe(res);
					doc.end();
				// });	
			}
		});
	});
});

router.get('/pdf1/:id', (req, res, next) => {
	
	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sql;
		// sql = `SELECT users`
		sql = `SELECT filials.name as filial_name, stantions.name as stantion_name, stantions.voltage_class, protective_arsenal.*, users.surname as s, users.name as n, users.patronymic as p FROM users, filials, stantions, protective_arsenal WHERE filials.id = protective_arsenal.filial_id AND stantions.id = protective_arsenal.stantion_id AND protective_arsenal.stantion_id = ${req.params.id} AND protective_arsenal.created_by = users.id ORDER BY protective_arsenal.name ASC`;
		let protectiveArsenal = {};
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				// const QRCode = require('qrcode');
				// QRCode.toDataURL('Служба підстанцій. Відповідальний за захисні засоби Коптев А.В.', function (err, url) {
					const PDFDocument = require('../modules/pdfkit-protective_arsenal');
					const fs = require('fs');
					const doc = new PDFDocument({
						autoFirstPage: false,
						bufferPages: true
					});
					doc.registerFont('NotoSans', 'fonts/NotoSans-Regular.ttf');
					doc.registerFont('NotoSans-Bold', 'fonts/NotoSans-Bold.ttf');

					// doc.pipe(fs.createWriteStream('file.pdf'));

					doc.addPage({
						margins: {
							top: 36,
							bottom: 36,
							left: 36,
							right: 36
						},
						size: 'A4'
					});
					
					const date = new Date();
					const now = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' року.';
					doc.font('NotoSans-Bold').fontSize(14);
					doc.text('Затверджую', { align: 'right' });
					doc.text('Начальник служби підстанцій', { align: 'right' });
					doc.text('_____________________ Шерстюк В.В.', { align: 'right' });
					doc.text('" _______ " _______________ '+date.getFullYear()+' року', { align: 'right' });
					doc.moveDown(2);
					if (results.length) {
						doc.text(`Перелік електрозахисних засобів на  ${results[0].stantion_name} ${results[0].voltage_class}`, { align: 'center' });
					}

					const row_array = [];
					for (let i = 0; i < results.length; i++) {
						let type = results[i].type === '-' ? '' : results[i].type;
						let number = results[i].inventory_number ? 'Інв. № '+results[i].inventory_number : 'б/н';
						let row = [
							results[i].name,
							results[i].type,
							results[i].inventory_number ? results[i].inventory_number : 'б/н',
							// type+' ('+number+')',
							results[i].place,
							results[i].quantity + ' (' + results[i].unit + ')'
						];
						row_array.push(row)
					}
					const table = {
						headers: [
							'Найменування засобу',
							'Тип засобу',
							'Інв. №  засобу',
							'Місце зберігання',
							'Кількість (од. вим.)'
						],
						rows: row_array
					};
					if (results.length) {
						doc.moveDown().table(table, 36, 190, {
							prepareHeader: () => doc.font('NotoSans-Bold').fontSize(6),
							prepareRow: (row, i) => {
								doc.font('NotoSans').fontSize(6)
							},
							width: 523.28,
							columnSpacing: 0
						});
						// doc.image(url, 71, 32, {width: 70});

						// QRCode.toDataURL('I am a pony!', function (err, url) {
						// 	doc.text('Відповідальний за збереження _____________________ ', { align: 'center' });
						// 	console.log(url);
						// });
						doc.font('NotoSans-Bold').fontSize(14);
						doc.moveDown(3);
						// doc.font('NotoSans-Bold').fontSize(8);
						// let user = 'USER';
						doc.text(`Відповідальний за збереження _____________________ ${results[0].s} ${results[0].n.substr(0, 1)}.${results[0].p.substr(0, 1)}.`, { align: 'center' });
					}
					else {
						// doc.text('Необходимо добавить данные!');
					}
					doc.pipe(res);
					doc.end();
				// });	
			}
		});
	});
});

router.get('/', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.right_read === 0) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Захисні засоби';
	data.page = 'protective_arsenal';
	data.datatable = true;

	pool.getConnection(function(err, connection) {
		if(err) {
			// return res.json(err);
		}
		let sql;
		sql = `SELECT stantions.id, stantions.name FROM stantions, users_stantions WHERE stantions.id = users_stantions.stantion_id AND users_stantions.user_id = '${req.session.userData.id}' ORDER BY name ASC`;
		let stantions = {};
		connection.query(sql, (err, results, fields) => {
			// connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				return data.stantions = results;
			}
		});
		
		sql = `SELECT filials.name as filial_name, stantions.name as stantion_name, protective_arsenal.*, DATE_FORMAT(DATE_ADD(date_of_testing, INTERVAL period_of_testing MONTH), "%Y-%m-%d") as date_of_testing, DATE_FORMAT(DATE_ADD(date_of_inspection, INTERVAL period_of_inspection MONTH), "%Y-%m-%d") as date_of_inspection FROM filials, stantions, protective_arsenal, users_stantions WHERE filials.id = protective_arsenal.filial_id AND stantions.id = protective_arsenal.stantion_id AND stantions.id = users_stantions.stantion_id AND users_stantions.user_id = '${req.session.userData.id}' ORDER BY stantion_name, name ASC`;

		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				data.protective_arsenal = results;
				return res.render('protective_arsenal/index', data);
			}
		});
	});
});

router.get('/create', function (req, res, next) {
	if (!req.session.isLogin) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Форма для додавання даних про захісний засіб';
	data.page = 'protective_arsenal';

	pool.getConnection(function(err, connection) {
		if(err) {
			// return res.json(err);
		}
		let sql
		sql = `SELECT stantions.id, stantions.name FROM stantions, users_stantions WHERE stantions.id = users_stantions.stantion_id AND users_stantions.user_id = '${req.session.userData.id}' ORDER BY name ASC`;
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				data.stantions = results;
				return res.render('protective_arsenal/form', data);
			}
		});
	});
});

router.post('/create', function (req, res, next) {
	if (!req.session.isLogin) return res.redirect('/auth');
	if (!req.body.stantion_id) return res.json({ status: "ERROR", field: "SelectStantion", message: "Выберите подстанцию." });
	if (!req.body.unit) return res.json({ status: "ERROR", field: "SelectUnit", message: "Выберите единицу измерения." });
	if (!req.body.name) return res.json({ status: "ERROR", field: "InputName", message: "Введите название защитного средства." });
	if (!req.body.type) return res.json({ status: "ERROR", field: "InputType", message: "Введите тип защитного средства." });
	if (!req.body.place) return res.json({ status: "ERROR", field: "InputPlace", message: "Введите место хранения защитного средства." });
	if (!req.body.quantity) return res.json({ status: "ERROR", field: "InputQuantity", message: "Введите колличество." });
	
	pool.getConnection(function(err, connection) {
		if(err) {
			// return res.json(err);
		}
		let sql = `INSERT INTO protective_arsenal (id, name, type, place, unit, quantity, inventory_number, factory_number, sap_number, date_of_testing, period_of_testing, date_of_inspection, period_of_inspection, filial_id, stantion_id, created_at, created_by) VALUES (NULL, '${req.body.name}', '${req.body.type}', '${req.body.place}', '${req.body.unit}', '${req.body.quantity}', '${req.body.inventory_number}', '${req.body.factory_number}', '${req.body.sap_number}', '${req.body.date_of_testing}', '${req.body.period_of_testing}', '${req.body.date_of_inspection}', '${req.body.period_of_inspection}',  1, '${req.body.stantion_id}', NOW(), '${req.session.userData.id}')`;
		connection.query(sql, 'post', (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				return res.json({ status: "SUCCESS", message: "Данные добавлены.", results });
			}

		});
	});
});

router.get('/create_several', function (req, res, next) {
	if (!req.session.isLogin) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Форма добавления защитных средств';
	data.page = 'protective_arsenal';

	pool.getConnection(function(err, connection) {
		if(err) {
			// return res.json(err);
		}
		let sql
		sql = `SELECT stantions.id, stantions.name FROM stantions, users_stantions WHERE stantions.id = users_stantions.stantion_id AND users_stantions.user_id = '${req.session.userData.id}' ORDER BY name ASC`;
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				data.stantions = results;
				return res.render('protective_arsenal/form_tabular', data);
			}
		});
	});
});

router.post('/create_several', function (req, res, next) {
	return res.json({ result: req.body });
	// if (!req.session.isLogin || req.session.userData.right_create === 0) return res.redirect('/auth');
	// if (!req.body.stantion_id) return res.json({ status: "ERROR", field: "SelectStantion", message: "Выберите подстанцию." });
	// if (!req.body.unit) return res.json({ status: "ERROR", field: "SelectUnit", message: "Выберите единицу измерения." });
	// if (!req.body.name) return res.json({ status: "ERROR", field: "InputName", message: "Введите название защитного средства." });
	// if (!req.body.type) return res.json({ status: "ERROR", field: "InputType", message: "Введите тип защитного средства." });
	// if (!req.body.place) return res.json({ status: "ERROR", field: "InputPlace", message: "Введите место хранения защитного средства." });
	// if (!req.body.quantity) return res.json({ status: "ERROR", field: "InputQuantity", message: "Введите колличество." });
	
	// pool.getConnection(function(err, connection) {
	// 	if(err) {
	// 		return res.json(err);
	// 	}
		// let sql = `INSERT INTO protective_arsenal (id, name, type, place, unit, quantity, inventory_number, factory_number, date_of_testing, period_of_testing, date_of_inspection, period_of_inspection, filial_id, stantion_id, created_at, created_by) VALUES (NULL, '${req.body.name}', '${req.body.type}', '${req.body.place}', '${req.body.unit}', '${req.body.quantity}', '${req.body.inventory_number}', '${req.body.factory_number}', '${req.body.date_of_testing}', '${req.body.period_of_testing}', '${req.body.date_of_inspection}', '${req.body.period_of_inspection}',  1, '${req.body.stantion_id}', NOW(), '${req.session.userData.id}')`;
		// connection.query(sql, 'post', (err, results, fields) => {
		// connection.release();
		// 	if (err) {
		// 		return res.json(err);
		// 	}
		// 	else {
		// 		return res.json({ status: "SUCCESS", message: "Данные добавлены.", results });
		// 	}

		// });
	// });
});

router.get('/update/:id', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.right_update === 0) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Форма для зміни даних про захисний засіб';
	data.page = 'protective_arsenal';

	pool.getConnection(function(err, connection) {
		if(err) {
			// return res.json(err);
		}
		let sql
		sql = `SELECT stantions.id, stantions.name FROM stantions, users_stantions WHERE stantions.id = users_stantions.stantion_id AND users_stantions.user_id = '${req.session.userData.id}' ORDER BY name ASC`;
		let stantions = {};
		connection.query(sql, (err, results, fields) => {
			// connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				return data.stantions = results;
			}
		});
		sql = `SELECT *, DATE_FORMAT(date_of_testing, '%Y-%m-%d') as date_of_testing, DATE_FORMAT(date_of_inspection, '%Y-%m-%d') as date_of_inspection FROM protective_arsenal WHERE protective_arsenal.id='${req.params.id}'`;
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				res.json(err);
			}
			else {
				data.protective_arsenal = results;
				res.render('protective_arsenal/form', data);
			}
		});
	});
});

router.put('/update', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.right_update === 0) return res.redirect('/auth');
	if (!req.body.stantion_id) return res.json({ status: "ERROR", field: "SelectStantion", message: "Выберите подстанцию." });
	if (!req.body.unit) return res.json({ status: "ERROR", field: "SelectUnit", message: "Выберите единицу измерения." });
	if (!req.body.name) return res.json({ status: "ERROR", field: "InputName", message: "Введите название защитного средства." });
	if (!req.body.type) return res.json({ status: "ERROR", field: "InputType", message: "Введите тип защитного средства." });
	if (!req.body.place) return res.json({ status: "ERROR", field: "InputPlace", message: "Введите место хранения защитного средства." });
	if (!req.body.quantity) return res.json({ status: "ERROR", field: "InputQuantity", message: "Введите колличество." });

	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sql = `UPDATE protective_arsenal SET stantion_id= '${req.body.stantion_id}', name = '${req.body.name}', type = '${req.body.type}', place = '${req.body.place}', unit = '${req.body.unit}', quantity = '${req.body.quantity}', inventory_number='${req.body.inventory_number}', factory_number='${req.body.factory_number}', sap_number = '${req.body.sap_number}', date_of_testing='${req.body.date_of_testing}', period_of_testing='${req.body.period_of_testing}', date_of_inspection='${req.body.date_of_inspection}', period_of_inspection='${req.body.period_of_inspection}', number_of_updates = ${Number(req.body.number_of_updates)+Number(1)}, updated_at = NOW(), updated_by = '${req.session.userData.id}' WHERE protective_arsenal.id = ${req.body.id}`;
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

router.delete('/delete', function (req, res, next) {
	if (!req.session.isLogin) return res.redirect('/auth');

	pool.getConnection(function(err, connection) {
		if(err) {
			// return res.json(err);
		}
		let sql = `DELETE FROM protective_arsenal WHERE protective_arsenal.id = '${req.body.id}'`;
		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				return res.json({ status: 'SUCCESS', message: `Запись с id=${req.body.id} удалена.` });
			}
		});
	});
});

router.post('/get_data', function (req, res, next) {
	if (!req.session.isLogin || req.session.userData.right_read === 0) return res.redirect('/auth');
	let data = {};

	pool.getConnection(function(err, connection) {
		if(err) {
			return res.json(err);
		}
		let sql;
		
		sql = `SELECT filials.name as filial_name, stantions.name as stantion_name, protective_arsenal.*, DATE_FORMAT(DATE_ADD(date_of_testing, INTERVAL period_of_testing MONTH), "%Y-%m-%d") as date_of_testing, DATE_FORMAT(DATE_ADD(date_of_inspection, INTERVAL period_of_inspection MONTH), "%Y-%m-%d") as date_of_inspection FROM filials, stantions, protective_arsenal, users_stantions WHERE filials.id = protective_arsenal.filial_id AND stantions.id = protective_arsenal.stantion_id AND stantions.id = users_stantions.stantion_id AND users_stantions.user_id = '${req.session.userData.id}' ORDER BY stantion_name, name ASC`;

		connection.query(sql, (err, results, fields) => {
			connection.release();
			if (err) {
				return res.json(err);
			}
			else {
				for (let i=0; i<results.length; i++) {
					results[i].edit = 
					req.session.userData.right_update ? 
					`<a href="/protective_arsenal/update/${results[i].id}" class="center-align">
						<i class="tiny material-icons green-text text-darken-4">edit</i>
					</a>` :
					`<i class="tiny material-icons grey-text lighten-5">edit</i>`;

					results[i].delete = 
					req.session.userData.right_delete ?
					`<a href="javascript:void(0);" class="center-align">
						<i class="tiny material-icons red-text text-darken-4" data-id="${results[i].id}" onClick="deleteRow(event)">delete</i>
					</a>` :
					`<i class="tiny material-icons grey-text lighten-5">delete</i>`;

					results[i].pdf = 
					`<a href="javascript:void(0);" class="center-align">
						<i class="tiny material-icons deep-orange-text darken-4" data-id="${results[i].stantion_id}" onClick="pdf(event)">picture_as_pdf</i>
					</a>`;
				}
				data.data = results;
				return res.json(data);
			}
		});
	});
});

module.exports = router;
