let express = require('express');
let router = express.Router();
let contract = require('../../../help/contract');
let toolkit = require('../../../help/toolkit');

/*得到合约模板*/
router.get('/',async(req,res)=>{
    try{
        let ret = await contract.getContractTmp();
        res.send(ret);
    }catch (err) {
        return toolkit.Catch(res,err)
    }
});



module.exports = router;
