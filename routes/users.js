var express = require('express');
var router = express.Router();
//var User = require('../models/User');

/* GET users listing. */
router.route('/')
    .get(function(req, res, next) {
      res.send('return the users');
    })
    .post(function(req, res, next) {
      res.send('Add User');
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
