// import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
import callApi from '../../utility/api.caller.service'
import { getAccountsUrl } from '../../utility/utils'
export const API_URL = '/api'

export function uploadFile (filedata, fileInfo, handleFunction, setLoading) {
  return (dispatch) => {
    fetch(`${getAccountsUrl()}/uploadFile`, {
      method: 'post',
      body: filedata,
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      if (res.status === 'success') {
        fileInfo.fileurl = res.payload
        console.log('fileInfo: ', fileInfo)
        if (setLoading) {
          setLoading()
        }
        if (handleFunction) {
          handleFunction(fileInfo)
        }
      } else {
        console.log(res.description)
      }
    })
  }
}

export function deleteFile (serverPath, handleResponse) {
  return (dispatch) => {
    fetch(`${getAccountsUrl()}/deleteFile/${serverPath}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => {
        console.log('deleteFile response', res)
        if (handleResponse) {
          handleResponse(res)
        }
      }
    )
  }
}

export function downloadYouTubeVideo (url, id, handleFunction, handleError) {
  return (dispatch) => {
    let data = {
      id,
      url
    }
    console.log('downloadYouTubeVideo data', data)
    // eslint-disable-next-line no-undef
    fetch(`${getAccountsUrl()}/downloadYouTubeVideo`, {
      method: 'post',
      body: JSON.stringify(data),
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`,
        'Content-Type': 'application/json'
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      if (res.status === 'success') {
        console.log('YouTube video payload', res.payload)
        handleFunction(res.payload)
      } else {
        if (handleError) {
          handleError(res)
        }
      }
    })
  }
}

export function urlMetaData (url, handleFunction, handleError) {
  return (dispatch) => {
    let data = {
      url
    }
    console.log('urlMetaData data', data)
    callApi('broadcasts/urlMetaData', 'post', data)
      .then(res => {
        console.log('response from urlMetaData', res)
        if (res.status === 'success') {
          if (handleFunction) {
            handleFunction(res.payload)
          }
        } else {
          if (handleError) {
            handleError(res)
          }
        }
      })
  }
}

export function uploadImage (file, pages, componentType, data, handleUpload, setLoading) {
  // eslint-disable-next-line no-undef
  var fileData = new FormData()
  fileData.append('file', file)
  fileData.append('filename', file.name)
  fileData.append('filetype', file.type)
  fileData.append('filesize', file.size)
  fileData.append('pages', JSON.stringify(pages))
  fileData.append('componentType', componentType)
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    fetch(`${getAccountsUrl()}/uploadFile`, {
      method: 'post',
      body: fileData,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      if (res.status === 'success') {
        data.fileurl = res.payload
        data.image_url = res.payload.url
        console.log('fileInfo: ', data)
        if (setLoading) {
          setLoading()
        }
        console.log('handling upload')
        if (handleUpload) {
          handleUpload(data)
        }
      } else {
        console.log(res.description)
      }
    })
  }
}
export function uploadTemplate (dataTosend, data, handleUpload, setLoading, handleError) {
  console.log('data in uploadTemplate', dataTosend)
  return (dispatch) => {
    callApi('uploadTemplate', 'post', dataTosend, 'accounts')
      .then(res => {
        console.log('response from uploadTemplate', res)
          if (setLoading) {
            setLoading()
          }
          if (res.status === 'success') {
          data.fileurl = res.payload
          if (dataTosend.componentType === 'image') {
            data.image_url = res.payload.url
          }
          console.log('fileInfo: ', data)
          if (handleUpload) {
            handleUpload(data)
          } 
        } else {
          if (handleError) {
            handleError(res)
          }
        }
      })
  }
}
