
const fs = require('fs'),
    path = require('path'),
    utility = require('./utility');

let rId = null;
// let msghash = null;

let tempFile = `../${String(Date.now())}.md`;
let url = path.join(__dirname, tempFile);
fs.writeFileSync(url, String(Date.now()), 'utf-8');


module.exports ={
    getContractTmp:async function(){
        return new Promise((resolve,reject)=>{
            global.api.get(
                `/api/contracts/templates?offset=0&limit=5`
            ).set(
                utility.getAuthHeaderViaPrivateKey(`/contracts/templates?offset=0&limit=5`, undefined, user.privateKey)
            ).end((err, res) => {
                if(err) reject(err);
                resolve(res.body);
            });
        })
    },
    createContract:async function(){
        return new Promise((resolve,reject)=>{
            const code = `PRSC Ver 0.1
              Name 购买授权
              Desc 这是一个\\n测试合约
              Receiver ${user.address}
              License usage1 CNB:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
              License usage2 CNB:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
            const sign = utility.signFileViaKey(code, user.privateKey);
            const data = {
                sig: sign.sig,
                contract: {
                    code,
                },
            };
            global.api.post(
                `/api/contracts`
            ).send({
                payload: data
            }).set(
                utility.getAuthHeaderViaPrivateKey(`/contracts`, data, user.privateKey)
            ).end((err, res) => {
                if (res.status === 200) {
                    rId = res.body.contract.rId;
                    resolve(rId);
                }
                reject(err)
            });
        })
    },

    /*绑定合约至签名文件*/
    // bindContractToFile1:async function(msghash){
    //     // msghash = await fileSign.signTextFile(data);
    //     // console.log('LLLLLLLLLLL:',msghash);
    //     rId = await this.createContract();
    //     return new Promise((resolve,reject)=>{
    //         const data = {
    //             file: {
    //                 msghash: msghash,
    //             },
    //         };
    //         global.api.post(
    //             `/api/contracts/${rId}/bind`
    //         ).send({
    //             payload: data
    //         }).set(
    //             utility.getAuthHeaderViaPrivateKey(`/contracts/${rId}/bind`, data, user.privateKey)
    //         ).end((err, res) => {
    //             if (res.status === 200) {
    //                 resolve(res.body);
    //             }
    //             reject(err);
    //         });
    //     })
    // },

    //2.0
    bindContractToFile:async function(msghash){
      rId = await this.createContract();
        const data = {
            file: {
                msghash: msghash,
            },
        };
        global.api.post(
            `/api/contracts/${rId}/bind`
        ).send({
            payload: data
        }).set(
            utility.getAuthHeaderViaPrivateKey(`/contracts/${rId}/bind`, data, user.privateKey)
        ).end((err, res) => {
            if (res.status === 200) {
               console.log(true)
            }else{
                console.log(false)
            }
        });
    },

    /*购买合约(指定用途)*/
    buyContract:async function(msghash){
        // msghash = await fileSign.signTextFile();//需要调用
        rId = await this.createContract();
        // return new Promise((resolve,reject)=>{
            const data = {
                file: {
                    msghash: msghash,
                },
                contract: {
                    rId,
                    license: {
                        type: 'usage2',
                    },
                },
            };
            global.api.post(
                `/api/users/${buyer.address}/orders`
            ).send({payload: data}).set(
                utility.getAuthHeaderViaPrivateKey(`/users/${buyer.address}/orders`, data, buyer.privateKey)
            ).end((err, res) => {
                console.log(res.body);
                // resolve(res.body);
            });
        // })
    },
    /*卖家获取合约订单列表*/
    getSellerOrderList:async function(){
        rId = await this.createContract();
        return new Promise((resolve,reject)=>{
            global.api.get(
                `/api/contracts/${rId}/orders?offset=0&limit=5`
            ).set(
                utility.getAuthHeaderViaPrivateKey(`/contracts/${rId}/orders?offset=0&limit=5`, undefined, user.privateKey)
            ).end((err, res) => {
                if (res.status === 200) {
                    console.log(JSON.stringify(res.body));
                    resolve(res.body);
                }
                reject(err);
            });
        })
    },
    /*用户获取已购合约内容*/
    userGetHadBuyContractContent:async function(){
        return new Promise((resolve,reject)=>{
            global.api.get(
                `/api/users/${buyer.address}/orders?offset=0&limit=5`
            ).set(
                utility.getAuthHeaderViaPrivateKey(`/users/${buyer.address}/orders?offset=0&limit=5`, undefined, buyer.privateKey)
            ).end((err, res) => {
                if (res.status === 200) {
                    console.log(JSON.stringify(res.body));
                    resolve(res.body);
                }
               reject(err)
            });
        })
    },
    /*卖家查看合约详情*/
    sellerCheckContent:async function(){
        rId = await this.createContract();
        return new Promise((resolve,reject)=>{
            global.api.get(
                `/api/contracts/${rId}`
            ).set(
                utility.getAuthHeaderViaPrivateKey(`/contracts/${rId}`, undefined, user.privateKey)
            ).end((err, res) => {
                if (res.status === 200) {
                    resolve(res.body)
                }
                reject(err);
            });
        })
    },
    /*获取我创建的合约列表*/
    getMyContractList:async function(){
        return new Promise((resolve,reject)=>{
            global.api.get(
                `/api/contracts?offset=0&limit=5`
            ).set(
                utility.getAuthHeaderViaPrivateKey(`/contracts?offset=0&limit=5`, undefined, user.privateKey)
            ).end((err, res) => {
                if (res.status === 200) {
                    resolve(res.body)
                }
               reject(err)
            });
        })
    },
    /*获取指定签名文件所绑定的合约*/
    getSellerBindFile:async function(){
        msghash = await fileSign.signTextFile();//需要调用
        return new Promise((resolve,reject)=>{
            global.api.get(
                `/api/filesign/${msghash}`
            ).set(
                utility.getAuthHeaderViaPrivateKey(`/filesign/${msghash}`, undefined, user.privateKey)
            ).end((err, res) => {
                if (res.status === 200) {
                   resolve(res.body)
                }
                reject(err)
            });
        })
    },
    getBuyerBindFile:async function(){
        msghash = await fileSign.signTextFile();//需要调用
        return new Promise((resolve,reject)=>{
            global.api.get(
                `/api/filesign/${msghash}`
            ).set(
                utility.getAuthHeaderViaPrivateKey(`/filesign/${msghash}`, undefined, buyer.privateKey)
            ).end((err, res) => {
                if (res.status === 200) {
                   resolve(res.body)
                }
                reject(err)
            });
        })
    },
    createSignFile:async function(){
        return new Promise((resolve,reject)=>{
            // const content = fs.readFileSync(url, 'utf-8');
            // const sign = utility.signFileViaKey(content, user.privateKey);
            // global.api.post(
            //     '/api/filesign'
            // ).field(
            //     'sig', sign.sig
            // ).field(
            //     'address', user.address
            // ).field(
            //     'title', 'testing title'
            // ).field(
            //     'source', 'Google'
            // ).field(
            //     'originUrl', 'https://www.google.com'
            // ).attach(
            //     'file', url
            // ).set('Accept', 'application/json').end((err, res) => {
            //     console.log(res.body);
            //     resolve(res.body)
            // });
            // this.timeout(1000 * 200);
        })
    }
}