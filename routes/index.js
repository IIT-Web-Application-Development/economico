var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  console.log('Login page');
  res.render('login', {});
});

/* GET home page. */
router.get('/register', function(req, res, next) {
  console.log('Register page');
  res.render('register', {});
});

module.exports = router;
