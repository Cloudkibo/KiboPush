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
var surveyOptions = require('./surveyQuestions').surveyOptions;

// force: true will drop the table if it already exists
Users.sync({force: true}).then(() => {
  // Table created
  return Users.create({
    firstName: 'John',
    lastName: 'Hancock',
    email: 'what@email.com'
  });
});