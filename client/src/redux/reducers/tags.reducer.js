import * as ActionTypes from '../constants/constants'

export function tagsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_TAGS_LIST:
      return Object.assign({}, state, {
        tags: action.data
      })

    default:
      return state
  }
}
