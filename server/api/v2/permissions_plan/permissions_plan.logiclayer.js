exports.prepareUpdatePayload = function (dbPayload, clientPayload, exceptProperty) {
  for (let property in clientPayload) {
    if (property !== exceptProperty) {
      dbPayload[property] = clientPayload[property]
    }
  }
  return dbPayload
}

exports.prepareCreateQuery = function (body) {
  let feature = body.name.replace(' ', '_')
  let query = {}
  query[feature] = false
  return query
}
