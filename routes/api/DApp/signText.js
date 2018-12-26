let express = require('express');
let router = express.Router();
let fileSign = require('../../../help/fileSign');


/*签名文本文件*/
router.post('/text',async(req,res)=>{
    let content = req.body.html;
    let ret = await fileSign.signTextFile(content);
    res.send(ret)
});
/*签名图片文件*/
router.post('/image',async(req,res)=>{
    let ret = await fileSign.signImage();
    res.send(ret)
});
router.post('/imageToText',async (req,res)=>{
    let content = req.body.content;
    let ret = await fileSign.signImageToText(content);
    res.send(ret)
});
router.get('/getSignFileInfo',async (req,res)=>{
    let ret = await fileSign.getSignFileInfo();
    res.send(ret)
})
module.exports = router;
