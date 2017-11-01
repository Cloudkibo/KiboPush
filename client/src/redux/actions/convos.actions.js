// import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
export const API_URL = '/api'

export function uploadFile (filedata, fileInfo, handleFunction, setLoading) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/broadcasts/upload`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      fileInfo.fileurl = res.payload
      setLoading()
      handleFunction(fileInfo)
    })
  }
}

export function uploadImage (file, data, handleUpload) {
  // eslint-disable-next-line no-undef
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
      console.log('res', res)
      data.fileurl = res.payload
      handleUpload(data)
    })
  }
}
