var express = require('express');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var flash = require('express-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require ('express-partials');
var methodOverride = require('method-override');
var routes = require('./routes/index');
var sesion = require('./controllers/session_controller.js');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
if (app.get('env') === 'production') {
app.use(function(req, res, next) {
if (req.headers['x-forwarded-proto'] !== 'https') {
res.redirect('https://' + req.get('Host') + req.url);
} else {
next()
}
});
}
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride('_method', {methods: ["POST", "GET"]}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: "Quiz 2016",
resave: false,
saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(partials());
app.use(flash());
app.use(sesion.logout);
app.use(function(req, res, next) {
res.locals.session = req.session;
next();
});
app.use('/', routes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
res.status(err.status || 500);
res.render('error', {
message: err.message,
error: err
});
});
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
res.status(err.status || 500);
res.render('error', {
message: err.message,
error: {}
});
});
module.exports = app;