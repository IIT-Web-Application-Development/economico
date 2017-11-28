var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');


/* GET users listing. */
router.route('/')
.get(function(req, res, next) {
  console.log('Getting Users');
  var userid = req.params.userid;

  var users = [];

  User.find({}, '-pass -costs', function(err, result){
      if(err){
          console.log("ERROR in finding all users: " + err);
          res.status(500).json({'message':'Internal Error in finding all users'});
      } else if ( result.length !== 0){
          result.forEach(function(r){
              var user = {};
              user.id = r._id;
              user.name = r.name;
              user.email = r.email;
              user.limit = r.limit
              users.push(user);
          });
          res.status(200).json(users);
      } else{
          console.log("Not any user found");
          res.status(404).json({'message':'no users'});
      }
  });
})
.post(function(req, res, next) {
  console.log('Adding User');

  var info = req.body;
  var user = new User();

  user._id = info.username;
  user.name = info.name;
  user.pass = info.password;
  // user.limit = info.limit;
  user.email = info.email;
  user.costs = [];

  user.save(function(err,user){
    if(err !== null){
        console.log(err.code);
        if(err.code === 11000){
          res.status(500).json({"exists": true});
        }else{
          res.status(500).json({'message':'Internal Error in Saving User'});
        }
        
    } else{
      console.log("User Saved Successfully");
      req.session.userId = user._id;
      res.status(200).json({"message": 'ok' ,user:user});
    }
  });
});

router.route('/:userid')
.get(function(req, res, next){
  console.log('Getting specific user');
  var userid = req.params.userid;
  var user = {};
  User.find({'_id': userid}, function(err, usr){
      if(err){
        console.log("ERROR in finding user: " + err);
        res.status(500).json({'message':'Internal Error in Finding User'});
      } else if ( usr.length !== 0){
        user._id = usr[0]._id;
        user.name = usr[0].name;
        user.pass = usr[0].pass;
        user.limit = usr[0].limit;
        user.email = usr[0].email;
        user.costs = usr[0].costs;
        res.render('index', {
          user:user
        });
      } else{
        console.log("User Not Found!");
        res.status(404).json({"message": 'User Not Found' });
      }
  });
})
.put(function(req, res, next){
  console.log('Updating specific user');

  var user = User.update({'_id': req.params.userid}, req.body);
  user.exec((err, result) => {
      if(err) res.status(500).json({'message': 'internal error in updating user'});
      if(result.n === 0){
          console.log('User Not Found');
          res.status(404).json({'message': 'user not found'});
      } else {
          console.log('User Updated');
          res.status(200).json({'message': 'user updated'});
      }
  });
})
.delete(function(req, res, next){
  console.log('Deleting All Users');
  var userid = req.params.userid;

  User.remove({'_id': userid}, function(err, done){
      if(err !== null){
          console.log(err);
          res.status(500).json({'message':'Internal Error in deleting user'});
      } else if (done.result.n === 0){
          console.log("User Not Found.");
          res.status(200).json({'message': 'user not found'});
      } else{
          console.log("User Deleted Successfully");
          res.status(200).json({'message': 'user deleted successfully'});
      }
  });
});


module.exports = router;
