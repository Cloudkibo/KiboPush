/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast
} from '../../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import ReactPlayer from 'react-player'

import { uploadFile, uploadTemplate } from '../../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import Files from 'react-files'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Halogen from 'halogen'

class Video extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: '',
      errorMsg: '',
      showErrorDialogue: false,
      loading: false,
      showPreview: false
    }
    this.onFilesChange = this.onFilesChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
  }

  componentDidMount () {
    if (this.props.file && this.props.file !== '') {
      var fileInfo = {
        id: this.props.id,
        componentType: 'audio',
        name: this.props.file.fileName,
        type: this.props.file.type,
        size: this.props.file.size,
        url: ''
      }
      if (this.props.file.fileurl) {
        fileInfo.url = this.props.file.fileurl.url
      }
      this.setState({file: fileInfo, showPreview: true})
      if (this.props.pages) {
        this.props.uploadTemplate({pages: this.props.pages,
          url: this.props.file.fileurl.url,
          componentType: 'video',
          id: this.props.file.fileurl.id,
          name: this.props.file.fileName
        }, { id: this.props.id,
          componentType: 'video',
          fileName: this.props.file.fileName,
          type: this.props.file.type,
          size: this.props.file.size
        }, this.props.handleFile, this.setLoading)
      }
    }
  }

  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.loading) {
      this.setState({loading: false})
      this.props.setLoading()
    }
  }

  showDialog (page) {
    this.setState({showDialog: true})
  }

  closeDialog () {
    this.setState({showDialog: false})
  }

  setLoading () {
    this.setState({loading: false})
  }

  onFilesChange (files) {
    console.log('files', files)
    if (files.length > 0) {
      var file = files[files.length - 1]
      this.setState({file: file})
      console.log('filesize', file.size)
      if (file.size > 10000000) {
        this.msg.error('Files greater than 25MB not allowed')
      } else {
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
        this.props.uploadFile(fileData, fileInfo, this.props.handleFile, this.setLoading)
      }
    }
  }

  onFilesError () {
    var err = {
      message: 'FILE SIZE CANNOT EXCEED 10MB'
    }
    this.setState({errorMsg: err.message, showDialog: true})
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {!this.state.loading &&
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{float: 'right', height: 20 + 'px', margin: -15 + 'px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        }
        <div className='ui-block hoverborder' style={{minHeight: 100, maxWidth: 400, padding: 25}}>
          {
            this.state.loading
            ? <div className='align-center'><center><Halogen.RingLoader color='#FF5E3A' /></center></div>
            : <Files
              className='files-dropzone'
              onChange={this.onFilesChange}
              onError={this.onFilesError}
              accepts={['video/*']}
              maxFileSize={10000000}
              minFileSize={0}
              clickable
            >
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Text' style={{maxHeight: 40}} />
                <h4 style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>{this.state.file !== '' ? this.state.file.name : 'Video'}</h4>
              </div>
            </Files>
          }
          { this.state.showPreview &&
            <div style={{padding: '10px', marginTop: '40px'}}>
              <ReactPlayer
                url={this.state.file.url}
                controls
                width='100%'
                height='auto'
                onPlay={this.onTestURLVideo(this.state.file.url)}
              />
            </div>
          }
          {
          this.state.showDialog &&
            <ModalContainer style={{width: '300px'}}
              onClose={this.closeDialog}>
              <ModalDialog style={{width: '300px'}}
                onClose={this.closeDialog}>
                <h3><i className='fa fa-exclamation-triangle' aria-hidden='true' /> Error</h3>
                <p>{this.state.errorMsg}</p>
              </ModalDialog>
            </ModalContainer>
        }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    sendbroadcast: sendbroadcast,
    clearAlertMessage: clearAlertMessage,
    loadSubscribersList: loadSubscribersList,
    uploadFile: uploadFile,
    uploadTemplate: uploadTemplate
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Video)
