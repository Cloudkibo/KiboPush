const utility = require('../utility')
const logicLayer = require('./plans.logiclayer')
const logger = require('../../../components/logger')
const TAG = 'api/v2/plans/plans.controller.js'

exports.index = function (req, res) {
  utility.callApi(`plans`)
  .then(plansTemp => {
    let plans = []
    plansTemp.forEach((plan) => {
      utility.callApi(`companyProfile/aggregate`, 'post', [{$match: {planId: plan._id}}, {$group: {_id: null, count: {$sum: 1}}}])
      .then(companyCount => {
        plan = plan.toObject()
        plan.companyCount = companyCount.length > 0 ? companyCount[0].count : 0
        plans.push(plan)
        if (plans.length === plansTemp.length) {
          res.status(200).json({
            status: 'success',
            payload: plans
          })
        }
      })
      .catch(error => {
        res.status(500).json({
          status: 'failed',
          payload: `Internal Server Error ${JSON.stringify(error)}`
        })
      })
    })
  })
  .catch(error => {
    res.status(500).json({
      status: 'failed',
      payload: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}

exports.update = function (req, res) {
  utility.callApi(`plans/query`, 'post', {unique_ID: req.body.unique_id})
  .then(plan => {
    let planTemp = {}
    planTemp.name = req.body.name
    planTemp.interval = req.body.interval
    planTemp.trial_period = req.body.trial_period
    planTemp.unique_id = plan.unique_ID
    utility.callApi(`plans`, 'put', planTemp)
    .then(result => {
      logger.serverLog(TAG, 'Plan has been updated on KiboPush. Going to update plan on stripe.')
      res.status(200).json({
        status: 'success',
        description: 'Plan has been updated successfully!'
      })
    })
    .catch(error => {
      res.status(500).json({
        status: 'failed',
        description: error
      })
    })
  })
  .catch(error => {
    res.status(500).json({
      status: 'failed',
      description: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}

exports.create = function (req, res) {
  utility.callApi(`plans`)
  .then(plans => {
    var uid = logicLayer.createUniqueId(plans)
    let planData = logicLayer.preparePlansData(req.body, uid)
    utility.callApi(`plans/`, 'post', planData)
    .then(result => {
      res.status(200).json({
        status: 'success',
        description: 'Plan has been created successfully!'
      })
    })
    .catch(error => {
      res.status(500).json({
        status: 'failed',
        description: `Plan creation failed.${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    res.status(500).json({
      status: 'failed',
      description: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}

exports.delete = function (req, res) {
  utility.callApi(`plans/${req.params.id}`, 'delete')
  .then(deleted => {
    res.status(200).json({
      status: 'success',
      description: 'Plan has been deleted successfully!'
    })
  })
  .catch(error => {
    res.status(500).json({
      status: 'failed',
      description: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}

exports.changeDefaultPlan = function (req, res) {
  utility.callApi(`plans`, 'post', {plan_id: req.body.plan_id, account_type: req.body.account_type})
  .then(result => {
    res.status(200).json({
      status: 'success',
      description: result
    })
  })
  .catch(error => {
    res.status(500).json({
      status: 'failed',
      description: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}

exports.migrateCompanies = function (req, res) {
  utility.callApi(`plans`, 'post', {to: req.body.to, from: req.body.from})
  .then(result => {
    res.status(200).json({
      status: 'success',
      description: result
    })
  })
  .catch(error => {
    res.status(500).json({
      status: 'failed',
      description: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}
