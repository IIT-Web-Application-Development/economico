var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log('Getting Users');
  User.find({}, function(err, users) {
    if (err) {
      console.log("ERROR in finding user: " + err);
      res.status(500).json({
        'message': 'Internal Error in Finding User'
      });
    } else if (users.length !== 0) {
      res.render('index', {
        users: users
      });
    } else {
      console.log("User Not Found!");
      res.status(200).json({});
    }
  });

});

router.get('/Milad', function(req, res, next) {
  res.render('index', {
    title: 'The Great!'
  });
});

module.exports = router;
