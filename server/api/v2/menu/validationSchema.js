/*
This file will contain the validation schemas.
By separating it from controller, we are cleaning the code.
Now the middleware will automatically send error response if the payload fails
*/

exports.menuPayload = {
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
    jsonStructure: {
      type: 'object',
      required: true
    }
  }
}
