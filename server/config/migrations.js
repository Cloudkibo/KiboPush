var Users = require('../api/user/user.model').Users;
var Pages = require('../api/pages/pages.model').Pages;
var Subscribers = require('../api/subscribers/subscribers.model').Subscribers;
var Broadcasts = require('../api/broadcasts/broadcasts.model').Broadcasts;
var Messages = require('../api/messages/messages.model').Messages;
var Links = require('../api/links/links.model').Links;
var Medias = require('../api/media/media.model').Medias;
var Polls = require('../api/polls/polls.model').Polls;
var pollOptions = require('../api/polloptions/polloptions.model').pollOptions;
var Surveys = require('../api/surveys/surveys.model').Surveys;
var surveyQuestions = require('../api/surveryquestions/surveryquestions.model').surveyQuestions;
var surveyOptions = require('../api/surveryoptions/surveryoptions.model').surveyOptions;
var db = require('../components/db').sequelize;

var logger = require('../components/logger');
const TAG = 'models/migrations';

Users.hasMany(Pages);
Users.hasMany(Subscribers);
Users.hasMany(Broadcasts);

Pages.belongsTo(Users);
Pages.hasMany(Subscribers);

Subscribers.belongsTo(Users);
Subscribers.belongsTo(Pages);

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
    logger.serverLog(TAG, 'Done with migrations. Database is setup. You can now exit the script');
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
