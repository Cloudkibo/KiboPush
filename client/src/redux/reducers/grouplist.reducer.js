import * as ActionTypes from '../constants/constants';

export function groupListInfo(state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_GROUPLIST:
      return action.data;
    default:
      return state;
  }
}
