var userSchema= require('../api/user/Users.model').userSchema;
var mongoose = require('./mongo-connect').mongoose;



var silence = new User({ name: 'Silence' });
console.log(silence); // 'Silence'