/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast
} from '../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import { uploadFile, uploadTemplate } from '../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import Files from 'react-files'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Halogen from 'halogen'
import ReactPlayer from 'react-player'

class Audio extends React.Component {
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
    this.onTestURLAudio = this.onTestURLAudio.bind(this)
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
      this.props.uploadTemplate({pages: this.props.pages,
        url: this.props.file.fileurl.url,
        componentType: 'audio',
        id: this.props.file.fileurl.id,
        name: this.props.file.fileurl.name
      }, {
        id: this.props.id,
        componentType: 'audio',
        fileName: this.props.file.fileName,
        type: this.props.file.type,
        size: this.props.file.size
      }, this.props.handleFile, this.setLoading)
    }
  }

  onTestURLAudio (url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
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
    if (files.length > 0) {
      var file = files[files.length - 1]
      this.setState({file: file})
      if (file.size > 10000000) {
        this.msg.error('Files greater than 25MB not allowed')
      } else {
        var fileData = new FormData()
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('pages', JSON.stringify(this.props.pages))
        fileData.append('componentType', 'audio')
        var fileInfo = {
          id: this.props.id,
          componentType: 'audio',
          fileName: file.name,
          type: file.type,
          size: file.size
        }
        this.setState({loading: true, showPreview: false})
        this.props.uploadFile(fileData, fileInfo, this.props.handleFile, this.setLoading)
      }
    }
  }

  onFilesError (error, file) {
    this.setState({errorMsg: error.message, showDialog: true})
  }

  render () {
    console.log('pages in audio: ', this.props.pages)
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='broadcast-component'>
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
              accepts={['audio/*']}
              maxFileSize={10000000}
              minFileSize={0}
              clickable
            >
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/speaker.png' alt='Text' style={{maxHeight: 40}} />
                <h4 style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>{this.state.file !== '' ? this.state.file.name : 'Audio'}</h4>
              </div>
            </Files>
          }
          { this.state.showPreview &&
            <div style={{marginTop: '40px'}}>
              <ReactPlayer
                url={this.state.file.url}
                controls
                width='100%'
                height='50px'
                onPlay={this.onTestURLAudio(this.state.file.url)}
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
  console.log(state)
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
    uploadTemplate: uploadTemplate,
    uploadFile: uploadFile
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Audio)
