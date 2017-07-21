import * as ActionTypes from '../constants/constants';

export function setBrowserName(data) {
  return {
    type: ActionTypes.LOAD_BROWSER_NAME,
    data
  };
}

export function setBrowserVersion(data) {
  return {
    type: ActionTypes.LOAD_BROWSER_VERSION,
    data
  };
}

