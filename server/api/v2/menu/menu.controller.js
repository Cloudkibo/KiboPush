const logger = require('../../../components/logger')
const needle = require('needle')
const TAG = 'api/menu/menu.controller.js'
const utility = require('../utility')

exports.index = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization)
  .then(companyUser => {
    utility.callApi(`menu/query`, 'post', {companyId: companyUser.companyId}, req.headers.authorization)
    .then(menus => {
      res.status(200).json({
        status: 'success',
        payload: menus
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch menu ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}

exports.indexByPage = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization)
  .then(companyUser => {
    utility.callApi(`menu/query`, 'post', {
      pageId: req.body.pageId,
      companyId: companyUser.companyId
    }, req.headers.authorization)
    .then(menu => {
      return res.status(200).json({
        status: 'success',
        payload: menu
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch menu by page ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}

exports.create = function (req, res) {
  utility.callApi(`companyUser/query`, 'post', {domain_email: req.user.domain_email}, req.headers.authorization)
  .then(companyUser => {
    utility.callApi(`pages/query`, 'post', {
      pageId: req.body.pageId,
      companyId: companyUser.companyId
    }, req.headers.authorization)
    .then(page => {
      utility.callApi(`menu/query`, 'post', {
        pageId: req.body.pageId,
        companyId: companyUser.companyId
      }, req.headers.authorization)
      .then(info => {
        if (!info) {
          utility.callApi(`menu`, 'post', {
            pageId: req.body.pageId,
            userId: req.body.userId,
            companyId: companyUser.companyId,
            jsonStructure: req.body.jsonStructure
          }, req.headers.authorization)
          .then(savedMenu => {
            require('./../../../config/socketio').sendMessageToClient({
              room_id: companyUser.companyId,
              body: {
                action: 'menu_updated',
                payload: {
                  page_id: req.body.pageId,
                  user_id: req.user._id,
                  user_name: req.user.name,
                  payload: savedMenu
                }
              }
            })
            const requestUrl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${page.accessToken}`

            needle.request('post', requestUrl, req.body.payload, {json: true},
              (err, resp) => {
                if (err) {
                  logger.serverLog(TAG,
                    `Internal Server Error ${JSON.stringify(err)}`)
                }
                if (JSON.stringify(resp.body.error)) {
                  return res.status(404).json({
                    status: 'error',
                    description: JSON.stringify(resp.body.error)
                  })
                } else {
                  res.status(201).json({status: 'success', payload: savedMenu})
                }
              })
          })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to save menu ${JSON.stringify(error)}`
          })
        })
        } else {
          utility.callApi(`menu/${info._id}`, 'put', {jsonStructure: req.body.jsonStructure}, req.headers.authorization)
          .then(updated => {
            const requestUrl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${page.accessToken}`

            require('./../../../config/socketio').sendMessageToClient({
              room_id: companyUser.companyId,
              body: {
                action: 'menu_updated',
                payload: {
                  page_id: req.body.pageId,
                  user_id: req.user._id,
                  user_name: req.user.name,
                  payload: updated
                }
              }
            })

            needle.request('post', requestUrl, req.body.payload, {json: true},
              (err, resp) => {
                if (err) {
                  logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
                }
                if (JSON.stringify(resp.body.error)) {
                  return res.status(404).json({
                    status: 'error',
                    description: JSON.stringify(resp.body.error)
                  })
                } else {
                  utility.callApi(`menu/query`, 'post', {
                    pageId: req.body.pageId,
                    companyId: companyUser.companyId
                  }, req.headers.authorization)
                  .then(updatedMenu => {
                    res.status(201).json({status: 'success', payload: updatedMenu})
                  })
                    .catch(error => {
                      return res.status(500).json({
                        status: 'failed',
                        payload: `Failed to save menu ${JSON.stringify(error)}`
                      })
                    })
                }
              })
          })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to update menu ${JSON.stringify(error)}`
          })
        })
        }
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to update menu ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to update menu ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}
