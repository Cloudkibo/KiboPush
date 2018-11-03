'use strict'

const _ = require('lodash')
const Companyprofile = require('./companyprofile.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Invitations = require('./../invitations/invitations.model')
const Permissions = require('./../permissions/permissions.model')
const Users = require('./../user/Users.model')
const Plans = require('./../plans/plans.model')
const Inviteagenttoken = require('./../inviteagenttoken/inviteagenttoken.model')
const config = require('./../../../config/environment/index')
const logger = require('../../../components/logger')
const TAG = 'api/companyprofile/companyprofile.controller.js'
const callApi = require('./../../v2/utility/index')

exports.index = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }
      Companyprofile.findOne({_id: companyUser.companyId},
        function (err, company) {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          res.status(200).json({status: 'success', payload: company})
        })
    })
}

exports.addPlanID = function (req, res) {
  Companyprofile.find({}, (err, companies) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    companies.forEach((company, index) => {
      Plans.findOne({unique_ID: company.stripe.plan}, (err, plan) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        company.planId = plan._id
        company.save((err) => {
          if (err) {
            return res.status(500)
              .json({status: 'failed', description: 'Internal Server Error'})
          }
        })
      })
      if (index === (companies.length - 1)) {
        return res.status(200).json({
          status: 'success',
          description: 'Successfuly added!'
        })
      }
    })
  })
}

exports.setCard = function (req, res) {
  var stripeToken = req.body.stripeToken

  if (!stripeToken) {
    return res.status(500).json({
      status: 'failed',
      description: `Please provide a valid card.`
    })
  }

  Companyprofile.findOne({_id: req.body.companyId}, (err, company) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!company) {
      return res.status(404)
        .json({status: 'failed', description: 'Company not found'})
    }

    company.setCard(stripeToken, function (err) {
      if (err) {
        if (err.code && err.code === 'card_declined') {
          return res.status(500).json({
            status: 'failed',
            description: 'Your card was declined. Please provide a valid card.'
          })
        }
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      return res.status(200).json({
        status: 'success',
        description: 'Card has been attached successfuly!'
      })
    })
  })
}

exports.updatePlan = function (req, res) {
  var plan = req.body.plan
  var stripeToken = null

  if (req.user.plan.unique_ID === plan) {
    return res.status(500).json({
      status: 'failed',
      description: `The selected plan is the same as the current plan.`
    })
  }
  if (req.body.stripeToken) {
    stripeToken = req.body.stripeToken
  }

  if (!req.user.last4 && !req.body.stripeToken) {
    return res.status(500).json({
      status: 'failed',
      description: `Please add a card to your account before choosing a plan.`
    })
  }
  Plans.findOne({unique_ID: req.body.plan}, (err, plan) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    Companyprofile.update({_id: req.body.companyId}, {planId: plan._id, 'stripe.plan': req.body.plan}, (err2, updated) => {
      if (err2) {
        logger.serverLog(TAG, err2)
      }
      console.log('updated', updated)
    })
  })
  Companyprofile.findOne({_id: req.body.companyId}, (err, company) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!company) {
      return res.status(404)
        .json({status: 'failed', description: 'Company not found'})
    }
    company.setPlan(plan, stripeToken, function (err) {
      if (err) {
        if (err.code && err.code === 'card_declined') {
          return res.status(500).json({
            status: 'failed',
            description: 'Your card was declined. Please provide a valid card.'
          })
        }
        return res.status(500).json({
          status: 'failed',
          description: 'internal server error' + JSON.stringify(err)
        })
      }
      return res.status(200).json({
        status: 'success',
        description: 'Plan has been updated successfuly!'
      })
    })
  })
}

exports.invite = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'email')) parametersMissing = true
  if (!_.has(req.body, 'name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  callApi.callApi('/companyprofile/invite', 'post', {email: req.body.email, name: req.body.name}, req.headers.authorization)
  .then((result) => {
    res.status(200).json(result)
  })
  .catch((err) => {
    res.status(500).json(err)
  })
}

exports.updateRole = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'domain_email')) parametersMissing = true
  if (!_.has(req.body, 'role')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  if (config.userRoles.indexOf(req.user.role) > 1) {
    return res.status(401).json(
      {status: 'failed', description: 'Unauthorised to perform this action.'})
  }

  if (config.userRoles.indexOf(req.body.role) < 0) {
    return res.status(404)
      .json({status: 'failed', description: 'Invalid role.'})
  }

  CompanyUsers.findOne({domain_email: req.body.domain_email},
    (err, userCompany) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      userCompany.role = req.body.role
      userCompany.save((err, savedUserCompany) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        Users.findOne({domain_email: req.body.domain_email}, (err, user) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          user.role = req.body.role
          user.save((err, savedUser) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            Permissions.update(
              {userId: user._id},
              config.permissions[req.body.role],
              {multi: true}, (err, updated) => {
                if (err) {
                  logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                }
                return res.status(200)
                .json({status: 'success', payload: {savedUser, savedUserCompany}})
              })
          })
        })
      })
    })
}

exports.removeMember = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'domain_email')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  if (config.userRoles.indexOf(req.user.role) > 1) {
    return res.status(401).json(
      {status: 'failed', description: 'Unauthorised to perform this action.'})
  }

  CompanyUsers.remove({domain_email: req.body.domain_email}, (err) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    Users.remove({domain_email: req.body.domain_email}, (err) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(200)
        .json({status: 'success', description: 'Account removed.'})
    })
  })
}

exports.members = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }
      CompanyUsers.find({companyId: companyUser.companyId})
        .populate('userId')
        .exec((err, members) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          res.status(200).json({status: 'success', payload: members})
        })
    })
}

exports.updateAutomatedOptions = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }

      Companyprofile.findOne({_id: companyUser.companyId}, (err, profile) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }

        profile.automated_options = req.body.automated_options
        profile.save((err, updatedProfile) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          } else {
            return res.status(200).json({status: 'success', payload: updatedProfile})
          }
        })
      })
    })
}

exports.getAutomatedOptions = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account does not belong to any company. Please contact support'
        })
      }
      Companyprofile.findOne({_id: companyUser.companyId},
        function (err, company) {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          res.status(200).json({status: 'success', payload: company})
        })
    })
}

exports.getKeys = function (req, res) {
  if (config.env === 'production') {
    res.status(200).json({status: 'success', captchaKey: '6Lf9kV4UAAAAALTke6FGn_KTXZdWPDorAQEKQbER', stripeKey: config.stripeOptions.stripePubKey})
  } else if (config.env === 'staging') {
    res.status(200).json({status: 'success', captchaKey: '6LdWsF0UAAAAAK4UFpMYmabq7HwQ6XV-lyWd7Li6', stripeKey: config.stripeOptions.stripePubKey})
  } else if (config.env === 'development') {
    res.status(200).json({status: 'success', captchaKey: '6LckQ14UAAAAAFH2D15YXxH9o9EQvYP3fRsL2YOU', stripeKey: config.stripeOptions.stripePubKey})
  }
}
