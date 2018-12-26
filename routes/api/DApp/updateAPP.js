let express = require('express');
let router = express.Router();
let help = require('../../../help/optionApp');


/*更新APP*/
router.post('/',async(req,res)=>{
    let ret = await help.updateApp();
    res.send(ret)
});

module.exports = router;
