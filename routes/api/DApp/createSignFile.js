let express = require('express');
let router = express.Router();
let contract = require('../../../help/contract');
let toolkit = require('../../../help/toolkit');

/*创建发布签名文件*/
router.post('/',async(req,res)=>{
    let ret = await contract.createSignFile();
    res.send(ret);
});

module.exports = router;
