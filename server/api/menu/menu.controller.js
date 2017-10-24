/**
 * Created by sojharo on 23/10/2017.
 */
const logger = require('../../components/logger')
const TAG = 'api/menu/menu.controller.js'
let Menu = require('./menu.model')
const crypto = require('crypto')

// Get list of menu items
exports.index = function (req, res) {
  Menu.find({userId: req.user._id}, (err, menus) => {
    if (err) {
      logger.serverLog(TAG, `Internal Server Error on fetch ${err}`)
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    return res.status(200).json({
      status: 'success',
      payload: menus
    })
  })
}

exports.createWebLink = function (req, res) {
  // todo save it with facebook by calling api
  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  var uniqueId = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate()
  uniqueId += '' + today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()
  let fext = req.files.file.name.split('.')
  uniqueId += '.' + fext[fext.length - 1]
  const menu = new Menu({
    title: req.body.title,
    pageId: req.body.pageId,
    userId: req.user._id,
    menuId: uniqueId, // same as pageId for parent menu
    menuItemType: req.body.menuItemType,
    menuWebLink: req.body.menuWebLink //url, only when type is 'weblink'
  })

  // save model to MongoDB
  menu.save((err, workflow) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        error: err,
        description: 'Failed to insert record'
      })
    } else {
      res.status(201).json({status: 'Success', payload: workflow})
    }
  })
}
