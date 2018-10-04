const utility = require('../utility')
const logicLayer = require('./permissions.logiclayer')

exports.index = function (req, res) {
  utility.callApi(`rolePermissions/`, 'post', {role: req.params.role})
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
  utility.callApi(`rolePermissions/`, 'post', {role: req.body.permissions.role})
  .then(rolePermissions => {
    rolePermissions = logicLayer.prepareUpdatePayload(rolePermissions, req.body.permissions, 'role')
    utility.callApi(`rolePermissions/${rolePermissions._id}`, 'put', rolePermissions)
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
    res.status(500).json({
      status: 'failed',
      description: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}

exports.create = function (req, res) {
  let query = {}
  query = logicLayer.prepareCreateQuery(req.body)
  utility.callApi(`rolePermissions/`, 'post', [{$addFields: query}, {$out: 'role_permissions'}])
  .then(result => {
    utility.callApi(`userPermissions`, 'post', [{$addFields: query}, {$out: 'permissions'}])
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

exports.populateRolePermissions = function (req, res) {
  let buyerPermissions = logicLayer.prepareBuyerPermissions()
  utility.callApi(`rolePermissions`, 'post', buyerPermissions)
  .then(postCreated => {
    let adminPermissions = logicLayer.prepareAdminPermissions()
    utility.callApi(`rolePermissions`, 'post', adminPermissions)
      .then(postCreated => {
        let agentPermissions = logicLayer.prepareAgentPermissions()
        utility.callApi(`rolePermissions`, 'post', agentPermissions)
          .then(postCreated => {
            res.status(200).json({
              status: 'success',
              description: 'Successfuly populated!'
            })
          })
          .catch(error => {
            res.status(500).json({status: 'failed', description: error})
          })
      })
      .catch(error => {
        res.status(500).json({status: 'failed', description: error})
      })
  })
  .catch(error => {
    res.status(500).json({status: 'failed', description: error})
  })
}

exports.updatePermissions = function (req, res) {
  utility.callApi(`userPermissions`, 'post', { companyId: req.body.companyId, userId: req.body.userId })
  .then(permission => {
    permission = logicLayer.setPermissions(permission, req.body)
    utility.callApi(`userPermissions/${permission._id}`, 'put', permission)
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
    utility.callApi(`userPermissions/${companyUser.companyId}`)
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
