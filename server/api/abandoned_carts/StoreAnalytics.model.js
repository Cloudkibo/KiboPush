let mongoose = require('mongoose')
let Schema = mongoose.Schema

const storeAnalyticsSchema = new Schema({
  storeId: { type: Schema.ObjectId, ref: 'storeInfo' },
  totalExtraSales: { type: Number },
  totalAbandonedCarts: { type: Number },
  totalPurchasedCarts: { type: Number },
  totalSubscribers: {type: Number},
  totalPushSent: {type: Number}
})

module.exports = mongoose.model('storeAnalytics', storeAnalyticsSchema)
