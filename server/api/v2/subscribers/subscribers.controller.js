const logicLayer = require('./subscribers.logiclayer')
const utility = require('../utility')
// const logger = require('../../../components/logger')
// const TAG = 'api/v2/subscribers/subscribers.controller.js'

exports.index = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    utility.callApi(`subscribers/query`, 'post', {companyId: companyuser.companyId, isEnabledByPage: true, isSubscribed: true}) // fetch subscribers of company
    .then(subscribers => {
      let subscriberIds = logicLayer.getSubscriberIds(subscribers)
      utility.callApi(`tagsSubscribers/generic`, 'post', {subscriberId: {$in: subscriberIds}}) // use this from own database (KiboEngage)
      .then(tags => {
        let subscribersPayload = logicLayer.getSusbscribersPayload(subscribers, tags)
        return res.status(200).json({
          status: 'success',
          payload: subscribersPayload
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch tags subscribers ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch subscribers ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}

exports.allSubscribers = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    utility.callApi(`subscribers/query`, 'post', {companyId: companyuser.companyId, isEnabledByPage: true}) // fetch subscribers of company
    .then(subscribers => {
      let subscriberIds = logicLayer.getSubscriberIds(subscribers)
      utility.callApi(`tagsSubscribers/generic`, 'post', {subscriberId: {$in: subscriberIds}}) // use this from own database (KiboEngage)
      .then(tags => {
        let subscribersPayload = logicLayer.getSusbscribersPayload(subscribers, tags)
        return res.status(200).json({
          status: 'success',
          payload: subscribersPayload
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch tags subscribers ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch subscribers ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}

exports.allLocales = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let aggregateObject = [{$group: {_id: null, locales: {$addToSet: '$locale'}}}]
    utility.callApi(`subscribers/aggregate`, 'post', aggregateObject) // fetch subscribers locales
    .then(locales => {
      return res.status(200).json({
        status: 'success',
        payload: locales[0].locales
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch locales ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}

exports.getAll = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let criterias = logicLayer.getCriterias(req.body, companyuser)
    utility.callApi(`subscribers/aggregate`, 'post', criterias.countCriteria) // fetch subscribers count
    .then(count => {
      utility.callApi(`subscribers/aggregate`, 'post', criterias.fetchCriteria) // fetch subscribers
      .then(subscribers => {
        let subscriberIds = logicLayer.getSubscriberIds(subscribers)
        utility.callApi(`tagsSubscribers/generic`, 'post', {subscriberId: {$in: subscriberIds}})// use this from own database (KiboEngage)
        .then(tags => {
          let subscribersPayload = logicLayer.getSusbscribersPayload(subscribers, tags)
          return res.status(200).json({
            status: 'success',
            payload: {subscribers: subscribersPayload, count: count.length > 0 ? count[0].count : 0}
          })
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch tags subscribers ${JSON.stringify(error)}`
          })
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch connected pages ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch connected pages count ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}

exports.subscribeBack = function (req, res) {
  utility.callApi(`subscribers/update`, 'put', {query: {_id: req.params.id, unSubscribedBy: 'agent'}, newPayload: {isSubscribed: true, unSubscribedBy: 'subscriber'}, options: {}}) // fetch single subscriber
  .then(subscriber => {
    return res.status(200).json({
      status: 'success',
      payload: subscriber
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch subscriber ${JSON.stringify(error)}`
    })
  })
}
