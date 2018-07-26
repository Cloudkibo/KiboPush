function prepareUpdatePayload (dbPayload, clientPayload, exceptProperty) {
  for (let property in clientPayload) {
    if (property !== exceptProperty) {
      dbPayload[property] = clientPayload[property]
    }
  }
  return dbPayload
}

exports.prepareUpdatePayload = prepareUpdatePayload
