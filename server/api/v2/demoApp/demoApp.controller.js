const utility = require('../utility')
const LogicLayer = require('./demoApp.logiclayer')

exports.uploadCustomerInfo = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization)
    .then(companyUser => {
      utility.callApi(`companyprofile/query`, 'post', {_id: companyUser.companyId}, req.headers.authorization)
        .then(company => {
          let dataToSend = LogicLayer.prepareData(company, req.body)
          utility.callApi('customers', 'post', dataToSend, '', 'demoApp')
            .then(saved => {
              return res.status(200).json({status: 'success', payload: 'File uploaded successfully'})
            })
            .catch(err => {
              return res.status(500).json({status: 'failed', payload: `Failed to save data ${JSON.stringify(err)}`})
            })
        })
        .catch(err => {
          return res.status(500).json({status: 'failed', payload: `Failed to fetch company profile ${JSON.stringify(err)}`})
        })
    })
    .catch(err => {
      return res.status(500).json({status: 'failed', payload: `Failed to fetch company user ${JSON.stringify(err)}`})
    })
}
