
var utility = require('./utility');
var async = require('async');
let appAddress = null;
let keyPair    = utility.createKeyPair({dump: true});

module.exports ={
    createApp:async function(){
        return new Promise((resolve,reject)=>{
            const payload = {
                name        : 'travel network_test_07',
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
            const appAdd  = 'c609224f9590e60fae1723ad4d612c2db1a41595';
            const key     = keyPair;
            const payload = {
                appAddress  : appAdd,
                authAddress : key.address,
                authorized  : true,
            };
            const message = utility.rollObject(payload);
            const sign    = utility.signText(message, user.keystore, user.password);

            const data    = {
                payload : payload,
                sig     : sign.sig,
            };
            // const
            global.api.post(
                '/api/apps/authenticate'
            ).send(data).end((err,res)=>{
                resolve(res.body)
            });
        })
    },

/*{ errors: [],
    data:
    { appAuthentication:
    { id: 1851,
        userAddress: 'ee6ddad145f681fd5bd19eca003c9d204d214471',
        status: 'VERIFIED',
        createdAt: '2018-12-26T07:11:55.000Z',
        updatedAt: '2018-12-26T07:11:55.000Z',
        signature:
        '32a8e36e0b4b01c5ffc3c2fccfe57ac2e2bbe457828da8dcf2cbec27f8a63cc151a3ae2eb7649b8faf107e21d39bbdff166acff00a6509e66365a25f605ee59a0',
            appAddress: 'c609224f9590e60fae1723ad4d612c2db1a41595',
        authAddress: '25ae786bb3708467a5226715ec8892d9c4722ec2' } },
    success: true }*/




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


