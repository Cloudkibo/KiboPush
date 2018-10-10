const utility = require('../utility')
const logicLayer = require('./permissions.logiclayer')

exports.updatePermissions = function (req, res) {
  utility.callApi(`permissions/query`, 'post', { companyId: req.body.companyId, userId: req.body.userId })
  .then(permission => {
    permission = logicLayer.setPermissions(req.body)
    utility.callApi(`permissions/${permission._id}`, 'put', permission)
    .then(result => {
      res.status(201).json({status: 'success', payload: result})
    })
    .catch(error => {
      res.status(500).json({
        status: 'failed',
        description: error
      })
    })
  })
  .catch(error => {
    res.status(500).json({status: 'failed', description: error})
  })
}

exports.fetchPermissions = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`)
  .then(companyUser => {
    utility.callApi(`permissions/query`, 'post', {companyId: companyUser.companyId})
    .then(permissions => {
      res.status(200).json({
        status: 'success',
        description: permissions
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
