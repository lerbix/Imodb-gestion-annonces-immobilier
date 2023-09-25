var createError = require('http-errors');
var express = require('express');
//express session
var session = require('express-session');
//passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var registerRoute= require('./routes/register');
var loginRoute = require("./routes/login");
var annoncesRoute = require('./routes/annonces');

var app = express();
// conncetion to MongoDB
const connectDB = require('./config/connectionDb');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// mongoDb connection
connectDB();

//session setup
app.use(session({
  secret:'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 *24
  }
}));

//passport 
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/', indexRouter);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/annonces', annoncesRoute);


//Passport config
var user = require('./models/user');
require('./config/passport');


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
  res.render('error', {title : "Erreur"} );
});

module.exports = app;
