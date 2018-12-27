'use strict';

const utility  = require('./utility');

/**
 * 获取 keyostore
 */
module.exports={
    getKeyStore:async function(){
        return new Promise((resolve,reject)=>{
            global.api.post(
                '/api/keystore/login'
            ).send({
                payload: {
                    email: user.email,
                    passwordHash: utility.hashPassword(user.email, user.password),
                }
            }).set('Accept', 'application/json')
                .end((_err, res) => {
                    console.log(res.body);
                    res.status.should.equal(200);
                    resolve(res.body)
                });
        })
    }
}


