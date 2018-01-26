const logger = require('../../components/logger')
const TemplatePolls = require('./pollTemplate.model')
const TemplateSurveys = require('./surveyTemplate.model')
const TemplateBroadcasts = require('./broadcastTemplate.model')
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
      payload: polls
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
    // SurveyQuestions.aggregate([{
    //   $group: {
    //     _id: {surveyId: '$surveyId', statement: '$statement', options: '$options'}
    //   }},
    //   { $project: { statement: 1, options: 1, surveyId: 1 } }
    // ], (err2, questions) => {
    //   if (err2) {
    //     return res.status(404)
    //     .json({status: 'failed', description: 'Surveys not found'})
    //   }
    res.status(200).json({
      status: 'success',
      payload: surveys
    })
  })
}

exports.createPoll = function (req, res) {
  let pollPayload = {
    title: req.body.title,
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
exports.editCategory = function (req, res) {
  Category.findById(req.body._id, (err, category) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!category) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    category.name = req.body.name
    category.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: category})
    })
  })
}
exports.surveyDetails = function (req, res) {
  TemplateSurveys.find({_id: req.params.surveyid}, (err, survey) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    // find questions
    SurveyQuestions.find({surveyId: req.params.surveyid})
      .populate('surveyId')
      .exec((err2, questions) => {
        if (err2) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err2)}`
          })
        }
        return res.status(200).json({status: 'success', payload: {survey, questions}})
      })
  })
}

exports.pollDetails = function (req, res) {
  TemplatePolls.findOne({_id: req.params.pollid}, (err, poll) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    if (!poll) {
      return res.status(404).json({
        status: 'failed',
        description: `Poll not found.`
      })
    }
    return res.status(200)
    .json({status: 'success', payload: poll})
  })
}
exports.deletePoll = function (req, res) {
  logger.serverLog(TAG,
    `This is body in delete autoposting ${JSON.stringify(req.params)}`)
  TemplatePolls.findById(req.params.id, (err, poll) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!poll) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    poll.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'poll update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
exports.deleteCategory = function (req, res) {
  logger.serverLog(TAG,
    `This is body in delete autoposting ${JSON.stringify(req.params)}`)
  Category.findById(req.params.id, (err, category) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!category) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    category.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'category update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
exports.deleteSurvey = function (req, res) {
  logger.serverLog(TAG,
    `This is body in delete survey ${JSON.stringify(req.params)}`)
  TemplateSurveys.findById(req.params.id, (err, survey) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!survey) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    survey.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'survey update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
exports.editSurvey = function (req, res) {
  logger.serverLog(TAG,
    `This is body in edit autoposting ${JSON.stringify(req.body)}`)
  TemplateSurveys.findById(req.body.survey._id, (err, survey) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!survey) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
      // after survey is created, create survey questions
    survey.title = req.body.survey.title
    survey.description = req.body.survey.description
    survey.category = req.body.survey.category
    survey.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      SurveyQuestions.find({surveyId: req.body.survey._id}, (err2, questions) => {
        if (err2) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err2)}`
          })
        }
        logger.serverLog(TAG, `anishachhatlength: ${questions.length}`)
        for (let i = 0; i < questions.length; i++) {
          logger.serverLog(TAG, `anishachhat: ${questions[i]}`)
          questions[i].remove((err2) => {
            if (err2) {
              return res.status(500)
                .json({status: 'failed', description: 'survey update failed'})
            }
          })
        }
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
    })
  })
}
exports.editPoll = function (req, res) {
  TemplatePolls.findById(req.body._id, (err, poll) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!poll) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    poll.title = req.body.title
    poll.statement = req.body.statement
    poll.options = req.body.options
    poll.category = req.body.category
    poll.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: poll})
    })
  })
}

exports.createBroadcast = function (req, res) {
  let broadcastPayload = {
    title: req.body.title,
    category: req.body.category,
    payload: req.body.payload
  }
  const broadcast = new TemplateBroadcasts(broadcastPayload)

  // save model to MongoDB
  broadcast.save((err, broadcastCreated) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        description: 'Failed to insert record'
      })
    } else {
      res.status(201).json({status: 'success', payload: broadcastCreated})
    }
  })
}
exports.allBroadcasts = function (req, res) {
  TemplateBroadcasts.find({}, (err, broadcasts) => {
    if (err) {
      logger.serverLog(TAG, `Error: ${err}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: broadcasts
    })
  })
}
exports.deleteBroadcast = function (req, res) {
  TemplateBroadcasts.findById(req.params.id, (err, broadcast) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!broadcast) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    broadcast.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'poll update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
exports.editBroadcast = function (req, res) {
  TemplateBroadcasts.findById(req.body._id, (err, broadcast) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!broadcast) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    broadcast.title = req.body.title
    broadcast.payload = req.body.payload
    broadcast.category = req.body.category
    broadcast.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: broadcast})
    })
  })
}
exports.broadcastDetails = function (req, res) {
  //
  TemplateBroadcasts.findOne({_id: req.params.broadcastid}, (err, broadcast) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    if (!broadcast) {
      return res.status(404).json({
        status: 'failed',
        description: `Poll not found.`
      })
    }
    return res.status(200)
    .json({status: 'success', payload: broadcast})
  })
}
