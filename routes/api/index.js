let express = require('express');
let router = express.Router();


router.use('/DApp',require('./DApp'));


module.exports = router;
