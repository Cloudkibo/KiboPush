'use strict'

let _ = require('lodash')
let Passwordresettoken = require('./passwordresettoken.model')
let User = require('./../user/Users.model')

// Get list of passwordresettokens
exports.change = function (req, res) {
  let userId = req.user._id
  let oldPass = String(req.body.password)
  let newPass = String(req.body.newpassword)

  User.findById(userId, function (err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass
      user.save(function (err) {
        if (err) return validationError(res, err)
        res.status(200).json({status: 'success', description: 'Password changed successfully.'})
      })
    } else {
      res.status(403).json({status: 'failed', description: 'Wrong current password.'})
    }
  })
}
