const utility = require('../utility')

exports.index = function (req, res) {
  utility.callApi(`usage/planGeneric`, 'post', {planId: req.params.id}) // fetch company user
  .then(usage => {
    res.status(200).json({
      status: 'success',
      payload: usage
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch lists ${JSON.stringify(error)}`
    })
  })
}
exports.update = function (req, res) {
  let temp = {}
  temp[req.body.item_name] = req.body.item_value
  let updateQuery = {
    query: {planId: req.body.planId},
    newPayload: { temp }
  }
  utility.callApi(`usage/update`, 'put', updateQuery)
  .then(usage => {
    res.status(200).json({
      status: 'success',
      payload: usage
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch lists ${JSON.stringify(error)}`
    })
  })
}
exports.create = function (req, res) {
  let name = req.body.item_name.toLowerCase().replace(' ', '_')
  let queryPlan = {}
  queryPlan[name] = req.body.item_value
  let queryCompany = {}
  queryCompany[name] = 0
  utility.callApi(`usage/createPlanUsage`, 'post', [{$addFields: queryPlan}, {$out: 'plan_usages'}])
  .then(planUsage => {
    utility.callApi(`usage/createCompanyUsage`, 'post', [{$addFields: queryCompany}, {$out: 'company_usages'}])
    .then(usage => {
      utility.callApi(`updateCompany/`, 'put', {
        query: {companyId: req.body.companyId},
        newPayload: { $inc: { segmentation_lists: 1 } }
      })
      .then(updated => {
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to update subscriber ${JSON.stringify(error)}`
        })
      })
      res.status(200).json({
        status: 'success',
        description: 'Usage item has been added successfully!'
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch lists ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch lists ${JSON.stringify(error)}`
    })
  })
}
