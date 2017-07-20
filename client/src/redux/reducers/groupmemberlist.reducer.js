import * as ActionTypes from '../constants/constants';

export function groupMemberListInfo(state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_GROUPMEMBER_LIST:
      return [...state, action.data];
    case ActionTypes.REFRESH_GROUPS:
      return [];
    default:
      return state;
  }
}
