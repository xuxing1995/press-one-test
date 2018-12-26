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
    // keystore: '{"address":"4cbafe7d20558d964d784c19852cca3fad2700bf","crypto":{"cipher":"aes-128-ctr","ciphertext":"21d4e9b4fffa88515d22beb45143dcbfea951773088dae429168f7de46d1517d","cipherparams":{"iv":"94b7b7649a7122788f68fb3b1af99fde"},"mac":"e5b01e442238d68a4ecb2c7a9dc3f90d8bc8fde7cfa338b6dacac0a654398251","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"9c4cf79c9510d437383bf32622b8eccf1e0ea255e370a5422e38ce4629aaab83"}},"id":"4f117ce1-fc0c-490f-b746-bc0144572444","version":3}',
    // password: 'asdfouSIDFUIDSerkj32424',
    // address: '4cbafe7d20558d964d784c19852cca3fad2700bf',
    // privateKey: '168f7621ebf21f53efeefccc40dade33f4b0ef13b1bdde7b43d3e1b67a3dc835',
    // // must use valid mixin to withdraw and both of them have limitation for withdraw every day
    // validMixinIds: [
    //     '7ee1941f-30db-417b-8c82-c71e2d8a3e8c'
    // ],
    email: 'test1@press.one',
    keystore: '{"address":"ee6ddad145f681fd5bd19eca003c9d204d214471","crypto":{"cipher":"aes-128-ctr","ciphertext":"c8f1317ad80d4702ea5589080d83adf3dd1b16ad830204a865f67a2b75d33c3f","cipherparams":{"iv":"3ac3a7e6c1914a3550c319861c5210ba"},"mac":"087795020c77bd306acb07597ea894b1f654178893783b619f5c8372b65a7720","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"017430a85e4dd61584ed0dcdc24545a2c647b993a2b347f42fa81322185f679f"}},"id":"59e94a3d-aa8b-4050-892e-f569b7be77a3","version":3}',
    password: 'nopassword',
    address: 'ee6ddad145f681fd5bd19eca003c9d204d214471',
    privateKey: '16cf5d9cdc66927a24bec53d56e3b7640f6c2c39d2fd733975f7eb861a61a391',
    //must use valid mixin to withdraw and both of them have limitation for withdraw every day
    validMixinIds: [
        'c39c2ecc-2109-499f-b6c4-d6f278ea29fb',
        '96cb8b89-0808-427e-a58c-a04adb8119ce',
    ],
};
global.developer = {
    // email: '',
    keystore: '{"address":"4cbafe7d20558d964d784c19852cca3fad2700bf","crypto":{"cipher":"aes-128-ctr","ciphertext":"21d4e9b4fffa88515d22beb45143dcbfea951773088dae429168f7de46d1517d","cipherparams":{"iv":"94b7b7649a7122788f68fb3b1af99fde"},"mac":"e5b01e442238d68a4ecb2c7a9dc3f90d8bc8fde7cfa338b6dacac0a654398251","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"9c4cf79c9510d437383bf32622b8eccf1e0ea255e370a5422e38ce4629aaab83"}},"id":"4f117ce1-fc0c-490f-b746-bc0144572444","version":3}',
    password: 'asdfouSIDFUIDSerkj32424',
    address: '4cbafe7d20558d964d784c19852cca3fad2700bf',
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
