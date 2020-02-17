import React from 'react'
import PropTypes from 'prop-types'
import { RingLoader } from 'halogenium'

class Attachments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.componentData.fileName,
      type: props.componentData.componentName === 'media' ? props.componentData.mediaType : props.componentData.componentName,
      fileurl: props.componentData.fileurl.url,
      fileSelected: props.componentData.fileurl.url ? true : false,
      loading: false
    }
    this.onFileChange = this.onFileChange.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  handleFile (res, data) {
    if (res.status === 'success') {
      data.fileurl = res.payload
      this.setState({
        loading: false,
        fileSelected: true,
        name: data.fileName,
        type: data.componentName === 'media' ? data.mediaType : data.componentName,
        fileurl: data.fileurl.url
      })
      this.props.updateBroadcastData(this.props.blockId, this.props.componentData.id, 'update', data)
    } else {
      this.setState({loading: false})
      this.props.showErrorMessage('An unexpected error occured. Please try again later')
    }
  }

  uploadFile (file, type, component) {
    var fileData = new FormData()
    fileData.append('file', file)
    fileData.append('filename', file.name)
    fileData.append('filetype', file.type)
    fileData.append('filesize', file.size)
    fileData.append('pages', JSON.stringify([this.props.page._id]))
    fileData.append('componentType', type)
    var fileInfo = {
      id: this.props.componentData.id,
      componentType: component,
      componentName: component,
      mediaType: component === 'media' && type,
      fileName: file.name,
      type: file.type,
      size: file.size
    }
    this.props.uploadAttachment(fileData, fileInfo, this.handleFile)
  }

  onFileChange (e) {
    console.log('onFileChange', e.target.files)
    if (e.target.files.length > 0) {
      this.setState({loading: true})
      const file = e.target.files[0]
      if (file.size > 25000000) {
        this.props.showErrorMessage('Attachment exceeds the limit of 25MB')
        this.setState({loading: false})
      } else if (file.type.startsWith('audio/')) {
        this.uploadFile(file, 'audio', 'audio')
      } else if (file.type.startsWith('video/')) {
        this.uploadFile(file, 'video', 'media')
      } else if (file.type.startsWith('image/')) {
        this.uploadFile(file, 'image', 'media')
      } else {
        this.uploadFile(file, 'file', 'file')
      }
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of attachments side panel called ', nextProps)
    if (nextProps.componentData) {
      this.setState({
        fileSelected: true,
        name: nextProps.componentData.fileName,
        type: nextProps.componentData.componentName === 'media' ? nextProps.componentData.mediaType : nextProps.componentData.componentName,
        fileurl: nextProps.componentData.fileurl.url
      })
    }
  }

  render () {
    console.log('props in attachment side panel', this.props)
    return (
      <div id='side_panel_attachments_component'>
        <input
          id='select_attachment'
          ref='select_attachment'
          style={{display: 'none'}}
          type='file'
          accept='image/*, audio/*, video/*, application/*, text/*'
          onChange={this.onFileChange}
        />
        <span className='m--font-boldest'>Attachment:</span>
        {
          this.state.loading
          ? <div className="m-dropzone dropzone m-dropzone--primary dz-clickable" id="side_panel_attachments_component_dropzone">
            <div style={{marginTop: '15px'}} className='align-center'>
              <center><RingLoader color='#5867dd' /></center>
            </div>
          </div>
          : this.state.fileSelected && this.state.type === 'file'
          ? <div onClick={() => {this.refs.select_attachment.click()}} className="m-dropzone dropzone m-dropzone--primary dz-clickable" id="side_panel_attachments_component_dropzone">
            <div className="m-dropzone__msg dz-message needsclick">
              <h2 style={{color: '#5867dd'}} className="m-dropzone__msg-title">
                <i className="fa fa-file-text" /> {this.state.name}
              </h2>
              <span className="m-dropzone__msg-desc">
                Click to upload new attachment of size upto 25MB
              </span>
            </div>
          </div>
          : this.state.fileSelected && this.state.type === 'audio'
          ? <div onClick={() => {this.refs.select_attachment.click()}} className="m-dropzone dropzone m-dropzone--primary dz-clickable" id="side_panel_attachments_component_dropzone">
            <div className="m-dropzone__msg dz-message needsclick">
              <audio controls>
                <source src={this.state.fileurl} />
              </audio>
              <br />
              <span className="m-dropzone__msg-desc">
                Click to upload new attachment of size upto 25MB
              </span>
            </div>
          </div>
          : this.state.fileSelected && this.state.type === 'image'
          ? <div onClick={() => {this.refs.select_attachment.click()}} className="m-dropzone dropzone m-dropzone--primary dz-clickable" id="side_panel_attachments_component_dropzone">
            <div className="m-dropzone__msg dz-message needsclick">
              <img style={{maxWidth: '300px'}} src={this.state.fileurl} alt={this.state.name} />
              <br />
              <span className="m-dropzone__msg-desc">
                Click to upload new attachment of size upto 25MB
              </span>
            </div>
          </div>
          : this.state.fileSelected && this.state.type === 'video'
          ? <div onClick={() => {this.refs.select_attachment.click()}} className="m-dropzone dropzone m-dropzone--primary dz-clickable" id="side_panel_attachments_component_dropzone">
            <div className="m-dropzone__msg dz-message needsclick">
              <video style={{maxWidth: '300px'}} controls>
                <source src={this.state.fileurl} />
              </video>
              <br />
              <span className="m-dropzone__msg-desc">
                Click to upload new attachment of size upto 25MB
              </span>
            </div>
          </div>
          : <div onClick={() => {this.refs.select_attachment.click()}} className="m-dropzone dropzone m-dropzone--primary dz-clickable" id="side_panel_attachments_component_dropzone">
            <div className="m-dropzone__msg dz-message needsclick">
              <h3 className="m-dropzone__msg-title">
                Click to upload attachment
              </h3>
              <span className="m-dropzone__msg-desc">
                Upload image or video or file of size upto 25MB
              </span>
            </div>
          </div>
        }
      </div>
    )
  }
}

Attachments.propTypes = {
  'updateBroadcastData': PropTypes.func.isRequired,
  'blockId': PropTypes.string.isRequired,
  'showErrorMessage': PropTypes.func.isRequired,
  'uploadAttachment': PropTypes.func.isRequired
}

export default Attachments
