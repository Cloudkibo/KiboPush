let mongoose = require('mongoose')
let Schema = mongoose.Schema

let cronSchedulerSchema = new Schema({
  serviceName: String,      // can be sequence, team control or abandon cart
  scriptPath: String,       // path to the script
  customPayload: Schema.Types.Mixed,        // option payload
  timeAmount: String,       // time interval for script to run
  timeUnit: String          // Minute, Hour, Day
})

module.exports = mongoose.model('cronScheduler', cronSchedulerSchema)
