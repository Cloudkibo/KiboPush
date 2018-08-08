/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'
import EditButton from './EditButton'
import Halogen from 'halogen'
import { uploadImage, uploadFile } from '../../redux/actions/convos.actions'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import ReactPlayer from 'react-player'

class Media extends React.Component {
  constructor (props, context) {
    super(props, context)
    this._onChange = this._onChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.removeButton = this.removeButton.bind(this)
    this.updateImageUrl = this.updateImageUrl.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.updateMediaDetails = this.updateMediaDetails.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.updateFileUrl = this.updateFileUrl.bind(this)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.state = {
      errorMsg: '',
      showErrorDialogue: false,
      imgSrc: '',
      button: props.buttons ? props.buttons : [],
      fileurl: '',
      fileName: '',
      type: '',
      size: '',
      loading: false,
      showPreview: false,
      file: '',
      previewUrl: '',
      mediaType: ''
    }
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }
  showDialog (page) {
    this.setState({showErrorDialogue: true})
  }

  closeDialog () {
    this.setState({showErrorDialogue: false})
  }
  componentDidMount () {
    this.updateMediaDetails(this.props)
  }
  onFilesError (error, file) {
    this.setState({errorMsg: error.message, showErrorDialogue: true})
  }
  updateMediaDetails (mediaProps) {
    if (mediaProps.media && mediaProps.media !== '') {
      this.setState({
        //  id: cardProps.id,
        componentType: 'media',
        button: mediaProps.media.buttons,
        showPreview: true
      })
      if (mediaProps.media.buttons) {
        this.setState({
          button: mediaProps.media.buttons
        })
      }
      if (mediaProps.media.fileurl && mediaProps.media.fileurl.url) {
        this.setState({
          previewUrl: mediaProps.media.fileurl.url,
          fileurl: mediaProps.media.fileurl,
          fileName: mediaProps.media.fileName,
          type: mediaProps.media.type,
          size: mediaProps.media.size
        })
      }
      if (mediaProps.media.mediaType) {
        var mediaType = mediaProps.media.mediaType
        if (mediaType === 'video') {
          this.setState({
            mediaType: 'video'
          })
        } else if (mediaType === 'image') {
          this.setState({
            mediaType: 'image'
          })
        }
      }
    }
  }
  _onChange () {
    var file = this.refs.file.files[0]
    var video = file.type.match('video.*')
    var image = file.type.match('image.*')
    if (file.size > 25000000) {
      this.props.handleMedia({error: 'file size error'})
      return
    }
    if (!video && !image) {
      this.props.handleMedia({error: 'invalid file'})
      return
    }
    if (file && image) {
      this.setState({
        mediaType: 'image',
        showPreview: false
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
        })
      }.bind(this)
      this.setState({loading: true})
      this.props.uploadImage(file, this.props.pages[0]._id, 'image', {fileurl: '',
        fileName: file.name,
        type: file.type,
        size: file.size}, this.updateImageUrl, this.setLoading)
    }
    if (file && video) {
      this.setState({mediaType: 'video', showPreview: false})
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('pageId', this.props.pages[0]._id)
      fileData.append('componentType', 'video')
      var fileInfo = {
        id: this.props.id,
        componentType: 'video',
        fileName: file.name,
        type: file.type,
        size: file.size
      }
      this.setState({loading: true, showPreview: false})
      this.props.uploadFile(fileData, fileInfo, this.updateFileUrl, this.setLoading)
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
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      buttons: temp})
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
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      buttons: temp})
  }
  removeButton (obj) {
    var temp = this.state.button.filter((elm, index) => { return index !== obj.id })
    this.setState({button: temp})
    this.props.handleMedia({id: this.props.id,
      componentType: 'media',
      fileurl: this.state.fileurl,
      mediaType: this.state.mediaType,
      fileName: this.state.fileName,
      type: this.state.type,
      size: this.state.size,
      buttons: temp})
  }

  setLoading () {
    this.setState({loading: false})
  }
  updateImageUrl (data) {
    this.setState({ fileurl: data.fileurl,
      fileName: data.fileName,
      type: data.type,
      size: data.size })

    this.props.handleMedia({id: this.props.id,
      componentType: 'media',
      mediaType: this.state.mediaType,
      fileurl: data.fileurl,
      fileName: data.fileName,
      type: data.type,
      size: data.size,
      buttons: this.state.button})
  }
  updateFileUrl (data) {
    this.setState({ fileurl: data.fileurl,
      fileName: data.fileName,
      type: data.type,
      size: data.size })

    this.props.handleMedia({id: this.props.id,
      componentType: 'media',
      mediaType: this.state.mediaType,
      fileurl: data.fileurl,
      fileName: data.fileName,
      type: data.type,
      size: data.size,
      buttons: this.state.button})
  }

  render () {
    return (
      <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
        {
        this.state.showErrorDialogue &&
          <ModalContainer style={{width: '300px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '300px'}}
              onClose={this.closeDialog}>
              <h3><i className='fa fa-exclamation-triangle' aria-hidden='true' /> Error</h3>
              <p>{this.state.errorMsg}</p>
            </ModalDialog>
          </ModalContainer>
        }
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', margin: -15 + 'px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div style={{minHeight: 170, maxWidth: 400, marginBottom: '-0.5px'}} className='ui-block hoverbordersolid'>
          {
          this.state.loading
          ? <div className='align-center' style={{padding: '50px'}}><center><Halogen.RingLoader color='#FF5E3A' /></center></div>
          : <div style={{display: 'flex', minHeight: 170, backgroundColor: '#F2F3F8'}} className='mediaImage' onClick={() => {
            this.refs.file.click()
          }}>
            <input
              ref='file'
              type='file'
              name='user[image]'
              multiple='true'
              accept='image/*, video/*'
              title=' '
              onChange={this._onChange} onError={this.onFilesError} style={{position: 'absolute', cursor: 'pointer', display: 'none'}} />
            <div style={{width: '100%'}}>
              {
                (!this.state.showPreview && this.state.fileName === '') &&
                <div className='align-center' style={{marginTop: '50px'}}>
                  <img style={{maxHeight: 40, margin: 'auto'}} src='icons/media.png' alt='Text' />
                  <h4 style={{pointerEvents: 'none', zIndex: -1}}> Media </h4>
                </div>
              }
              {
                (!this.state.showPreview && this.state.fileurl && this.state.fileurl !== '') &&
                  <div className='align-center'>
                    { this.state.mediaType === 'image' &&
                    <img style={{maxWidth: 300, margin: -25, padding: 25}} src={this.state.fileurl.url} />
                  }
                    { this.state.mediaType === 'video' &&
                    <div style={{marginTop: '50px'}}>
                      <img src='icons/video.png' alt='Text' style={{maxHeight: 40}} />
                      <h4 style={{wordBreak: 'break-word'}}>{this.state.fileName !== '' ? this.state.fileName : 'Video'}</h4>
                    </div>
                  }
                  </div>
              }
              {
                this.state.showPreview && this.state.mediaType === 'image' &&
                <img style={{maxWidth: 250, maxHeight: 250, margin: 10}} src={this.state.previewUrl} />
              }
              { this.state.showPreview && this.state.mediaType === 'video' &&
                <div style={{padding: '10px'}}>
                  <ReactPlayer
                    url={this.state.previewUrl}
                    controls
                    width='100%'
                    height='auto'
                    onPlay={this.onTestURLVideo(this.state.previewUrl)}
                  />
                </div>
              }
            </div>
          </div>
          }
        </div>
        {(this.state.button) ? this.state.button.map((obj, index) => {
          return <EditButton button_id={(this.props.button_id !== null ? this.props.button_id + '-' + this.props.id : this.props.id) + '-' + index} data={{id: index, button: obj}} onEdit={this.editButton} onRemove={this.removeButton} />
        }) : ''}
        { this.state.button.length < 3 &&
        <div className='ui-block hoverborder' style={{minHeight: 30, maxWidth: 400}}>
          <Button button_id={this.props.button_id !== null ? (this.props.button_id + '-' + this.props.id) : this.props.id} onAdd={this.addButton} />
        </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadImage: uploadImage,
    uploadFile: uploadFile
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Media)
