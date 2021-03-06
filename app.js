var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var uri = 'mongodb://localhost/economico';
// var uri = 'mongodb://milsab:milad1039@ds129796.mlab.com:29796/heroku_f1fl0dpn';
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var fileUpload = require('express-fileupload');

//database
mongoose.Promise = global.Promise;
mongoose.connect(uri);
var db = mongoose.connection;


//routes
var index = require('./routes/index');
var users = require('./routes/users');
var costs = require('./routes/costs');

var app = express();
// // http.createServer(app).listen(process.env.PORT || 3000);
// var port = process.env.PORT || 3000;
// app.listen(port, function() {
//   console.log('Our app is running on port:' + port);
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//File upload support
app.use(fileUpload());



//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/users/:userid/costs', costs);

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
