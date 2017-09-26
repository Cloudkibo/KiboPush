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

export function uploadImage (file, data, handleUpload) {
    var fileData = new FormData()
    fileData.append('file', file)
    fileData.append('filename', file.name)
    fileData.append('filetype', file.type)
    fileData.append('filesize', file.size)
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/broadcasts/upload`, {
      method: 'post',
      body: fileData,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
       data.fileurl = 'https://app.kibopush.com/api/broadcasts/download/' + res.payload
       handleUpload(data)
    })
  }
}
