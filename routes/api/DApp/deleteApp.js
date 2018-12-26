let express = require('express');
let router = express.Router();
let help = require('../../../help/optionApp');
let toolkit = require('../../../help/toolkit')

/*删除APP*/
router.post('/',async(req,res)=>{
    try{
        let ret = await help.deleteApp();
        res.send(ret);
    }catch (err) {
        return toolkit.Catch(res,err)
    }
});



module.exports = router;
