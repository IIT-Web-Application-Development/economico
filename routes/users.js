var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');


/* GET users listing. */
router.route('/')
  .get(function(req, res, next) {

    console.log('Getting Users');
    User.find({}, function(err, users) {
      if (err) {
        console.log("ERROR in finding user: " + err);
        res.status(500).json({
          'message': 'Internal Error in Finding User'
        });
      } else if (users.length !== 0) {
        res.send(users);
      } else {
        console.log("User Not Found!");
        res.status(200).json({});
      }
    });
  })
  .post(function(req, res, next) {
    console.log('Adding User');

    var info = req.body;
    var user = new User();

    user._id = info.userid;
    user.name = info.name;
    user.pass = info.password;
    user.limit = info.limit;
    user.email = info.email;
    user.costs = [];

    user.save(function(err) {
      if (err !== null) {
        console.log(err);
        res.status(500).json({
          'message': 'Internal Error in Saving User'
        });
      } else {
        console.log("User Saved Successfully");
        res.status(200).json({
          "result": 'ok',
          user:user
        });
      }
    });
  });

router.route('/:userid')
  .get(function(req, res, next) {
    console.log('Getting specific user');
    var userid = req.params.userid;
    var user = {};
    User.find({
      '_id': userid
    }, function(err, usr) {
      if (err) {
        console.log("ERROR in finding user: " + err);
        res.status(500).json({
          'message': 'Internal Error in Finding User'
        });
      } else if (usr.length !== 0) {
        console.log(usr);
        user._id = usr[0]._id;
        user.name = usr[0].name;
        user.pass = usr[0].pass;
        user.limit = usr[0].limit;
        user.email = usr[0].email;
        user.costs = usr[0].costs;
        // res.status(200).json(user);

        res.render('index', {
          user:user
        });

      } else {
        console.log("User Not Found!");
        res.status(200).json({});
      }
    });
  })
  .put(function(req, res, next) {
    res.send('update single user');
  })
  .delete(function(req, res, next) {
    res.send('delete single user');
  });

module.exports = router;
