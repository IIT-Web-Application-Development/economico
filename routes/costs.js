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
        var beginDate = req.query.begindate === undefined ? undefined : parseInt(req.query.begindate);
        var endDate = req.query.enddate === undefined ? undefined : parseInt(req.query.enddate);;

        console.log('keyword: ' + keyword);

        var costs = [];

        User.findOne({'_id': userid}, 'costs', function(err, result){
            if(err){
                console.log("ERROR: " + err);
                res.status(500).json({'message':'Internal Error in finding specific user getting costs'});
            } else if (result){
                if(keyword === undefined){
                    if(beginDate === undefined && endDate === undefined){
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
                            var d = new Date(cost.date);
                            var t = d.getTime();
                            if(t >= beginDate && t <= endDate){
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
                } else{
                    if(beginDate === undefined && endDate === undefined){
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
                    } else{
                        result.costs.forEach(function(cost){
                            var d = new Date(cost.date);
                            var t = d.getTime();
                            if( ( cost.title.includes(keyword) || cost.description.includes(keyword) ) &&
                                    (t >= beginDate && t <= endDate) ){
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
            cost._id = generateID();

            usr[0].costs.push(cost);
            user.costs = usr[0].costs;

            User.update({'_id': userid}, {'costs': user.costs}, function(err, doc){
                if(err !== null){
                    console.log(err);
                    res.status(500).json({'message':'Internal Error in Saving Cost'});
                } else{
                    console.log("Cost saved!");
                    res.status(200).json({'message': 'ok',expense:cost});
                }
            });
          } else{
            console.log("User Not Found!");
            res.status(404).json({'message': 'user not found'});
          }
      });

    })
    .delete(function(req, res, next) {
      console.log('Deleting all costs for specific user');
      var userid = req.params.userid

      User.update({'_id': userid}, {'costs': []}, function(err, done){
          if(err){
              console.log("ERROR: " + err);
              res.status(500).json({'message':'Internal Error in deleting all costs for specific user'});
          } else if (done.n === 0){
              console.log("User Not Found.");
              res.status(404).json({'message': 'user not found'});
          } else {
              console.log("All Costs Deleted Successfully");
              res.status(200).json({'message':'all cost deleted'});
          }
      });
    });

router.route('/:costid')
    .get(function(req, res, next) {
        console.log('getting specific cost for specific user');
        var userid = req.params.userid;
        var costid = parseInt(req.params.costid);
        var tempCost = null;

        User.findOne({'_id': userid}, 'costs', function(err, result){
            if(err){
                console.log("ERROR: " + err);
                res.status(500).json({'message':'Internal Error in finding specific user for getting specific cost'});
            } else if (result){
                result.costs.forEach(function(cost){
                    if(cost._id === costid){
                        tempCost = {};
                        tempCost._id = cost._id;
                        tempCost.amount = cost.amount;
                        tempCost.title = cost.title;
                        tempCost.description = cost.description;
                        tempCost.category = cost.category;
                        tempCost.date = cost.date;
                    }
                });
                if(tempCost){
                    res.status(200).json(tempCost);
                } else {
                    console.log('Cost Not Found');
                    res.status(404).json({'message': 'cost not found'});
                }
            } else{
                console.log("User Not Found!");
                res.status(404).json({'message': 'user not found'});
            }
        });
    })
    .put(function(req, res, next) {
        console.log('Updating specific cost for specific user');

        var userid = req.params.userid;
        var costid = parseInt(req.params.costid);
        var costs = [];
        var info = req.body;
        var updated = false;

        User.findOne({'_id': userid}, 'costs', function(err, result){
            if(err){
                console.log("ERROR: " + err);
                res.status(500).json({'message':'Internal Error in finding specific user to update cost'});
            } else if (result){
                result.costs.forEach(function(cost){
                    if(cost._id === costid){
                        var tempCost = {};
                        updated = true;
                        tempCost._id = costid;
                        tempCost.title = info.title;
                        tempCost.description = info.description;
                        tempCost.amount = info.amount;
                        tempCost.date = info.date;
                        tempCost.category = info.category;
                        if(Object.keys(tempCost).length > 0){
                            costs.push(tempCost);
                        }
                    } else{
                        costs.push(cost);
                    }
                });
                if(updated){
                    User.update({'_id': userid}, {'costs': costs}, function(err, result){
                        if(err){
                            console.log("ERROR: " + err);
                            res.status(500).json({'message':'Internal Error in finding specific user to update cost'});
                        } else if (result.n === 1){
                            console.log('Cost Updated');
                            res.status(200).json({'message':'cost updated'});
                        }
                    });
                } else{
                    console.log('Cost NOt Found');
                    res.status(404).json({'message':'cost not found'});
                }
            } else {
                console.log("User Not Found!");
                res.status(404).json({'message': 'user not found'});
            }
        });

    })
    .delete(function(req, res, next) {
        console.log('Deleting specified cost for specified user');
        var deleted = false;
        var userid = req.params.userid;
        var costid = parseInt(req.params.costid);

        var costs = [];

        User.findOne({'_id': userid}, 'costs', function(err, result){
            if(err){
                console.log("ERROR: " + err);
                res.status(500).json({'message':'Internal Error in finding specific user for deleting specific cost'});
            } else if (result){
                result.costs.forEach(function(cost){
                    if(cost._id === costid){
                        deleted = true;
                    } else{
                        costs.push(cost);
                    }
                });
                if(deleted){
                    User.update({'_id': userid}, {'costs': costs}, function(err, doc){
                        if(err !== null){
                            console.log(err);
                            res.status(500).json({'message':'Internal Error in updating specific user for deleting specific cost'});
                        } else{
                            console.log("Cost Deleted");
                            res.status(200).json({'message':'cost deleted'});
                        }
                    });
                } else {
                    console.log("Cost Not Found!");
                    res.status(404).json({'message': 'cost not found'});
                }
            } else{
                console.log("User Not Found!");
                res.status(404).json({'message': 'user not found'});
            }
        });
    });

function generateID(){
    return Date.now();
}

module.exports = router;
