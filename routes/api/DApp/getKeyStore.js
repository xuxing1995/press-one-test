let express = require('express');
let router = express.Router();
let keystore = require('../../../help/keystore');


/*获取 keyostore*/
router.post('/',async(req,res)=>{
    let ret = await keystore.getKeyStore();
    res.send(ret);
});

module.exports = router;
