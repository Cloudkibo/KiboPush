const Plans = require('./plans.model')
const _ = require('lodash')
const logger = require('../../components/logger')
const TAG = 'api/plans/plans.controller.js'
const config = require('../../config/environment/index')
const CompanyProfile = require('./../companyprofile/companyprofile.model')
const stripeOptions = config.stripeOptions
const Stripe = require('stripe')
const stripe = Stripe(stripeOptions.apiKey)

exports.index = function (req, res) {
  Plans.find({}, (err, plansTemp) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    let plans = []
    plansTemp.forEach((plan) => {
      CompanyProfile.aggregate([{$match: {planId: plan._id}}, {$group: {_id: null, count: {$sum: 1}}}], (err2, companyCount) => {
        if (err2) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting companies count ${JSON.stringify(err2)}`
          })
        }
        console.log('inside else')
        plan = plan.toObject()
        plan.companyCount = companyCount.length > 0 ? companyCount[0].count : 0
        plans.push(plan)
        if (plans.length === plansTemp.length) {
          console.log(plans)
          res.status(200).json({
            status: 'success',
            payload: plans
          })
        }
      })
    })
  })
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'name')) parametersMissing = true
  if (!_.has(req.body, 'interval')) parametersMissing = true
  if (!_.has(req.body, 'trial_period')) parametersMissing = true
  if (!_.has(req.body, 'amount')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  Plans.find({}, (err, plans) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    let lastUID = plans[plans.length - 1].unique_ID
    let temp = lastUID.split('_')
    let uid = String.fromCharCode(temp[1].charCodeAt() + 1)

    let planData = {
      name: req.body.name,
      unique_ID: 'plan_' + uid,
      amount: req.body.amount,
      interval: req.body.interval,
      trial_period: req.body.trial_period
    }

    let plan = new Plans(planData)
    plan.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Plan creation failed'})
      }
      logger.serverLog(TAG, 'plan has been created on KiboPush. Going to create plan on stripe.')
      stripe.plans.create({
        amount: req.body.amount * 100,
        id: 'plan_' + uid,
        currency: 'usd',
        nickname: req.body.name,
        interval: req.body.interval,
        trial_period_days: req.body.trial_period,
        product: stripeOptions.product
      }, (err, plan) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Failed to create plan on stripe ${JSON.stringify(err)}`
          })
        }
        logger.serverLog(TAG, 'plan has been created on stripe as well.')
        res.status(200).json({
          status: 'success',
          description: 'Plan has been created successfully!'
        })
      })
    })
  })
}

exports.update = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'name')) parametersMissing = true
  if (!_.has(req.body, 'trial_period')) parametersMissing = true
  if (!_.has(req.body, 'unique_id')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  Plans.findOne({unique_ID: req.body.unique_id}, (err, plan) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    plan.name = req.body.name
    plan.interval = req.body.interval
    plan.trial_period = req.body.trial_period
    plan.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Plan update failed'})
      }
      logger.serverLog(TAG, 'plan has been updated on KiboPush. Going to update plan on stripe.')
      stripe.plans.update(req.body.unique_id, {
        nickname: req.body.name,
        trial_period_days: req.body.trial_period
      }, (err, plan) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Failed to update plan on stripe ${JSON.stringify(err)}`
          })
        }
        logger.serverLog(TAG, 'plan has been updated on stripe as well.')
        res.status(200).json({
          status: 'success',
          description: 'Plan has been updated successfully!'
        })
      })
    })
  })
}

exports.delete = function (req, res) {
  Plans.deleteOne({unique_ID: req.params.id}, (err, deleted) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, 'plan has been deleted on KiboPush. Going to delete plan on stripe.')
    stripe.plans.del(req.body.unique_id, (err, confirmation) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Failed to delete plan on stripe ${JSON.stringify(err)}`
        })
      }
      logger.serverLog(TAG, 'plan has been deleted on stripe as well.')
      res.status(200).json({
        status: 'success',
        description: 'Plan has been deleted successfully!'
      })
    })
  })
}

exports.changeDefaultPlan = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'plan_id')) parametersMissing = true
  if (!_.has(req.body, 'account_type')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  let criteria1 = {}
  let criteria2 = {}
  if (req.body.account_type === 'individual') {
    criteria1 = {default_individual: true}
    criteria2 = {default_individual: false}
  } else if (req.body.account_type === 'team') {
    criteria1 = {default_team: true}
    criteria2 = {default_team: false}
  }

  Plans.update(criteria1, criteria2, (err, updated) => { // remove previous default
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    Plans.update({_id: req.body.plan_id}, criteria1, (err, updated) => { // create new default
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({
        status: 'success',
        description: 'Default plan changed successfully!'
      })
    })
  })
}

exports.migrateCompanies = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'from')) parametersMissing = true
  if (!_.has(req.body, 'to')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CompanyProfile.update({planId: req.body.from.id}, {planId: req.body.to.id}, {multi: true}, (err, updated) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    logger.serverLog(TAG, 'Companies migrated on KiboPush. Going to migrate them from stripe.')
    // migrate subscriptions from stripe
    stripe.subscriptions.list(
      { plan: req.body.from.unique_id },
      (err, subscriptions) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: err
          })
        }
        logger.serverLog(TAG, `Subscriptions found ${subscriptions}`)
        subscriptions.data.forEach((customer, index) => {
          stripe.subscriptions.update(
            customer.id,
            {
              cancel_at_period_end: false,
              items: [{
                id: customer.items.data[0].id,
                plan: req.body.to.unique_id
              }]
            },
            (err2, subscription) => {
              if (err2) {
                return res.status(500).json({
                  status: 'failed',
                  description: err2
                })
              }
              if (index === (subscriptions.data.length - 1)) {
                return res.status(200).json({
                  status: 'success',
                  description: 'Migrated successfuly!'
                })
              }
            }
          )
        })
      }
    )
  })
}

exports.populatePlan = function (req, res) {
  let planData = {
    name: 'Individual Basic Plan',
    unique_ID: 'plan_B',
    amount: 0
  }
  let planB = new Plans(planData)
  planB.save((err) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Failed to insert record1'})
    }
    planData = {
      name: 'Individual Premium Plan',
      unique_ID: 'plan_A',
      amount: 10,
      interval: 'monthly',
      default_individual: true
    }
    let planA = new Plans(planData)
    planA.save((err) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Failed to insert record2'})
      }
      planData = {
        name: 'Team Premium Plan',
        unique_ID: 'plan_C',
        amount: 15,
        interval: 'monthly',
        default_team: true
      }
      let planC = new Plans(planData)
      planC.save((err) => {
        if (err) {
          return res.status(500)
            .json({status: 'failed', description: 'Failed to insert record3'})
        }
        planData = {
          name: 'Team Basic Plan',
          unique_ID: 'plan_D',
          amount: 0
        }
        let planD = new Plans(planData)
        planD.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Failed to insert record4'})
          }
          return res.status(200).json({
            status: 'success',
            description: 'Successfuly populated!'
          })
        })
      })
    })
  })
}
