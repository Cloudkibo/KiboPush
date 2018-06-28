const mongoose = require('mongoose')
const config = require('../server/config/environment')
const automationQueue = require('../server/api/automation_queue/automation_queue.model')

mongoose.connect(config.mongo.uri)

automationQueue.find({}, (err, data) => {
  if (err) {
    console.log(err)
  }

  if (data) {
    let queueOfMessages = data
    myFunction(queueOfMessages)
  }
})

const myFunction = (queueOfMessages) => {
  queueOfMessages.forEach(message => {
    if (message.type === 'survey') {
      console.log('survey data: ' + message)
      mongoose.disconnect()
    }
  })
}
