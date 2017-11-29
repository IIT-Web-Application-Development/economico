var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Handlebars = require('handlebars');

/* GET login page. */
router.get('/login', function(req, res, next) {
  console.log('Login page');
  res.render('login', {});
});

router.post('/login', function(req,res,next){

 /* var username = req.body.username;
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
  });*/



  User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        console.log("There is an error");
        res.status(401).send();
      } else {
        req.session.userId = user._id;
        res.status(200).send({user._id});
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
  //calculate categories totals
  var categories = [{
      name: "Education",
      color: '#3c8dbc',
      total: 0,
      icon: 'ion-ios-book'
    },
    {
      name: "Groceries",
      color: '#f39c12',
      total: 0,
      icon: 'ion-bag'
    },
    {
      name: "Clothing",
      color: '#00a65a',
      total: 0,
      icon: 'ion-tshirt-outline'
    },
    {
      name: "Bills",
      color: '#dd4b39',
      total: 0,
      icon:'ion-ios-paper-outline'
    },
    {
      name: "Travel",
      color: '#00c0ef',
      total: 0,
      icon: 'ion-android-car'
    }
  ];



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
      if (typeof usr[0].total === 'undefined') {
        usr[0].total = 0;
      }
      user.total = (usr[0].total).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      user.email = usr[0].email;
      user.costs = usr[0].costs;

      //calculate total for each category
      user.costs.forEach(function(cost) {
        var costCategory = cost.category;
        //aadd amount to category total
        categories.forEach(function(category) {
          if (costCategory === category.name) {
            category.total += cost.amount;
          }
        });
      });
      console.log(categories);

      res.render('index', {
        user: user,
        categories: categories
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
