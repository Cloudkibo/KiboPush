const logger = require('../../components/logger')
const TemplatePolls = require('./pollTemplate.model')
const TemplateSurveys = require('./surveyTemplate.model')
const SurveyQuestions = require('./surveyQuestion.model')
const Category = require('./category.model')

const TAG = 'api/polls/polls.controller.js'

exports.allPolls = function (req, res) {
  TemplatePolls.find({}, (err, polls) => {
    if (err) {
      logger.serverLog(TAG, `Error: ${err}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: {polls}
    })
  })
}

exports.allSurveys = function (req, res) {
  TemplateSurveys.find({}, (err, surveys) => {
    if (err) {
      logger.serverLog(TAG, `Error: ${err}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    SurveyQuestions.aggregate([{
      $group: {
        _id: {surveyId: '$surveyId', statement: '$statement', options: '$options'}
      }},
      { $project: { statement: 1, options: 1, surveyId: 1 } }
    ], (err2, questions) => {
      if (err2) {
        return res.status(404)
        .json({status: 'failed', description: 'Surveys not found'})
      }
      res.status(200).json({
        status: 'success',
        payload: {surveys: surveys, surveyQuestions: questions}
      })
    })
  })
}

exports.createPoll = function (req, res) {
  let pollPayload = {
    statement: req.body.statement,
    options: req.body.options,
    category: req.body.category
  }
  const poll = new TemplatePolls(pollPayload)

  // save model to MongoDB
  poll.save((err, pollCreated) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        description: 'Failed to insert record'
      })
    } else {
      res.status(201).json({status: 'success', payload: pollCreated})
    }
  })
}

exports.createSurvey = function (req, res) {
  logger.serverLog(TAG,
    `Inside Create Survey, req body = ${JSON.stringify(req.body)}`)
  let surveyPayload = {
    title: req.body.survey.title,
    description: req.body.survey.description,
    category: req.body.survey.category
  }
  const survey = new TemplateSurveys(surveyPayload)

  TemplateSurveys.create(survey, (err, survey) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    // after survey is created, create survey questions
    for (let question in req.body.questions) {
      let options = []
      options = req.body.questions[question].options
      const surveyQuestion = new SurveyQuestions({
        statement: req.body.questions[question].statement, // question statement
        options, // array of question options
        surveyId: survey._id
      })

      surveyQuestion.save((err2, question1) => {
        if (err2) {
          return res.status(404).json({ status: 'failed', description: 'Survey Question not created' })
        }
      })
    }
    return res.status(201).json({status: 'success', payload: survey})
  })
}
exports.allCategories = function (req, res) {
  Category.find({}, (err, categories) => {
    if (err) {
      logger.serverLog(TAG, `Error: ${err}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: categories
    })
  })
}

exports.createCategory = function (req, res) {
  let categoryPayload = {
    name: req.body.name
  }
  const category = new Category(categoryPayload)

  // save model to MongoDB
  category.save((err, categoryCreated) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        description: 'Failed to insert record'
      })
    } else {
      res.status(201).json({status: 'success', payload: categoryCreated})
    }
  })
}
