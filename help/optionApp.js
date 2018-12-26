
var utility = require('./utility');
var async = require('async');

let appAddress = null;
let keyPair    = utility.createKeyPair({dump: true});

module.exports ={
    createApp:async function(){
        return new Promise((resolve,reject)=>{
            const payload = {
                name        : 'travel network_test_05',
                description : 'Travel Network powered by PRESS ONE.',
                url         : 'https://www.travel-network.xin',
                logo        : 'https://www.travel-network.xin/images/logo.png',
            };
            global.api.post('/api/apps').send({payload: payload}).set(
                utility.getAuthHeaderViaKeystore('/apps', payload, developer.keystore, developer.password)
            ).end((err, res) => {
                if(err){
                    reject(err)
                }else{
                    appAddress=res.body && res.body.data && res.body.data.app && res.body.data.app.address;
                    let ret={
                        data:res.body,
                        appAddress:res.body && res.body.data && res.body.data.app && res.body.data.app.address
                    }
                    resolve(ret)
                };
            });
        });
    },
    updateApp:async function(){
        let ret = await this.createApp();
        appAddress = ret.appAddress;
        return new Promise((resolve,reject)=>{
            const payload = {
                name        : 'travel network_test_05',
                description : 'Travel Network powered by PRESS ONE.',
                url         : 'https://www.travel-network.xin',
                logo        : 'https://www.travel-network.xin/images/logo.png',
            };
            global.api.post(
                '/api/apps/' + appAddress
            ).send({payload: payload}).set(
                utility.getAuthHeaderViaKeystore('/apps/' + appAddress,payload, developer.keystore, developer.password)
            ).end((err,res)=>{
                if(err) reject(err);
                resolve(res)
            });
        })
    },
    deleteApp:async function(){
        let ret = await this.createApp();
        appAddress = ret.appAddress;
        return new Promise((resolve,reject)=>{
            const payload = {};
            global.api.post(
                '/api/apps/' + appAddress + '/delete'
            ).send({payload: payload}).set(
                utility.getAuthHeaderViaKeystore('/apps/' + appAddress + '/delete',
                    payload, developer.keystore, developer.password)
            ).end((err,res)=>{
                if(err) reject(err);
                resolve(res)
            });
        })
    },
    getAppInfo:async function(){
        let ret = await this.createApp();
        appAddress = ret.appAddress;
        return new Promise((resolve,reject)=>{
            global.api.get(
                '/api/apps/' + appAddress
            ).set(
                utility.getAuthHeaderViaKeystore('/apps/' + appAddress, undefined, developer.keystore, developer.password)
            ).set(
                'Accept', 'application/json'
            ).end((err,res)=>{
                if(err) reject(err);
                resolve(res)
            });
        })
    },
    /*创建新密钥，并授权 app，可通过此密钥签名文件，发布信息*/
    createSecret:async function(){
        return new Promise((resolve,reject)=>{
            const key     = keyPair;
            const appAdd  = 'f3daa1ad2bca77681aebc0de51699b0a179aeb27';
            const payload = {
                appAddress  : appAdd,
                authAddress : key.address,
                authorized  : true,//是否授权
            };
            const message = utility.rollObject(payload);
            const sign    = utility.signText(message, user.keystore, user.password);
            const data    = {
                payload : payload,
                sig     : sign.sig,
            };
            // const
            global.api.post('/api/apps/authenticate').send(data).end((err,res)=>{
               resolve({
                   body:res.body,
                   privateKey:key.privateKey
               })
            });
        })
    },
    cancelSecret:async function(){
        return new Promise((resolve,reject)=>{
            const appAdd  = 'e3577744579f8ae92182c6aaeee22b19e76e342d';
            const key     = keyPair;
            const payload = {
                appAddress  : appAdd,
                authAddress : key.address,
                authorized  : false,
            };
            const message = utility.rollObject(payload);
            const sign    = utility.signText(message, user.keystore, user.password);
            const data    = {
                payload : payload,
                sig     : sign.sig,
            };
            // const
            global.api.post(
                '/api/apps/deauthenticate'
            ).send(data).end((err,res)=>{
                console.log(res.body);
                resolve(res.body)
            });
        })
    }
}


