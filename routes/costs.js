var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/user');
var Cost = require('../models/user');



/* GET costs listing. */
router.route('/')
    .get(function(req, res, next) {
        console.log('getting costs for specific user');
        var userid = req.params.userid;
        var keyword = req.query.keyword;
        console.log('keyword: ' + keyword);

    
        var costs = [];
    
        User.findOne({'_id': userid}, 'costs', function(err, result){
            if(err){
                console.log("ERROR: " + err);
                res.status(500).json({'message':'Internal Error in finding specific user getting costs'});
            } else if ( result.length !== 0){
                if(keyword === undefined){
                    result.costs.forEach(function(cost){    
                        var tempCost = {};
                        tempCost.costid = cost._id;
                        tempCost.title = cost.title;
                        tempCost.description = cost.description;
                        tempCost.amount = cost.amount;
                        tempCost.date = cost.date;
                        tempCost.category = cost.category;
                        if(Object.keys(tempCost).length > 0){
                            costs.push(tempCost);
                        }
                    });
                } else{
                    result.costs.forEach(function(cost){  
                        if(cost.title.includes(keyword) || cost.description.includes(keyword)){
                            var tempCost = {};
                            tempCost.costid = cost._id;
                            tempCost.title = cost.title;
                            tempCost.description = cost.description;
                            tempCost.amount = cost.amount;
                            tempCost.date = cost.date;
                            tempCost.category = cost.category;
                            if(Object.keys(tempCost).length > 0){
                                costs.push(tempCost);
                            }
                        } 
                    });
                }
                
                if(costs.length === 0){
                    console.log('No costs for this user');
                    res.status(404).json({'message': 'no cost'});
                } else {
                    res.status(200).json(costs);
                }   
            } else{
                console.log("User Not Found!");
                res.status(404).json({'message': 'user not found'});
            }
        });
    })
    .post(function(req, res, next) {
      console.log('Adding cost for specific user');

      var userid = req.params.userid;
      var user = new User();
      var cost = {};

      console.log('userid: ' + userid);        
      User.find({_id: userid}, function(err, usr){
          if(err){
              console.log("ERROR: " + err);
              res.status(500).json({'message':'Internal Error in finding specific user for saving cost'});
          } else if ( usr.length !== 0){
            var info = req.body;
            cost.amount = info.amount;
            cost.date = info.date;
            cost.category = info.category;
            cost.title = info.title;
            cost.description = info.description;

            usr[0].costs.push(cost);
            user.costs = usr[0].costs;

            User.update({'_id': userid}, {'costs': user.costs}, function(err, doc){
                if(err !== null){
                    console.log(err);
                    res.status(500).json({'message':'Internal Error in Saving Cost'});
                } else{
                    console.log("Cost saved!");
                    res.status(200).json({'message': 'ok'});
                }
            });
          } else{        
            console.log("User Not Found!");
            res.status(404).json({'message': 'user not found'});
          }
      });
      
    })
    .delete(function(req, res, next) {
      res.send('Delete all costs for specified user');
    });

router.route('/:costid')
    .get(function(req, res, next) {
        // res.send('Get specified cost for specified UserID');
        console.log('costid&&: ' + req.params.costid); 
        console.log('userid&&: ' + req.params.userid); 
    })
    .put(function(req, res, next) {
        res.send('Update specified cost for specified user');
    })
    .delete(function(req, res, next) {
        res.send('Delete specified cost for specified user');
    });

module.exports = router;