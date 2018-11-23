const PagePoll = require('./../../v1/page_poll/page_poll.model')

exports.genericUpdate = (query, updated, options) => {
  return PagePoll.update(query, updated, options)
    .exec()
}

exports.aggregate = (query) => {
  return PagePoll.aggregate(query)
    .exec()
}

exports.find = (query) => {
  return PagePoll.find(query)
    .exec()
}
exports.genericFind = (query) => {
  return PagePoll.find(query)
    .exec()
}
exports.createForPollPage = (payload) => {
  let obj = new PagePoll(payload)
  return obj.save()
}
exports.deleteForPollPage = (query) => {
  return PagePoll.deleteMany(query)
    .exec()
}
