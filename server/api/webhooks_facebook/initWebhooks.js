let registery = []
exports.getRegistry = () => {
  return registery
}
exports.registerCallback = (schema, cb) => {
  const entry = Object.freeze({schema: Object.freeze(schema), callback: cb})
  registery.push(entry)
}

exports.freezeRegistry = () => {
  Object.freeze(registery)
}
