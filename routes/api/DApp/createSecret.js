let express = require('express');
let router = express.Router();
let help = require('../../../help/optionApp');
let toolkit = require('../../../help/toolkit')

/*创建新密钥，并授权 app，可通过此密钥签名文件，发布信息*/
router.post('/',async(req,res)=>{
    try{
        let ret = await help.createSecret();
        res.send(ret);
    }catch (err) {
        return toolkit.Catch(res,err)
    }
});

/*取消对 app 的授权，将不能再通过此密钥签名新文件*/
router.post('/cancel',async(req,res)=>{
    try{
        let ret = await help.cancelSecret();
        res.send(ret);
    }catch (err) {
        return toolkit.Catch(res,err)
    }
});
module.exports = router;
