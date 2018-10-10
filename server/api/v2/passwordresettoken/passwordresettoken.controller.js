const utility = require('../utility')

exports.change = function (req, res) {
  utility.callApi(`reset_password/change`, 'post', {
    old_password: req.body.old_password, new_password: req.body.new_password
  })
  .then(changed => {
    res.status(200).json(
      {status: 'success', description: 'Password changed successfully.'})
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to change password ${JSON.stringify(error)}`
    })
  })
}

exports.forgot = function (req, res) {
  utility.callApi(`reset_password/forgot`, 'post', {email: req.body.email})
  .then(forgot => {
    res.status(200).json({
      status: 'success',
      description: 'Password Reset Link has been sent to your email address. Check your spam or junk folder if you have not received our email.'
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to send email ${JSON.stringify(error)}`
    })
  })
}

exports.reset = function (req, res) {
  utility.callApi(`reset_password/reset`, 'post', {token: req.body.token, new_password: req.body.new_password})
  .then(reset => {
    res.status(200).json({
      status: 'success',
      description: 'Password successfully changed. Please login with your new password.'
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to reset password ${JSON.stringify(error)}`
    })
  })
}
exports.verify = function (req, res) {
  utility.callApi(`reset_password/verify/${req.params.id}`)
  .then(result => {
    return res.sendFile(result)
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to verify password ${JSON.stringify(error)}`
    })
  })
}
