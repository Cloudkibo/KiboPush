const utility = require('../utility')
const logicLayer = require('./permissions_plan.logiclayer')

exports.index = function (req, res) {
  utility.callApi(`features/${req.params.id}`)
  .then(features => {
    res.status(200).json({
      status: 'success',
      payload: features
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
  utility.callApi(`features/`, 'post', {plan_id: req.body.features.plan_id})
  .then(features => {
    features = logicLayer.prepareUpdatePayload(features, req.body.permissions, 'role')
    utility.callApi(`features/${features._id}`, 'put', features)
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
  utility.callApi(`features/`, 'post', [{$addFields: query}, {$out: 'permissions_plans'}])
  .then(result => {
    res.status(200).json({
      status: 'success',
      description: 'Feature has been added successfully!'
    })
  })
  .catch(error => {
    res.status(500).json({
      status: 'failed',
      description: `Internal Server Error ${JSON.stringify(error)}`
    })
  })
}
