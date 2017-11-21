var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Milad, The Great!' });
});

router.get('/Milad', function(req, res, next) {
  res.render('index', { title: 'The Great!' });
});

module.exports = router;
