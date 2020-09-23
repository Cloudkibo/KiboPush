import React from 'react'
import PropTypes from 'prop-types'
import { isWebURL } from '../../utility/utils'
import CONFIRMATIONMODAL from '../extras/confirmationModal'

class AttachmentArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      inputValue: '',
      helpMessage: '',
      invalidUrl: false,
      typingInterval: 1000,
      attachment: {},
      attachmentType: '',
      isUploaded: false,
      waitingForUrlData: false,
      waitingForAttachment: false
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.getComponentType = this.getComponentType.bind(this)
    this.getInputValue = this.getInputValue.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.afterAttachmentUpload = this.afterAttachmentUpload.bind(this)
    this.onUrlResponse = this.onUrlResponse.bind(this)
    this.handleFilChange = this.handleFilChange.bind(this)
  }

  componentDidMount () {
    let typingTimer
    let doneTypingInterval = this.state.typingInterval
    let input = document.getElementById(`_attachment_in_chatbot`)
    input.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(() => {
        if (isWebURL(this.state.inputValue)) {
          this.props.handleAttachment({ url: this.state.inputValue }, this.onUrlResponse)
          this.setState({
            waitingForUrlData: true,
            invalidUrl: false,
            helpMessage: 'Validating url...'
          }, () => {
            this.props.updateParentState({attachmentUploading: true})
          })
        } else if (this.state.inputValue) {
          this.setState({
            helpMessage: 'Please provide a valid url',
            invalidUrl: true
          })
        } else {
          this.setState({
            helpMessage: '',
            invalidUrl: false
          })
        }
      }, doneTypingInterval)
    })
    input.addEventListener('keydown', () => {clearTimeout(typingTimer)})
  }

  onUrlResponse (res) {
    const data = res.payload
    if (res.status === 'success') {
      let helpMessage = 'Url is valid.'
      this.setState({
        waitingForUrlData: false,
        invalidUrl: false,
        helpMessage,
        attachmentType: 'card'
      })
      const attachment = {
        type: 'card',
        cardData: {
          title: data.ogTitle,
          description: data.ogDescription,
          image_url: data.ogImage && data.ogImage.url,
          url: this.state.inputValue
        }
      }
      this.props.updateParentState({attachment, attachmentUploading: false})
    } else {
      this.setState({
        waitingForUrlData: false,
        invalidUrl: true,
        helpMessage: res.description
      })
      const attachment = {
        type: 'video',
        fileData: {url: this.state.inputValue}
      }
      this.props.updateParentState({attachment, attachmentUploading: false})
    }
  }

  onInputChange (e) {
    this.setState({inputValue: e.target.value, attachmentType: ''}, () => {
      if (!this.state.inputValue) {
        this.props.updateParentState({attachment: {}})
      }
    })
  }

  getInputValue () {
    if (this.state.isUploaded) {
      return `Attachment: ${this.state.attachment.name}`
    } else {
      return this.state.inputValue
    }
  }

  removeAttachment () {
    this.setState({
      inputValue: '',
      helpMessage: '',
      invalidUrl: false,
      attachment: {},
      attachmentType: '',
      isUploaded: false,
      waitingForUrlData: false
    }, () => {
      this.props.updateParentState({attachment: {}})
    })
  }

  getComponentType(type) {
    if (type.match('image.*')) {
      return 'image'
    } else if (type.match('audio.*')) {
      return 'audio'
    } else if (type.match('video.*')) {
      return 'video'
    } else if (type.match('application.*') || type.match('text.*')) {
      return 'file'
    }
  }

  afterAttachmentUpload (res, type) {
    if (res.status === 'success') {
      this.setState({
        isUploaded: true,
        waitingForAttachment: false,
        attachmentType: type
      })
      const attachment = {
        type,
        fileurl: res.payload,
        fileData: {
          name: this.state.attachment.name,
          type: this.state.attachment.type,
          size: this.state.attachment.size
        }
      }
      this.props.updateParentState({attachment, attachmentUploading: false})
    } else {
      this.props.alertMsg.error('Failed to upload attachment. Please try again later')
      this.setState({waitingForAttachment: false})
      this.props.updateParentState({attachmentUploading: false})
    }
  }

  onFileChange (e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 25000000) {
        this.props.alertMsg.error('Attachment exceeds the limit of 25MB')
      } else if (['application/zip', 'text/javascript', 'text/exe', 'application/x-ms-dos-executable'].includes(file.type)) {
        this.props.alertMsg.error('Cannot add js, exe or zip files. Please select another file')
      } else {
        const type = this.getComponentType(file.type)
        this.setState({
          isUploaded: false,
          inputValue: 'Uploading...',
          attachment: file,
          attachmentType: '',
          waitingForAttachment: true,
          helpMessage: '',
          invalidUrl: false
        }, () => {
          this.props.updateParentState({attachmentUploading: true})
        })
        const fileData = new FormData()
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('componentType', type)
        this.props.uploadAttachment(fileData, (res) => this.afterAttachmentUpload(res, type))
      }
    }
  }

  handleFilChange () {
    if (this.state.attachmentType) {
      this.refs._override_attachment.click()
    } else {
      this.refs._upload_attachment_in_chatbot.click()
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!(this.state.waitingForUrlData || this.state.waitingForAttachment)) {
      if (nextProps.attachment && Object.keys(nextProps.attachment).length > 0) {
        this.setState({
          inputValue: nextProps.attachment.fileData ? (nextProps.attachment.fileData.url || '') : nextProps.attachment.cardData.url,
          attachment: nextProps.attachment.fileData || {},
          attachmentType: nextProps.attachment.type,
          isUploaded: nextProps.attachment.fileData && nextProps.attachment.type && !nextProps.attachment.fileData.url ? true : false
        })
      } else {
        this.setState({
          inputValue: '',
          attachment: {},
          attachmentType: '',
          isUploaded: false
        })
      }
    }
  }

  render () {
    return (
      <div id='_chatbot_message_area_attachment' className='row'>
        <div className='col-md-12'>
          <div className="form-group m-form__group">
            <span className='m--font-boldest'>Attachment:</span>
            <input
              ref='_upload_attachment_in_chatbot'
              style={{display: 'none'}}
              type='file'
              accept='image/*, video/*, audio/*, application/*, text/*'
              onChange={this.onFileChange}
              onClick={(e) => {e.target.value = ''}}
            />
            <div className="input-group">
              <input
                style={{cursor: this.state.isUploaded && 'not-allowed'}}
                type="text"
                id='_attachment_in_chatbot'
                className="form-control m-input"
                placeholder="Paste url or upload an attachment"
                value={this.getInputValue()}
                onChange={this.onInputChange}
                disabled={this.state.isUploaded || this.state.waitingForAttachment}
              />
              {
                this.state.isUploaded &&
                <span onClick={this.removeAttachment} id='_chatbot_message_area_attachment_remove' style={{border: 'none', cursor: 'pointer', backgroundColor: '#eee', boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, .075)'}} className='input-group-addon'>
                  <span>
                    <i className='la la-times-circle' />
                  </span>
                </span>
              }
              <span id='_chatbot_message_area_attachment_upload' style={{border: '1px solid #ccc', cursor: 'pointer'}} onClick={this.handleFilChange} className="input-group-addon m--font-boldest">
                {
                  this.state.waitingForAttachment
                  ? <div id='_chatbot_message_area_attachment_upload_loader' className="m-loader" style={{width: "30px"}} />
                  : <span>
                    <i style={{color: '#575962'}} className='fa fa-cloud-upload' /> Upload
                  </span>
                }
              </span>
            </div>
            <span id='_cb_ma_attachment_hm' className={`m-form__help m--font-${this.state.invalidUrl ? 'danger' : this.state.waitingForUrlData ? 'info' : 'success'}`}>
              {this.state.inputValue && this.state.helpMessage}
            </span>
          </div>
          <button style={{display: 'none'}} ref='_override_attachment' data-toggle='modal' data-target='#_override_attachment_chatbot' />
          <CONFIRMATIONMODAL
            id='_override_attachment_chatbot'
            title='Override Attachment'
            description='This will override the existing attachment. Are you sure you want to continue?'
            onConfirm={() => this.refs._upload_attachment_in_chatbot.click()}
          />
        </div>
      </div>
    )
  }
}

AttachmentArea.propTypes = {
  'chatbot': PropTypes.object.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'handleAttachment': PropTypes.func.isRequired,
  'attachment': PropTypes.object.isRequired,
  'updateParentState': PropTypes.func.isRequired
}

export default AttachmentArea
