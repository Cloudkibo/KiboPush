exports.storeInfoSchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      required: true
    },
    pageId: {
      type: 'string',
      required: true
    },
    shopUrl: {
      type: 'string',
      required: true
    },
    shopToken: {
      type: 'string',
      required: true
    }
  }
}
