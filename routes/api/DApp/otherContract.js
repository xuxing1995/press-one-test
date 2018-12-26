let express = require('express');
let router = express.Router();
let contract = require('../../../help/contract');



/*购买合约(指定用途)*/
router.post('/buy_contract',async (req,res)=>{
    let ret = await contract.buyContract();
    res.send(ret);
});
/*卖家获取合约订单列表*/
router.get('/get_seller_orders_list',async (req,res)=>{
    let ret = await contract.getSellerOrderList();
    res.send(ret)
})
/*用户获取已购合约内容*/
router.get('/get_user_contract_content',async (req,res)=>{
    let ret = await contract.userGetHadBuyContractContent();
    res.send(ret);
});
/*卖家查看合约详情*/
router.get('/seller_check_content',async (req,res)=>{
    let ret = await contract.sellerCheckContent();
    res.send(ret);
});
/*获取我创建的合约列表*/

router.get('/get_my_list',async (req,res)=>{
    let ret = await contract.getMyContractList();
    res.send(ret)
});
/*获取指定签名文件所绑定的合约*/
router.get('/get_bind_seller',async (req,res)=>{
    let ret = await contract.getSellerBindFile();
    res.send(ret);
});

router.get('/get_bind_buyer',async (req,res)=>{
    let ret = await contract.getBuyerBindFile();
    res.send(ret);
})
module.exports = router;
