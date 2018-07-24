let mongoose = require('mongoose')
let Schema = mongoose.Schema

const checkoutSchema = new Schema({
  shopifyCheckoutId: {
    type: String
  },
  checkoutToken: {
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
  totalPrice: {
    type: Number
  },
  abandonedCheckoutUrl: {
    type: String
  },
  productIds: {
    type: [String]
  }
})

module.exports = mongoose.model('checkoutInfo', checkoutSchema)
