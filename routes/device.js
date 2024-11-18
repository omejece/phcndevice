var express = require('express');
var router = express.Router();
var ApiController = require('../controller/ApiController');


/* GET users listing. */


router.post('/sd',ApiController.saveDeviceData);
router.get('/sd',ApiController.saveDeviceData);

router.post('/sp',ApiController.saveGenPowerTime);
router.get('/sp',ApiController.saveGenPowerTime);


module.exports = router;
