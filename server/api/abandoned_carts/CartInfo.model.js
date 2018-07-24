let mongoose = require('mongoose')
let Schema = mongoose.Schema

const cartSchema = new Schema({
  shopifyCartId: {
    type: String
  },
  cartToken: {
    type: String
  },
  storeId: {
    type: String
  },
  userId: {
    type: String
  },
  pageId: {
    type: String
  },
  linePrice: {
    type: Number
  },
  productIds: {
    type: [String]
  }
})

module.exports = mongoose.model('cartInfo', cartSchema)
