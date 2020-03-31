/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast
} from '../../redux/actions/broadcast.actions'
import { uploadFile } from '../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import Files from 'react-files'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { RingLoader } from 'halogenium'
import ReactPlayer from 'react-player'

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
        componentType: 'video',
        name: this.props.file.fileName,
        type: this.props.file.type,
        size: this.props.file.size,
        url: ''
      }
      if (this.props.file.fileurl) {
        fileInfo.url = this.props.file.fileurl.url
      }
      this.setState({file: fileInfo, showPreview: true})
    }
  }
  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
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
    if (files.length > 0) {
      var file = files[files.length - 1]
      this.setState({file: file})
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
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

  onFilesError (error, file) {
    this.setState({errorMsg: error.message, showDialog: true})
  }

  render () {
    return (
      <div>
        <div onClick={() => { this.props.onRemove({id: this.props.id}) }} style={{position: 'absolute', right: '-10px', top: '-5px', zIndex: 6, marginTop: '-5px'}}>
          <span style={{cursor: 'pointer'}} className='fa-stack'>
            <i className='fa fa-times fa-stack-2x' />
          </span>
        </div>
        <div className='ui-block hoverborder' style={{minHeight: 100, maxWidth: 400, padding: 25}}>
          {
            this.state.loading
            ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
            : <Files
              className='files-dropzone'
              onChange={this.onFilesChange}
              onError={this.onFilesError}
              accepts={['video/*']}
              maxFileSize={25000000}
              minFileSize={0}
              clickable
            >
              <div className='align-center'>
                <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Text' style={{maxHeight: 40}} />
                <h4 style={{wordBreak: 'break-word'}}>{this.state.file !== '' ? this.state.file.name : 'Video'}</h4>
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
          {/* {
          this.state.showDialog &&
            <ModalContainer style={{width: '300px'}}
              onClose={this.closeDialog}>
              <ModalDialog style={{width: '300px'}}
                onClose={this.closeDialog}>
                <h3><i className='fa fa-exclamation-triangle' aria-hidden='true' /> Error</h3>
                <p>{this.state.errorMsg}</p>
              </ModalDialog>
            </ModalContainer>
        } */}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    sendbroadcast: sendbroadcast,
    clearAlertMessage: clearAlertMessage,
    uploadFile: uploadFile
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Video)
