let mongoose = require('mongoose')
let Schema = mongoose.Schema

const storeSchema = new Schema({
  userId: {
    type: String
  },
  pageId: {
    type: String
  },
  shopId: {
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
