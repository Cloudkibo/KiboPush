import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

export function uploadFile (filedata) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/broadcasts/upload`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(addFileUrl(res.payload)))
  }
}

export function handleFile (fileInfo) {
  return {
    type: ActionTypes.ADD_FILE_INFO,
    fileInfo
  }
}

export function addFileUrl (fileUrl) {
  console.log(fileUrl)
  return {
    type: ActionTypes.ADD_FILE_URL,
    fileUrl
  }
}

export function uploadImage (data) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/broadcasts/upload`, {
      method: 'post',
      body: data,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => 
       console.log("Image Upload Response", res.payload)
      // dispatch(addFileUrl(res.payload))
    
    )
  }
}
