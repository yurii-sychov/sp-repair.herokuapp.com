const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const protectiveArsenalRouter = require('./routes/protective_arsenal');
// const ownNeedsRouter = require('./routes/own_needs');
const profileRouter = require('./routes/profile');

const fileUpload = require('express-fileupload');
const upload = fileUpload({
	useTempFiles: true,
	tempFileDir: './public/uploads/'
});

const app = express();

app.post('/profile', upload, function (req, res) {
	console.log('req.files', req.files);
	return res.json(req.files);
	// res.redirect('/profile');
});

const formData = require('express-form-data');
// const options = {
// 	uploadDir: '/upload',
// 	// autoClean: true
// };
app.use(formData.parse());

app.use(session({ secret: 'SP-repair', saveUninitialized: true, resave: false, cookie: { maxAge: 60000 * 60 } }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/protective_arsenal', protectiveArsenalRouter);
// app.use('/own_needs', ownNeedsRouter);
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
