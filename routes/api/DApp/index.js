const express = require('express');
const router = express.Router();


router.use('/createApp',require('./createApp'));
router.use('/updateAPP',require('./updateAPP'));
router.use('/deleteAPP',require('./deleteAPP'));
router.use('/getAPP',require('./getAPP'));
router.use('/createSecret',require('./createSecret'));
router.use('/createContract',require('./createContract'));
router.use('/getContractTmp',require('./getContractTmp'));
router.use('/createSignFile',require('./createSignFile'));
router.use('/bindContract',require('./bindContract'));
router.use('/signText',require('./signText'));
router.use('/getKeyStore',require('./getKeyStore'));
router.use('/otherContract',require('./otherContract'));

module.exports = router;