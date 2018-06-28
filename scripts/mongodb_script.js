const mongoose = require('mongoose')
const logger = require('../server/components/logger')
const config = require('../server/config/environment')
const automationQueue = require('../server/api/automation_queue/automation_queue.model')
const surveyQuestions = require('../server/api/surveys/surveyquestions.model')
const Surveys = require('../server/api/surveys/surveys.model')
const TAG = 'scripts/monodb_script.js'

mongoose.connect(config.mongo.uri)

automationQueue.find({}, (err, data) => {
  if (err) {
    console.log(err)
  }

  if (data) {
    for (let i = 0; i < data.length; i++) {
      let obj = data[i]
      if (obj.type === 'survey') {
        // If the saved automated message type is survey
        console.log('survey data: ' + obj)
        surveyQuestions.find({ surveyId: obj._id })
        .populate('surveyId')
        .exec((err2, questions) => {
          if (err2) {
            return logger.serverLog(TAG, `At survey question ${JSON.stringify(err2)}`)
          }

          // Do the remaining work here
        })
      }
    }
  }
  mongoose.disconnect()
})
