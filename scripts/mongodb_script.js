// const mongoose = require('mongoose')
const logger = require('../server/components/logger')
// const config = require('../server/config/environment')
// const automationQueue = require('../server/api/automation_queue/automation_queue.model')
// const surveyQuestions = require('../server/api/surveys/surveyquestions.model')
// const Surveys = require('../server/api/surveys/surveys.model')
const TAG = 'scripts/monodb_script.js'

// mongoose.connect(config.mongo.uri)

// automationQueue.find({}, (err, data) => {
//   if (err) {
//     console.log(err)
//   }

//   if (data) {
//     for (let i = 0; i < data.length; i++) {
//       let obj = data[i]
//       if (obj.type === 'survey') {
//         // If the saved automated message type is survey
//         console.log('survey data: ' + obj)
//         surveyQuestions.find({ surveyId: mongoose.Types.ObjectId(obj._id) })
//         .populate('surveyId')
//         .exec((err2, questions) => {
//           if (err2) {
//             return logger.serverLog(TAG, `At survey question ${JSON.stringify(err2)}`)
//           }

//           // Do the remaining work here
//         })
//       }
//     }
//   }
//   mongoose.disconnect()
// })

const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const assert = require('assert')

// Connection URL
const url = 'mongodb://localhost:27017'
// Database Name
const dbName = 'kibopush-dev'
const AutomationQueue = 'automation_queues'
const Surveys = 'surveys'
const SurveyQuestions = 'surveyquestions'

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err)
  console.log('Connected successfully to server: ' + dbName)

  const db = client.db(dbName)

  findQueueMessages(db, (messages) => {
    // traversing the jsonarray for each message.
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i]

      if (message.type === 'survey') {
        findSurveyQuestions(db, message.automatedMessageId, (questions) => {
          console.log({questions})

          findSurvey(db, message.automatedMessageId, (survey) => {
            console.log({survey})

            if (questions.length > 0) {
              let FirstQuestion = questions[0]
              // create buttons
              const buttons = []
              let NextQuestionId = 'nil'
              if (questions.length > 1) {
                NextQuestionId = questions[1]._id
              }
            }
          })
        })
      }
    }
  })

  // client.close()
})

const findQueueMessages = function (db, callback) {
  // Get the Automation Queue collection
  const collection = db.collection(AutomationQueue)
  // Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null)
    callback(docs)
  })
}

const findSurveyQuestions = function (db, automatedMessageId, callback) {
  // Get the Survey questions
  const collection = db.collection(SurveyQuestions)
  // Find some documents
  collection.find({'surveyId': mongo.ObjectID(automatedMessageId)}).toArray((err, questions) => {
    assert.equal(err, null)
    callback(questions)
  })
}

const findSurvey = function (db, automatedMessageId, callback) {
  const collection = db.collection(Surveys)
  collection.find({'_id': mongo.ObjectID(automatedMessageId)}).toArray((err, survey) => {
    assert.equal(err, null)
    callback(survey)
  })
}
