'use strict';

const fs      = require('fs'),
    path    = require('path'),
    utility = require('./utility'),
    contract = require('./contract');
const keythereum = require('keythereum');




let tempFile = `../${String(Date.now())}.md`;
let url      = path.join(__dirname, tempFile);


let tempFile2 = `../timg_1.png`;
let url2      = path.join(__dirname, tempFile2);

let msghash  = null;
let imageRid = null;


module.exports={
    /*签名文本文件(.md)*/
    // contract.bindContractToFile(msghash);//为此签名文件绑定合约
    signTextFile:async function(data){
        return new Promise((resolve,reject)=>{
            fs.writeFileSync(url, data, 'utf-8');
            const content = fs.readFileSync(url, 'utf-8');
            const sign = utility.signFile(content, user.keystore, user.password);
            // const sign = utility.signFileViaKey(content, user.privateKey);
            global.api.post(
                '/api/filesign'
            ).field(
                'sig',         sign.sig
            ).field(
                'address',     user.address
            ).field(
                'title',       '节点旅行'
            ).field(
                'source',      'Google'
            ).field(
                'originUrl',   'https://www.google.com'
            ).attach(
                'file',        url
            ).set('Accept', 'application/json').end((err, res) => {
                console.log(res.body);
                // res.status.should.equal(200);
                // msghash = res.body.block.msghash;
                resolve(res.body);
            });
            // this.timeout(1000 * 200);
        })
    },
    //签名图片（.png  .jpg  .gif）
    signImage:async function(){
        return new Promise((resolve,reject)=>{
            const content = fs.readFileSync(url2);
            const sign = utility.signImage(content, user.privateKey);
            global.api.post(
                '/api/filesign'
            ).field(
                'sig',         sign.sig
            ).field(
                'address',     user.address
            ).field(
                'title',       '节点旅行'
            ).field(
                'source',      'Google'
            ).field(
                'originUrl',   'https://www.google.com'
            ).attach(
                'file',        url2
            ).set('Accept', 'application/json').end((err, res) => {
                console.log(res.body);
                if(err) reject (err);
                else{
                    msghash  = res.body.block.msghash;
                    imageRid = res.body.block.rId;
                    resolve({
                        body:res.body,
                        imageRid:imageRid
                    });
                }
            });
        })
    },
    signImageToText:async function(){
        let ret = await this.signImage();
        imageRid = ret.imageRid;
        return new Promise((resolve,reject)=>{
            // let tempFile3 = `../${String(Date.now())}.md`;
            // let url3      = path.join(__dirname, tempFile3);
            let imageText =  String(Date.now()) + '\n' + `![test](prs://file?rId=${imageRid})`
            fs.writeFileSync(url3, imageText, 'utf-8');

            const content = fs.readFileSync(url3, 'utf-8');
            const sign = utility.signFileViaKey(content, user.privateKey);
            global.api.post(
                '/api/filesign'
            ).field(
                'sig',         sign.sig
            ).field(
                'address',     user.address
            ).field(
                'title',       'testing title'
            ).field(
                'source',      'Google'
            ).field(
                'originUrl',   'https://www.google.com'
            ).attach(
                'file',        url3
            ).set('Accept', 'application/json').end((err, res) => {
                if(err) reject(err);
                else{
                    msghash = res.body.block.msghash;
                    resolve(res.body)
                }
            });
        })
    },
    getSignFileInfo:async function(){
        let ret = await this.signImage();
        imageRid = ret.imageRid;
        return new Promise((resolve,reject)=>{
            let rIds = [imageRid];
            global.api.get(
                `/api/block/txes?rIds=${rIds.join(',')}`
            ).end((err, res) => {
                if(err) reject(err);
                else{
                    let tx = JSON.parse(res.body.data.txes[0].data);
                    let uuid = tx.uuid;
                    let fileUrl = `${global.fileHost}/${uuid}`;
                    resolve(res.body);
                }
            });
        })
    },
};
// after(() => {
//     fs.unlinkSync(url);
// });

