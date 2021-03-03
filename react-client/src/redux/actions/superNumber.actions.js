import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function fetchTemplates (body) {
  return (dispatch) => {
    callApi('supernumber/fetchTemplates', 'post', body).then(res => {
      console.log('response from fetchTemplates', res)
      if (res.status === 'success') {
        dispatch({
          type: ActionTypes.SHOW_COMMERCE_TEMPLATES,
          data: res.payload
        })
      }
    })
  }
}
