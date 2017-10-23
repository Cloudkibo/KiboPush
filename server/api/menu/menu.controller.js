/**
 * Created by sojharo on 23/10/2017.
 */
const logger = require('../../components/logger')
const TAG = 'api/menu/menu.controller.js'
let Menu = require('./menu.model')

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

exports.addWebLinkMenuItem = function (req, res) {

}
