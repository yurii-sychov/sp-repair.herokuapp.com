const express = require('express');
const router = express.Router();

const model = new require('../models/class_model');

router.get('/', async function (req, res, next) {
	// if (!req.session.isLogin || req.session.userData.right_read === 0) return res.redirect('/auth');
	let data = {};

	// req.session.isLogin = true;
	// req.session.userData = {};
	// req.session.userData.name = 'Test';
	// req.session.userData.surname = 'Testov';
	// req.session.userData.image = '';

	data.session = req.session;
	data.title = 'Вогнегасники';
	data.page = 'extinguishers';
	data.datatable = false;

	let sql;

	sql = `SELECT * FROM filials ORDER BY name ASC`;
	data.filials = await model.get_data(sql);

    sql = `SELECT * FROM stantions ORDER BY name ASC`;
	data.stantions = await model.get_data(sql);

	return res.json(data);
	// return res.render('extinguishers/index', data);
});

module.exports = router;
