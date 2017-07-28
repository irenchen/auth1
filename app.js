var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user');
var { UserSchema } = require('./db');
var User = mongoose.model('User', UserSchema);

var passport = require('passport');
var PassportLocalStrategy = require('passport-local').Strategy;

var authStrategy = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, function(email, password, done) {
  User.authenticate(email, password, function(err, user) {
    done(err, user, err ? { message: err.message } : null);
  });
});

var authSerializer = function(user, done) {
  done(null, user.id);
};
var authDeserializer = function(id, done) {
  User.findById(id, (err, user) => done(err, user));
};

passport.use(authStrategy);
passport.serializeUser(authSerializer);
passport.deserializeUser(authDeserializer);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
  secret: 'cat dog',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('connect-flash')());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
