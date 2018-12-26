
const request = require('request');

module.exports = {
    Catch: function (res, err, msg) {
        if (res) {
            res.send({error: true, msg: msg ? msg : "错误:", message: msg});
        }
    },
    OK: function (res, msg) {
        res.send({msg: msg});
        res.end();
    },
    Error: function (res, msg) {
        res.send({error: true, msg: msg});
        res.end();
    },
};








