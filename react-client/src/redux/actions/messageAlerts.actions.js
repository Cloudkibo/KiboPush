import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchMessageAlerts(platform, callback) {
  return (dispatch) => {
    callApi('messageAlerts', 'post', {platform})
      .then(res => {
        callback(res)
      })
  }
}
