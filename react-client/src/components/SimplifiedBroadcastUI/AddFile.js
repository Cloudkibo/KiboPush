/* eslint-disable no-undef */

import React from 'react'
import { connect } from 'react-redux'
import { uploadFile, uploadTemplate, deleteFile } from '../../redux/actions/convos.actions'
import { bindActionCreators } from 'redux'
import Files from 'react-files'
import { RingLoader } from 'halogenium'
import AlertContainer from 'react-alert'

class File extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: this.props.file ? this.props.file : '',
      errorMsg: '',
      showErrorDialogue: false,
      loading: false,
      showPreview: false,
    }
    this.onFilesChange = this.onFilesChange.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.handleFile = this.handleFile.bind(this)
  }

  componentDidMount () {
    if (this.props.file && this.props.file !== '') {
      var fileInfo = {
        id: this.props.id,
        componentType: 'file',
        componentName: 'file',
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
          componentType: 'file',
          componentName: 'file',
          id: this.props.file.fileurl.id,
          name: this.props.file.fileurl.name
        }, {
          id: this.props.id,
          componentType: 'file',
          componentName: 'file',
          fileName: this.props.file.fileName,
          type: this.props.file.type,
          size: this.props.file.size
        }, this.props.handleFile, this.setLoading)
      }
    }
  }

  setLoading () {
    this.setState({loading: false})
  }

  onFilesChange (files) {
    if (files.length > 0) {
      if (this.state.file && this.state.file.id) {
        this.props.deleteFile(this.state.file.id)
      }
      var file = files[files.length - 1]
      console.log('file', file)
    //   this.props.updateFile(file)
      this.setState({file: file})
      if (file.type === 'text/javascript' || file.type === 'text/exe') {
        this.msg.error('Cannot add js or exe files. Please select another file')
      } else if (file.size > 10000000) {
        this.msg.error('Files greater than 25MB not allowed')
      } else {
        var fileData = new FormData()
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('pages', JSON.stringify(this.props.pages))
        fileData.append('componentType', 'file')
        var fileInfo = {
          id: this.props.id,
          componentType: 'file',
          componentName: 'file',
          fileName: file.name,
          type: file.type,
          size: file.size
        }
        this.setState({loading: true, showPreview: false})
        this.props.uploadFile(fileData, fileInfo, this.handleFile, this.setLoading)
      }
    }
  }

  handleFile (fileInfo) {
    this.props.updateFile(fileInfo)
    this.setState({file: fileInfo.fileurl, showPreview: true})
    // this.props.handleFile(fileInfo)
  }

  onFilesError (error, file) {
    this.setState({errorMsg: error.message})
    this.refs.error.click()
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

        <div className='ui-block hoverborder' style={{padding: 25, borderColor: this.props.required && !this.state.file ? 'red' : ''}}>
          {
            this.state.loading
            ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
            : <Files
                className='files-dropzone'
                onChange={this.onFilesChange}
                onError={this.onFilesError}
                accepts= {this.props.module && this.props.module === 'whatsapp' ? ['.pdf']: ['image/*', 'text/*', 'audio/*', 'video/*', 'application/*'] }
                maxFileSize={this.props.module && this.props.module === 'whatsapp' ? 5000000 : 10000000}
                minFileSize={0}
                clickable>
              <div className='align-center' style={{padding: '5px'}}>
                <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='Text' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} />
                <h4 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline'}}>{this.state.file !== '' ? this.state.file.name : 'File'}</h4>
              </div>
            </Files>
          }
          <a href='#/' style={{ display: 'none' }} ref='error' data-toggle="modal" data-target="#error">error</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="error" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    <i className='fa fa-exclamation-triangle' aria-hidden='true' /> Error
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{ color: 'black' }} className="modal-body">
                  <p>{this.state.errorMsg}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{color: 'red'}}>{this.props.required && !this.state.file ? '*Required' : ''}</div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadFile,
    uploadTemplate,
    deleteFile
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(File)
