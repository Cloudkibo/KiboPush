/**
 * Created by sojharo on 01/08/2017.
 */

const PageSurveys = require('./page_survey.model')
const CompanyUsers = require('./../companyuser/companyuser.model')

exports.index = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
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
    PageSurveys.find({ companyId: companyUser.companyId }, (err, surveys) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      res.status(200).json({ status: 'success', payload: surveys })
    })
  })
}

exports.show = function (req, res) {
  PageSurveys.find({ pollId: req.params.id }, (err, surveys) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({ status: 'success', payload: surveys })
  })
}
