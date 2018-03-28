import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function createTeam (data) {
  return (dispatch) => {
    callApi('teams/create', 'post', data)
      .then(res => {
        console.log('response from server', res)
      })
  }
}
