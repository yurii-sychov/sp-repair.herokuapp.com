const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
	// if (!req.session.isLogin || req.session.userData.right_read === 0) return res.redirect('/auth');
	let data = {};
	data.session = req.session;
	data.title = 'Власні потреби';
	data.page = 'own_needs';
    data.datatable = false;
    res.json(data);
});

module.exports = router;
