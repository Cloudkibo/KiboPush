const Polls = require('./../../v1/polls/Polls.model')
const Surveys = require('./../../v1/surveys/surveys.model')
const PollResponses = require('./../../v1/polls/pollresponse.model')
const SurveyResponses = require('./../../v1/surveys/surveyresponse.model')

exports.findPolls = function (query) {
  return Polls.find(query)
    .exec()
}

exports.findPollResponses = function (query) {
  return PollResponses.find(query)
    .exec()
}

exports.findSurveys = function (query) {
  return Surveys.find(query)
    .exec()
}

exports.findSurveyResponses = function (query) {
  return SurveyResponses.find(query)
    .exec()
}
