/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: To call the necessary functions to run the backend.
*/


let cors = require('cors');
let createError = require('http-errors');

let compression=require('compression');
let express = require('express');
// let path = require('path');
// let cookieParser = require('cookie-parser');
let logger = require('morgan');
// let session = require('express-session');
// let flash = require('connect-flash');
let passport = require('passport');

// Get the route modules
let usersRouter = require('../routes/users');
let surveyRouter = require('../routes/survey');
let responseRouter = require('../routes/response');

let app = express();
// Enable cors
app.use(cors());

// app.use(session({
//   saveUninitialized: true,
//   resave: true,
//   secret: "sessionSecret"
// }));


// view engine setup
// app.set('views', path.join(__dirname, '../views'));
 //app.set('view engine', 'ejs');
 app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static(path.join(__dirname, '../node_modules')));

// Sets up passport
// app.use(flash());
app.use(passport.initialize());
// app.use(passport.session());

app.use('/users', usersRouter);
app.use('/survey', surveyRouter);
app.use('/response', responseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: res.locals.message })
});

module.exports = app;
