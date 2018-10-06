const utility = require('../utility')
const logicLayer = require('./permissions.logiclayer')

exports.index = function (req, res) {
  utility.callApi(`permission/${req.params.role}`)
  .then(permissions => {
    res.status(200).json({
      status: 'success',
      payload: permissions
    })
  })
    .catch(error => {
      res.status(500).json({
        status: 'failed',
        payload: `Internal Server Error ${JSON.stringify(error)}${JSON.stringify(error)}`
      })
    })
}

exports.update = function (req, res) {
  utility.callApi(`permission/update`, 'post', {permissions: req.body.permissions, role: req.body.permissions.role})
  .then(result => {
    res.status(201).json({status: 'success', payload: result})
  })
  .catch(error => {
    res.status(500).json({
      status: 'failed',
      description: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}

exports.create = function (req, res) {
  let query = {}
  query = logicLayer.prepareCreateQuery(req.body)
  utility.callApi(`permission/roleAggregate`, 'post', [{$addFields: query}, {$out: 'role_permissions'}])
  .then(result => {
    utility.callApi(`permission/aggregate`, 'post', [{$addFields: query}, {$out: 'permissions'}])
    .then(result => {
      res.status(200).json({
        status: 'success',
        description: 'Permission has been added successfully!'
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

exports.updatePermissions = function (req, res) {
  utility.callApi(`permission/genericFind`, 'post', { companyId: req.body.companyId, userId: req.body.userId })
  .then(permission => {
    permission = logicLayer.setPermissions(permission, req.body)
    utility.callApi(`permission/updatePermissions`, 'post', {query: { companyId: req.body.companyId, userId: req.body.userId }, updated: permission})
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
    utility.callApi(`permission/generic/${companyUser.companyId}`)
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
