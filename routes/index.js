var express = require('express');
var router = express.Router();
var User = require('../models/user');

 var nodeExcel=require('excel-export');
 var xlsx = require('excel');


/* Redirect based on session */
router.get("/", function(req,res,next){
  if(req.session && req.session.userId){
    res.redirect("/dashboard/" + req.session.userId);
  }else{
    res.redirect("/login");
  }
});



/* GET login page. */
router.get('/login', function(req, res, next) {
  console.log('Login page');
  res.render('login', {});
});

router.post('/login', function(req, res, next) {
  User.authenticate(req.body.username, req.body.password, function(error, user) {
    if (error || !user) {
      console.log("There is an error");
      res.status(401).send();
    } else {
      req.session.userId = user._id;
      res.status(200).send({
        "userId": user._id
      });
    }
  });
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  console.log('Register page');
  res.render('register', {});
});

/* Get dashboard */
router.get('/dashboard/:userId', function(req, res, next) {

  //Categories array of objects
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
      icon: 'ion-ios-paper-outline'
    },
    {
      name: "Travel",
      color: '#00c0ef',
      total: 0,
      icon: 'ion-android-car'
    }
  ];

  if (req.session && req.session.userId) {
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
        user.total = usr[0].total;
        user.email = usr[0].email;
        user.costs = usr[0].costs;

        //calculate total for each category
        user.costs.forEach(function(cost) {
          var costCategory = cost.category;
          //aadd amount to category total
          categories.forEach(function(category) {
            if (costCategory === category.name) {
              category.total = parseFloat(category.total + cost.amount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            }
          });
        });

        //Send warning if user limit is reached/almost reached
        var balance = parseFloat(user.limit) - parseFloat(user.total);

        console.log('balance');
        console.log(balance);
        console.log('limit');
        console.log(user.limit);
        console.log('total');
        console.log(user.total);

        //Format money values
        user.balance = parseFloat(balance).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        user.limit = parseFloat(user.limit).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        user.total = parseFloat(user.total).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

        var notification;
        if (balance <= 200 && balance > 0) {
          notification = {};
          notification.label = 'warning';
          notification.textColor = 'orange';
          notification.message = 'You have ' + user.balance + ' left before reaching your limit of $' + user.limit;
        } else if (balance <= 0) {
          notification = {};
          notification.label = 'danger';
          notification.textColor = 'red';
          notification.message = 'You have negative balance of ' + user.balance + '. Please update your limit!';
        }
        user.notification = notification;

        res.render('index', {
          user: user,
          categories: categories,
        });

      } else {
        console.log("User Not Found!");
        res.status(404).json({
          "message": 'User Not Found'
        });
      }
    });
  } else {
    res.redirect("/login?error");
  }
});

/* Get serrings page */
/* GET register page. */
router.get('/settings/:userId', function(req, res, next) {
  console.log('Settings page');
  if (req.session && req.session.userId) {
    console.log('Getting user settings');
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
        user.total = usr[0].total;
        user.email = usr[0].email;
        user.costs = usr[0].costs;

        //Send warning if user limit is reached/almost reached
        var balance = parseFloat(user.limit) - parseFloat(user.total);
        //Format money values
        user.balance = parseFloat(balance).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        user.limit = parseFloat(user.limit).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        user.total = parseFloat(user.total).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

        var notification;
        if (balance <= 200 && balance > 0) {
          notification = {};
          notification.label = 'warning';
          notification.textColor = 'orange';
          notification.message = 'You have ' + user.balance + ' left before reaching your limit of $' + user.limit;
        } else if (balance <= 0) {
          notification = {};
          notification.label = 'danger';
          notification.textColor = 'red';
          notification.message = 'You have negative balance of ' + user.balance + '. Please update your limit!';
        }
        user.notification = notification;

        res.render('settings', {
          user: user,
        });
      } else {
        console.log("User Not Found!");
        res.status(404).json({
          "message": 'User Not Found'
        });
      }
    });
  } else {
    res.redirect("/login?error");
  }
});


//Using post for edit, want to retreive the user
router.put('/settings/:userId', function(req, res, next) {
  if (req.session && req.session.userId) {
  var userId = req.params.userId;
  var name = req.body.name;
  var email = req.body.email;

  //Limit needs to be fixed, doesn't properly work
  var limit = parseFloat(req.body.limit).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  User.update({ _id: userId }, 
    { $set: { name: name, email: email, limit:limit}}, function(err,user){
      if(err){
        console.log(err);
        res.status(500).send({"error":"Could not update the user"});
      }else{
        res.status(204).send();
      }
    });
  } else {
    res.redirect("/login?error");
  }
});


router.put("/settings/:userId/changePassword", function(req,res, next){
  if(req.session && req.session.userId){

    var userId = req.params.userId;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;

    console.log("UserId:" + userId + " oldPassword:" + oldPassword + " newPassword: " + newPassword);

    User.authenticate(userId,oldPassword, function(error, user) {
      if (error || !user) {
        console.log(error);
        res.status(401).send(error);
      } else {
        user.pass = newPassword;
        user.save(function(err,response){
          if(err){
            res.status(500).send(err);
          }else{
            res.status(204).send();
          }
        })
      }
    });
  }
});



 var conf={}
conf.cols=[
{
    caption:'title',
    type:'string',
    width:100
},
{
    caption:'description',
    type:'string',
    width:100
},

{
    caption:'amount',
    type:'string',
    width:100
},
{
    caption:'category',
    type:'string',
    width:100
}
];


router.get("/export/:userId", function(req,res,next){
  var userId = req.params.userId;


  User.findOne({_id : userId},function(err,user){
    if(err){
      res.status(500).send(err);
    }else{
      var userCosts = user.costs;
      var costsFormatted = [];

      for(var i = 0 ; i < userCosts.length;i++){
        var cost = [userCosts[i].title,
                    userCosts[i].description,
                    userCosts[i].amount,
                    userCosts[i].category];
        costsFormatted.push(cost);
      }
      conf.rows = costsFormatted;
      var result=nodeExcel.execute(conf);
      res.setHeader('Content-Type','application/vnd.openxmlformates');
      res.setHeader("Content-Disposition","attachment;filename="+ userId + ".xlsx");
      res.end(result,'binary');
    }
  });
});

router.post('/import/:userId', function(req, res) {
  var userId = req.params.userId;
  let importedFile = req.files.sampleFile;
  console.log(importedFile.name);
  importedFile.mv(importedFile.name, function(err) {
    if (err)
      return res.status(500).send(err);

    xlsx(importedFile.name, function(err,data) {
      if(err) throw err;
      //console.log(jsonDataArray(data));
      var newExpensesArray = convertExcelToJSON(data);
      console.log(newExpensesArray);
      User.update({ _id: userId }, { $push: {costs: newExpensesArray}},function(err,response){
        if(err){
          console.log(err);
          res.send(err);
        }else{
          res.redirect("/dashboard/" + userId);
        }
      });
    });
  });
});


function convertExcelToJSON(array) {
  var first = array[0].join();
  var headers = first.split(',');
  
  var jsonData = [];
  for ( var i = 1, length = array.length; i < length; i++ )
  {
   
    var myRow = array[i].join();
    var row = myRow.split(',');
    
    var data = {};
    for ( var x = 0; x < row.length; x++ )
    {
      data[headers[x]] = row[x];
    }
    jsonData.push(data);
  }
  return jsonData;
};


module.exports = router;
