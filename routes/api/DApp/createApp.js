let express = require('express');
let router = express.Router();
let help = require('../../../help/optionApp');
let toolkit = require('../../../help/toolkit')

/*创建APP*/
router.post('/',async(req,res)=>{
    try{
        let ret = await help.createApp();
        res.send(ret);
    }catch (err) {
        return toolkit.Catch(res,err)
    }
});



module.exports = router;
