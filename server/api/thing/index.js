'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');


var auth = require('../../auth/auth.service');


var User = require('../user/Users.model');

const TAG = 'api/thing/index.js';
/*
router.get('/', function (req, res) {
  logger.serverLog(TAG, 'things api is working');
  var payload = {
    name: 'sojharo',
  };

  Users
    .create(payload)
    .then(function(){
       Pages
      .create({pageName: 'name', pageCode: 'ie idsa', enabled: true})
      .then(function(){
        res.status(200).json({ status: 'success', data: payload });
      })
      .catch(function(err){
        res.status(500).json({ err: err, description: "Something went wrong" });
      });
    })
    .catch(function(err){
      res.status(500).json({ err: err, description: "Something went wrong" });
    });


});

router.get('/fetch', function (req, res) {
 logger.serverLog(TAG, 'things api is working');
  Users.findAll().then(function(data){
    res.status(200).json({ status: 'success', data: data });
  });
});

router.get('/update', function (req, res) {
  logger.serverLog(TAG, 'things api is working');
  var user = Users.findOne();
  
  Pages.findById(1).then(function(page){
    console.log(page);
    console.log("Page Model Options: ", page.associate(user));
    // page.getUser(user);
  })
  logger.serverLog(TAG,user);
  // user.getPages();
  // Pages
  //   .create({pageName: 'ss', pageId: 'sad',enabled: true})
  //   .then(function(page){
      res.status(200).json({d:'s'});
  //   })
  //   .catch(function(err){
  //     res.status(500).json({ err: err, description: "Something went wrong", user: user});
  //   });
});

*/
router.get('/save', function (req, res) {
var silence = new User({ name: 'Silence' });
  console.log(silence); // 'Silence'
   silence.save(function(err) {
        if (err)
           throw err;
        else 
            res.status(200).json({status: 'Success'});
    });
});
router.get('/mongo', function (req, res) {
  
  User.find(function(err, users){
    console.log("User", users);
    console.log("Error", err);
    res.status(200).json(users);  
  })
});




module.exports = router;
