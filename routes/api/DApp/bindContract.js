let express = require('express');
let router = express.Router();
let contract = require('../../../help/contract');
let toolkit = require('../../../help/toolkit');


/*绑定合约至签名文件*/
router.post('/',async (req,res)=>{
    let content = req.body.content;
    let ret = await contract.bindContractToFile(content);
    res.send(ret);
});


module.exports = router;
