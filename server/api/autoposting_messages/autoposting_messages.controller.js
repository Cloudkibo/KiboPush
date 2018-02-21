const AutoPosting = require('./autopostings.model')
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
    AutoPosting.find({companyId: companyUser.companyId}, (err, autoposting) => {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Autoposting query failed'})
      }
      res.status(200).json({
        status: 'success',
        payload: autoposting
      })
    })
  })
}
