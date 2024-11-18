var express = require('express');
var router = express.Router();
var RegisterController = require('../controller/RegisterController');
var LoginController = require('../controller/LoginController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/sendcode',RegisterController.sendCode);
router.get('/sendcode',RegisterController.sendCode);

router.post('/verifycode',RegisterController.verifyCode);
router.get('/verifycode',RegisterController.verifyCode);

router.post('/newuser',RegisterController.newUser);
router.get('/newuser',RegisterController.newUser);

router.post('/userlogin',LoginController.userLogin);
router.get('/userlogin',LoginController.userLogin);

module.exports = router;
