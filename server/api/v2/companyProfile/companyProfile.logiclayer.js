exports.createUniqueId = function () {
  let today = new Date()
  let uid = Math.random().toString(36).substring(7)
  let uniqueId = 'k' + uid + '' + today.getFullYear() +
        '' + (today.getMonth() + 1) + '' + today.getDate() + '' +
        today.getHours() + '' + today.getMinutes() + '' +
        today.getSeconds()
  return uniqueId
}
