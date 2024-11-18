var express = require('express');
var router = express.Router();
var RegisterController = require('../controller/RegisterController');
var ApiController = require('../controller/ApiController');


/* GET users listing. */



router.post('/',ApiController.index);
router.get('/',ApiController.index);



module.exports = router;


