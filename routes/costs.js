var express = require('express');
var router = express.Router();
//var User = require('../models/User');

/* GET costs listing. */
router.route('/')
    .get(function(req, res, next) {
      res.send('Get costs for specified UserID');
    })
    .post(function(req, res, next) {
      res.send('Add Cost for specified user');
    })
    .delete(function(req, res, next) {
      res.send('Delete all costs for specified user');
    });

router.route('/:costid')
    .get(function(req, res, next) {
        res.send('Get specified cost for specified UserID');
    })
    .put(function(req, res, next) {
        res.send('Update specified cost for specified user');
    })
    .delete(function(req, res, next) {
        res.send('Delete specified cost for specified user');
    });

module.exports = router;