let mongoose = require('mongoose')
let Schema = mongoose.Schema

const storeSchema = new Schema({
  userId: {
    type: String  // Schema.ObjectId, ref: 'users'
  },
  pageId: {
    type: String
  },
  shopUrl: {
    type: String
  },
  shopToken: {
    type: String
  }
})

module.exports = mongoose.model('storeInfo', storeSchema)
