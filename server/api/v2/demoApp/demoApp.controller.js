const utility = require('../utility')
const LogicLayer = require('./demoApp.logiclayer')
const Sessions = require('../../v1/sessions/sessions.model')

exports.uploadCustomerInfo = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization)
    .then(companyUser => {
      utility.callApi(`companyprofile/query`, 'post', {_id: companyUser.companyId}, req.headers.authorization)
        .then(company => {
          let dataToSend = LogicLayer.prepareData(company, req.body)
          utility.callApi('customers', 'post', dataToSend, '', 'demoApp')
            .then(saved => {
              return res.status(200).json({status: 'success', payload: 'File uploaded successfully'})
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to save data ${JSON.stringify(err)}`})
            })
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: `Failed to fetch company profile ${JSON.stringify(err)}`})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch company user ${JSON.stringify(err)}`})
    })
}

exports.getCustomers = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization)
    .then(companyUser => {
      utility.callApi(`customers/company/${companyUser.companyId}`, 'get', {}, '', 'demoApp')
        .then(customers => {
          return res.status(200).json({status: 'success', payload: customers})
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: `Failed to save data ${JSON.stringify(err)}`})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch company user ${JSON.stringify(err)}`})
    })
}

exports.appendSubscriber = function (req, res) {
  console.log(JSON.stringify(req.body))
  utility.callApi(`subscribers/${req.body.subscriberId}`, 'get', {}, req.headers.authorization)
    .then(subscriber => {
      Sessions.update({subscriber_id: req.body.subscriberId}, {customerId: req.body.customerId}).exec()
        .then(updated => {
          utility.callApi(`customers/${req.body.customerId}`, 'put', {subscriber: subscriber}, '', 'demoApp')
            .then(saved => {
              return res.status(200).json({status: 'success', payload: 'subscriber added successfully'})
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to save subscriber ${JSON.stringify(err)}`})
            })
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: `Failed to update session ${JSON.stringify(err)}`})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch subscriber ${JSON.stringify(err)}`})
    })
}
