/**
 * Created by sojharo on 20/07/2017.
 */

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // production

console.log(app.get('env'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO for authentication middleware to see if the request sender is authorised server or not
app.use('/', function(req, res, next){
  console.log('this middleware will authenticate the token. For now, all is authorized.');
});

var routes = require('./routes');

routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('RESTful API server started on: ' + port);
