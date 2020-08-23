const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	if (!req.session.isLogin) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Home';
	data.page = 'home';
	
	return res.render('home/index', data);
});

module.exports = router;
