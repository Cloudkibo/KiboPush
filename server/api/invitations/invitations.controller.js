/**
 * Created by sojharo on 28/12/2017.
 */
const Invitations = require('./invitations.model')
const inviteagenttoken = require('./../inviteagenttoken/inviteagenttoken.model')
const CompanyUsers = require('./../companyuser/companyuser.model')

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
      Invitations.find({companyId: companyUser.companyId}, (err, invitations) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        res.status(200).json({
          status: 'success',
          payload: invitations
        })
      })
    })
}

exports.cancel = function (req, res) {
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
      Invitations.remove({email: req.body.email, companyId: companyUser.companyId}, (err) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        inviteagenttoken.remove({email: req.body.email, companyId: companyUser.companyId}, (err) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          res.status(200).json({
            status: 'success',
            description: 'Invitation has been cancelled.'
          })
        })
      })
    })
}
