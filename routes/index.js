var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET login page. */
router.get('/login', function(req, res, next) {
  console.log('Login page');
  res.render('login', {});
});

router.post('/login', function(req,res,next){

  var username = req.body.username;
  var password = req.body.password;
  console.log("username: " + username);
  console.log("password: "  + password);

  User.findOne({
    '_id': username,
    'pass': password
  },function(err, usr){
    if(err){
      console.log("ERROR in finding user: " + err);
      res.status(500).json({
        'message': 'Internal Error in Finding User'
      });
    }else if(usr !== null){
      console.log("The user exists");
      res.status(200).send();
    }else if(usr === null){
      console.log("The user doesnt exist");
      res.status(404).send();
    }
  });
  
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  console.log('Register page');
  res.render('register', {});
});

/* Get dashboard */
router.get('/dashboard/:userId', function(req, res, next) {
  console.log('Getting user dashboard');
  var userId = req.params.userId;
  var user = {};
  User.find({
    '_id': userId
  }, function(err, usr) {
    if (err) {
      console.log("ERROR in finding user: " + err);
      res.status(500).json({
        'message': 'Internal Error in Finding User'
      });
    } else if (usr.length !== 0) {
      user._id = usr[0]._id;
      user.name = usr[0].name;
      user.pass = usr[0].pass;
      user.limit = usr[0].limit;
      user.email = usr[0].email;
      user.costs = usr[0].costs;
      res.render('index', {
        user: user
      });
    } else {
      console.log("User Not Found!");
      res.status(404).json({
        "message": 'User Not Found'
      });
    }
  });
});


module.exports = router;
