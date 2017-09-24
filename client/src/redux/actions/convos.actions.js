import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function uploadFile (filedata) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    callApi('broadcasts/upload', 'post', filedata)
      .then(res => dispatch(addFileUrl(res.payload)))
  }
}

export function addFileUrl (fileUrl) {
  return {
    type: ActionTypes.ADD_FILE_URL,
    fileUrl
  }
}
