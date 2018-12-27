var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var async = require('async');
var bodyParser = require('body-parser');
let Mocha     = require('mocha'),
    argv      = require('yargs').argv,
    mocha     = new Mocha({ grep: argv.grep || '', timeout: 10000 }),
    casePath  = __dirname + '/help/';
global.should  = require('chai').should();
global.expect  = require('chai').expect;
global.api     = require('supertest')(`https://dev.press.one`);


global.fileHost = 'https://storage.googleapis.com/pressone';

global.user= {
    email:'1687094215@qq.com',
    keystore: '{"address":"3c29c5b91f829a0083ca7990d92a7245f0f88aad","crypto":{"cipher":"aes-128-ctr","ciphertext":"8f82b5cf86e1feb1c5b47edb8e3f899fdd29a552ae49ee8eb97a61f425069182","cipherparams":{"iv":"841294b80c9bc95f10c5ca7659205348"},"mac":"66a2c29315c41b35d2567a320ab7bb75ca10c33a2ff77c3aab89485cecf81075","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"a792e4ed08faa61da05fe1fe1093cb2ace5d57da6cdb4f9b87f7cd58e7531e22"}},"id":"83ff2243-198e-4854-9a7c-45132ed2dc69","version":3}',
    password: '147852',
    address: '3c29c5b91f829a0083ca7990d92a7245f0f88aad',
    //2.0
    // email: 'foundation@163.com',
    // keystore: '{"address":"758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9","crypto":{"cipher":"aes-128-ctr","ciphertext":"92af6f6710eba271eae5ac7fec72c70d9f49215e7880a0c45d4c53e56bd7ea59","cipherparams":{"iv":"13ddf95d970e924c97e4dcd29ba96520"},"mac":"b9d81d78f067334ee922fb2863e32c14cbc46e479eeb0acc11fb31e39256004e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"79f90bb603491573e40a79fe356b88d0c7869852e43c2bbaabed44578a82bbfa"}},"id":"93028e51-a2a4-4514-bc1a-94b089445f35","version":3}',
    // password: '123123',
    // address: '758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9'
};
global.developer = {
    email:'1687094215@qq.com',
    keystore: '{"address":"3c29c5b91f829a0083ca7990d92a7245f0f88aad","crypto":{"cipher":"aes-128-ctr","ciphertext":"8f82b5cf86e1feb1c5b47edb8e3f899fdd29a552ae49ee8eb97a61f425069182","cipherparams":{"iv":"841294b80c9bc95f10c5ca7659205348"},"mac":"66a2c29315c41b35d2567a320ab7bb75ca10c33a2ff77c3aab89485cecf81075","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"a792e4ed08faa61da05fe1fe1093cb2ace5d57da6cdb4f9b87f7cd58e7531e22"}},"id":"83ff2243-198e-4854-9a7c-45132ed2dc69","version":3}',
    password: '147852',
    address: '3c29c5b91f829a0083ca7990d92a7245f0f88aad',
};
global.buyer = {
    email: 'foundation@163.com',
    keystore: '{"address":"758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9","crypto":{"cipher":"aes-128-ctr","ciphertext":"92af6f6710eba271eae5ac7fec72c70d9f49215e7880a0c45d4c53e56bd7ea59","cipherparams":{"iv":"13ddf95d970e924c97e4dcd29ba96520"},"mac":"b9d81d78f067334ee922fb2863e32c14cbc46e479eeb0acc11fb31e39256004e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"79f90bb603491573e40a79fe356b88d0c7869852e43c2bbaabed44578a82bbfa"}},"id":"93028e51-a2a4-4514-bc1a-94b089445f35","version":3}',
    password: '123123',
    address: '758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9',
    privateKey: "6e204c62726a19fe3f43c4ca9739b7ffa37e4a3226f824f3e24e00a5890addc6"
};
require('fs').readdirSync(casePath).forEach((file) => {
    if (file.endsWith('.js')) {
        let path = `${casePath}${file}`;
        mocha.addFile(path);
    }
});

// Run the tests.
mocha.run((failures) => {
    process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures
});

var routes = require('./routes/api');
var users = require('./routes/api/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', require('./routes/api/index'));
app.use('/users', users);

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
