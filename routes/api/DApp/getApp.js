let express = require('express');
let router = express.Router();
let help = require('../../../help/optionApp');
let toolkit = require('../../../help/toolkit')

/*获取APP信息*/
router.get('/',async(req,res)=>{
    try{
        let ret = await help.getAppInfo();
        res.send(ret);
    }catch (err) {
        return toolkit.Catch(res,err)
    }
});

module.exports = router;
