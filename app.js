var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var bluebird = require('bluebird')
var config = require('config');
// Get the API route ...
var api = require('./routes/api.route')
mongoose.Promise = bluebird;
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Mongodb
var server = require('http').createServer();
global.io = require('socket.io')(server, {
    'transports': ['websocket', 'polling']
});


mongoose.connect(config.get('mongoo'))
    .then(() => {
        console.log(`Succesfully Connected to the Mongodb Database  at URL : mongodb://127.0.0.1:27017/Hitweb`)
    })
    .catch(() => {
        console.log(`Error Connecting to the Mongodb Database at URL : mongodb://127.0.0.1:27017/Hitweb`)
    })

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Config Mean
app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Origin", "http://localhost");
    // res.header("Access-Control-Allow-Origin", "http://192.168.31.70");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


app.use('/api', api);
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

const SOCKETIOPRT = process.env.PORT | config.get('socket.port');

//global varible go here
global.hshSocketUser = {};
global.hshUserSocket = {};
global.hshIdSocket = {};
global.hshUserTimeout = {};

global.userCount = 0;
global.userCurrentPlay = {};
server.listen(SOCKETIOPRT, function(err) {

    if (err) throw err;
    console.log('server socket io listen socketio on ', SOCKETIOPRT);

    global.io.on('connection', require('./controllers/socket/index.js'));

});

module.exports = app;