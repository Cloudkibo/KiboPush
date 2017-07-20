import * as ActionTypes from '../constants/constants';

export function archiveListInfo(state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_ARCHIVELIST:
      return action.data;
    default:
      return state;
  }
}
