exports.update = {
  type: 'object',
  properties: {
    features: {
      type: 'object',
      required: true
    }
  }
}
exports.create = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    }
  }
}
