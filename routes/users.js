var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');


/* GET users listing. */ 
router.route('/')
.get(function(req, res, next) {
  res.send('return the users');
})
.post(function(req, res, next) {
  console.log('Add User');
  
  var info = req.body;
  var user = new User();
  
  user._id = info.userid;
  user.name = info.name;
  user.pass = info.password;
  user.limit = info.limit;
  user.email = info.email;
  user.costs = [];

  user.save(function(err){
    if(err !== null){
        console.log(err);
        res.status(500).json({'message':'Internal Error in Saving User'});
    } else{
      console.log("User Saved Successfully");
      res.status(200).json({"result": 'ok' });
    }
  });
});

router.route('/:userid')
.get(function(req, res, next){
  res.send('return single user');
})
.put(function(req, res, next){
  res.send('update single user');
})
.delete(function(req, res, next){
  res.send('delete single user');
});


module.exports = router;
