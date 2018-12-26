let express = require('express');
let router = express.Router();


router.post('/',async(req,res)=>{
    var content = req.body.html;
    console.log(content);
  res.send('我是测试')
});

module.exports = router;
