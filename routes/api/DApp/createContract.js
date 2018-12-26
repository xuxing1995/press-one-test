let express = require('express');
let router = express.Router();
let contract = require('../../../help/contract');
let toolkit = require('../../../help/toolkit');

/*创建合约*/
router.post('/',async(req,res)=>{
    try{
        let ret = await contract.createContract();
        res.send(ret);
    }catch (err) {
        return toolkit.Catch(res,err)
    }
});



module.exports = router;
