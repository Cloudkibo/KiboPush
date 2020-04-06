/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RingLoader } from 'halogenium'
import { uploadImage, uploadFile, uploadTemplate } from '../../redux/actions/convos.actions'
import { deleteFile } from '../../utility/utils'

class Media extends React.Component {
  constructor (props, context) {
    super(props, context)
    this._onChange = this._onChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.updateImageUrl = this.updateImageUrl.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.updateFile = this.updateFile.bind(this)
    this.updateFileUrl = this.updateFileUrl.bind(this)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.state = {
      errorMsg: '',
      imgSrc: props.img ? props.img : '',
      button: props.buttons ? props.buttons : [],
      fileurl: props.fileurl ? props.fileurl : '',
      fileName: props.fileName ? props.fileName : '',
      type: props.type ? props.type : '',
      size: props.size ? props.size : '',
      image_url: props.image_url ? props.image_url : '',
      loading: false,
      showPreview: false,
      initialFile: props.initialFile,
      file: props.file ? props.file : '',
      previewUrl: '',
      mediaType: this.props.mediaType ? this.props.mediaType : '',
      styling: {minHeight: 30, maxWidth: 400}
    }
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }
  onFilesError (error, file) {
    console.log('error.message', error.message)
    //this.setState({errorMsg: error.message})
    this.props.onFilesError(error.message)
  }

  _onChange () {
    if (this.state.fileurl && this.state.fileurl.id) {
      let canBeDeleted = true
      for (let i = 0; i < this.props.initialFiles.length; i++) {
        if (this.state.fileurl.id === this.props.initialFiles[i]) {
          canBeDeleted = false
          break
        }
      }
      if (this.state.file.id === this.props.initialFile) {
        canBeDeleted = false
      }
      if (canBeDeleted) {
        this.props.setTempFiles(null, [this.state.fileurl.id])
        deleteFile(this.state.fileurl.id)
      }
    }
    this.props.updateImage('')
    var file = this.refs.file.files[0]
    var video = file.type.match('video.*')
    var image = file.type.match('image.*')
    if (file.size > 10000000) {
      var error = {
        message: 'FILE SIZE CANNOT EXCEED 10MB'
      }
      this.onFilesError(error, true)
      return
    }
    if (!video && !image) {
      this.props.handleMedia({error: 'invalid file'})
      return
    }
    this.props.updateStatus({disabled: true})
    if (file && image) {
      this.setState({
        mediaType: 'image'
      })
      if (file.type && file.type && file.type !== 'image/bmp' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        if (this.props.handleMedia) {
          this.props.handleMedia({error: 'invalid image'})
        }
        return
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = function (e) {
        // this.props.handleCard({id: this.props.id, title: this.state.title, subtitle: this.state.subtitle, imgSrc: [reader.result]})
        this.setState({
          imgSrc: [reader.result]
        }, () => {
          this.props.updateImage(this.state.imgSrc)
        })
      }.bind(this)
      this.setState({loading: true})
      this.props.uploadImage(file, this.props.pages, 'image', {fileurl: '',
        fileName: file.name,
        type: file.type,
        image_url: '',
        size: file.size}, this.updateImageUrl)
    }
    if (file && video) {
      this.setState({file: file, mediaType: 'video'})
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('pages', JSON.stringify(this.props.pages))
      fileData.append('componentType', 'video')
      var fileInfo = {
        id: this.props.id,
        componentType: 'video',
        fileName: file.name,
        type: file.type,
        size: file.size
      }
      this.setState({loading: true, showPreview: false})
      this.props.uploadFile(fileData, fileInfo, this.updateFile)
    }
  }

  addButton (obj) {
    var temp = this.state.button
    temp.push(obj)
    this.setState({button: temp})
    this.props.handleMedia({id: this.props.id,
      componentType: 'media',
      mediaType: this.state.mediaType,
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      buttons: this.state.button})
  }

  editButton (obj) {
    var temp = this.state.button.map((elm, index) => {
      if (index === obj.id) {
        elm = obj.button
      }
      return elm
    })
    this.setState({button: temp})
    this.props.handleMedia({id: this.props.id,
      componentType: 'media',
      mediaType: this.state.mediaType,
      fileurl: this.state.fileurl,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      buttons: this.state.button})
  }
  removeButton (obj) {
    for(let a=0; a<this.state.button.length; a++) {
      if (a === obj.id) {
        this.state.button.splice(a, 1)
      }
    }
    if (obj.button && obj.button.type === 'postback') {
      var deletePayload = obj.button.payload
    }
    var temp = this.state.button
    this.setState({button: temp})
    this.props.handleMedia({id: this.props.id,
      componentType: 'media',
      fileurl: this.state.fileurl,
      mediaType: this.state.mediaType,
      image_url: this.state.image_url,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      buttons: this.state.button,
      deletePayload: deletePayload})
  }

  setLoading () {
    this.setState({loading: false})
  }
  updateImageUrl (data) {
    var image = data.type.match('image.*')
    if (image) {
      console.log('image uploading template', data)
      if (this.props.pages) {
        this.props.uploadTemplate({pages: this.props.pages,
          url: data.fileurl.url,
          componentType: 'image',
          id: data.fileurl.id,
          name: data.fileurl.name
        }, { fileurl: '',
          fileName: data.fileurl.name,
          type: data.type,
          image_url: '',
          size: data.size
        }, (newData) => this.updateFileUrl(data, newData), this.setLoading)
      } else {
        this.updateFileUrl(data, null)
        this.setLoading()
      }
    }
  }

  updateFile (data) {
    console.log('updating file AddMedia', data)
    //this.props.updateFile(data)
    var video = data.type.match('video.*')
    if (video) {
      console.log('video uploading template', data)
      if (this.props.pages) {
        this.props.uploadTemplate({pages: this.props.pages,
          url: data.fileurl.url,
          componentType: 'video',
          id: data.fileurl.id,
          name: data.fileurl.name
        }, { id: this.props.id,
          componentType: 'video',
          fileName: data.fileurl.name,
          type: data.fileurl.type,
          size: data.fileurl.size
        }, (newData) => this.updateFileUrl(data, newData), this.setLoading)
      } else {
        this.updateFileUrl(data, null)
        this.setLoading()
      }
    }
  }

  updateFileUrl (data, newData) {
    if (newData) {
      data.fileurl = newData.fileurl
    }
    console.log('updating fileurl of Media', data)
    this.setState({
      fileurl: data.fileurl,
      fileName: data.fileName,
      image_url: data.image_url ? data.image_url : '',
      type: data.type,
      size: data.size })
    this.props.updateFile(data)
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
        <div style={{marginBottom: '-0.5px', paddingTop: '0px', borderColor: this.props.required && !this.state.fileurl ? 'red' : ''}} className='ui-block hoverbordersolid'>
          {
          this.state.loading
          ? <div className='align-center' style={{padding: '50px'}}><center><RingLoader color='#FF5E3A' /></center></div>
          : <div style={{display: 'flex', minHeight: 170, backgroundColor: '#F2F3F8'}} className='mediaImage' onClick={() => {
            this.refs.file.click()
          }}>

            <input
              ref='file'
              type='file'
              name='user[image]'
              accept='image/*, video/*'
              title=' '
              maxFileSize={this.props.module && this.props.module === 'whatsapp' ? 5000000 : 10000000}
              minFileSize={0}
              clickable
              onClick={(e)=>{e.target.value= ''}}
              onChange={this._onChange} onError={this.onFilesError} style={{position: 'absolute', cursor: 'pointer', display: 'none'}} />
            <div style={{width: '100%'}}>
              {
                (this.state.fileName === '') &&
                <div className='align-center' style={{marginTop: '50px'}}>
                  <img style={{maxHeight: 40, margin: 'auto'}} src='https://cdn.cloudkibo.com/public/icons/media.png' alt='Text' />
                  <h4 style={{pointerEvents: 'none', zIndex: -1}}> Media </h4>
                </div>
              }
              {
                (this.state.fileurl && this.state.fileurl !== '') &&
                  <div className='align-center'>
                    { this.state.mediaType === 'image' &&
                    <img style={{maxWidth: 300, margin: -25, padding: 25}} src={this.state.fileurl.url} alt='' />
                  }
                    { this.state.mediaType === 'video' &&
                    <div style={{marginTop: '50px'}}>
                      <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Text' style={{maxHeight: 40}} />
                      <h4 style={{wordBreak: 'break-word'}}>{this.state.fileName !== '' ? this.state.fileName : 'Video'}</h4>
                    </div>
                  }
                  </div>
              }
            </div>
          </div>
          }
        </div>
        <div style={{color: 'red'}}>{this.props.required && !this.state.fileurl ? '*Required' : ''}</div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadImage,
    uploadFile,
    uploadTemplate
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Media)
