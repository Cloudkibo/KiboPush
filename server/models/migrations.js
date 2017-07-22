var Users = require('./Users').Users;
var Pages = require('./Pages').Pages;
var Subscribers = require('./Subscribers').Subscribers;
var Broadcasts = require('./Broadcasts').Broadcasts;
var Messages = require('./Messages').Messages;
var Links = require('./Links').Links;
var Medias = require('./Medias').Medias;
var Polls = require('./Polls').Polls;
var pollOptions = require('./pollOptions').pollOptions;
var Surveys = require('./Surveys').Surveys;
var surveyQuestions = require('./surveyQuestions').surveyQuestions;
var surveyOptions = require('./surveyOptions').surveyOptions;
var db = require('./connections').sequelize;

Users.hasMany(Pages);
Users.hasMany(Subscribers);
Pages.belongsTo(Users);
Subscribers.belongsTo(Users);
Pages.hasMany(Subscribers);
Subscribers.belongsTo(Pages);
Users.hasMany(Broadcasts);
Broadcasts.belongsTo(Users);
Broadcasts.hasOne(Messages);
Messages.belongsTo(Broadcasts);
// TODO do here for userid in messages table

Broadcasts.hasOne(Polls);
Polls.belongsTo(Broadcasts);
Polls.hasMany(pollOptions);
pollOptions.belongsTo(Polls);

// TODO part of survey
// Broadcasts.hasOne(Surveys);

db
  .sync({force: true}) // create the database table for our model(s)
  .then(function(){
    // do some work
  });


// force: true will drop the table if it already exists
// Users.sync({force: true}).then(() => {
//   // Table created
//   // return Users.create({
//   //   firstName: 'John',
//   //   lastName: 'Hancock',
//   //   email: 'what@email.com'
//   // });
// });
//
// Pages.sync({force: true}).then(() => {
//
// });
// Subscribers.sync({force: true}).then(() => {
//
// });
// Broadcasts.sync({force: true}).then(() => {
//
// });
// Messages.sync({force: true}).then(() => {
//
// });
// Links.sync({force: true}).then(() => {
//
// });
// Medias.sync({force: true}).then(() => {
//
// });
// Polls.sync({force: true}).then(() => {
//
// });
// pollOptions.sync({force: true}).then(() => {
//
// });
// Surveys.sync({force: true}).then(() => {
//
// });
// surveyQuestions.sync({force: true}).then(() => {
//
// });
// surveyOptions.sync({force: true}).then(() => {
//
// });
