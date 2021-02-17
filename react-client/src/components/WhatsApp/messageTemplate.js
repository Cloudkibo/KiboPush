/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'
import PropTypes from 'prop-types'
import {validatePhoneNumber} from '../../utility/utils'
import Files from 'react-files'
import { RingLoader } from 'halogenium'
import { cloneDeep } from 'lodash'

class MessageTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      templateMessage: this.props.edit ? this.props.templateMessage : this.props.templates && this.props.templates.length > 0 && this.props.templates[0].text,
      isTemplateValid: true,
      templateArguments: this.props.templateArguments,
      number: '',
      sendingTemplate: false,
      selectedIndex: this.props.selectedIndex ? this.props.selectedIndex : 0,
      isPhoneNumberValid: false,
      edited: true,
      uploadingAttachment: false,
      attachment: this.props.edit ? this.props.fileurl : {},
      errorMsg: false,
      componentType: this.props.edit ? this.props.componentType : 'text'
    }
    this.resetTemplate = this.resetTemplate.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.validateTemplate = this.validateTemplate.bind(this)
    this.sendTemplate = this.sendTemplate.bind(this)
    this._sendTemplate = this._sendTemplate.bind(this)
    this.updateChatData = this.updateChatData.bind(this)
    this.updateNumber = this.updateNumber.bind(this)
    this.addComponent = this.addComponent.bind(this)
    this.getAttachmentContent = this.getAttachmentContent.bind(this)
    this.onFilesChange = this.onFilesChange.bind(this)
    this.getComponentType = this.getComponentType.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.getUploadedFileType = this.getUploadedFileType.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.getAcceptedFiles = this.getAcceptedFiles.bind(this)
    this.getAttachmentPreview = this.getAttachmentPreview.bind(this)
    this.setDataPayloadForBroadcast = this.setDataPayloadForBroadcast.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.templateMessage) {
      this.setState({
        templateMessage: nextProps.templateMessage,
        templateName: nextProps.templateName,
        selectedIndex: nextProps.selectedIndex,
        templateArguments: nextProps.templateArguments,
        edited: false,
        isTemplateValid: true,
        componentType: nextProps.componentType,
        attachment: nextProps.fileurl
      })
    } else if (nextProps.templates.length > 0) {
      this.setState({
        templateMessage: nextProps.templates[0].text,
        templateArguments: nextProps.templates[0].templateArguments,
        componentType: this.getComponentType(nextProps.templates[0].type),
        errorMsg: nextProps.templates[0].type !== 'TEXT' ? '*Required' : false
      })
    }
  }

  updateNumber (e) {
    this.setState({
      number: e.target.value,
      isPhoneNumberValid: validatePhoneNumber(e.target.value)
    })
  }

  getComponentType (type) {
    if (type) {
      if (type === 'DOCUMENT') {
          return 'file'
        } else {
          return type.toLowerCase()
        }
    } else {
      return 'text'
    }
  }

  resetTemplate () {
    this.setState({
      templateMessage: this.props.templates[0].text,
      templateArguments: this.props.templates[0].templateArguments,
      isTemplateValid: true,
      sendingTemplate: false,
      number: '',
      selectedIndex: 0,
      isPhoneNumberValid: false,
      componentType: this.getComponentType(this.props.templates[0].type),
      errorMsg: this.props.templates[0].type !== 'TEXT' ? '*Required' : false,
      attachment: {},
      uploadingAttachment: false
    })
     /* eslint-disable */
     $('#templateText').removeClass('border border-danger')
     /* eslint-enable */
  }

  validateTemplate(msg) {
    let regex = new RegExp(this.props.templates[this.state.selectedIndex].regex)
    let templateArguments = this.state.templateArguments
    let isValid = regex.test(msg)
    if (isValid) {
      let matches = regex.exec(msg)
      for (let i = 1; i < matches.length; i++) {
        if (!matches[i]) {
          isValid = false
        }
      }
      templateArguments = matches.slice(1).join(',')
    }
    if (!isValid) {
      /* eslint-disable */
      $('#templateText').addClass('border border-danger')
      /* eslint-enable */
    } else {
      /* eslint-disable */
      $('#templateText').removeClass('border border-danger')
      /* eslint-enable */
    }
    this.setState({
      isTemplateValid: isValid,
      templateArguments
    })
  }

  onTextChange (e) {
    this.setState({
      edited: true,
      templateMessage: e.currentTarget.value
    })
    this.validateTemplate(e.currentTarget.value)
  }

  handleRadioButton (index) {
    this.setState({
      selectedIndex: index,
      isTemplateValid: true,
      templateArguments: this.props.templates[index].templateArguments,
      templateMessage: this.props.templates[index].text
    })
    if (this.props.templates[index].type !== 'TEXT') {
      this.setState({errorMsg: '*Required', componentType: this.getComponentType(this.props.templates[index].type)})
    } else {
      this.setState({errorMsg: false, attachment: {}, uploadAttachment: false, componentType: 'text'})
    }
    /* eslint-disable */
    $('#templateText').removeClass('border border-danger')
    /* eslint-enable */
  }

  sendTemplate () {
    this.setState({sendingTemplate: true})
    if (this.props.sendingToNewNumber) {
      this.props.createNewContact({
        number: '+' + this.state.number.replace(/\D/g, '')
      }, (res) => {
        if (res.status === 'success') {
        this.props.changeActiveSession(res.payload, null, () => {
          this._sendTemplate()
        })
      } else {
        let errorMsg = res.description || res.payload
          this.props.alertMsg.error(errorMsg)
        }
      })
    } else {
      this._sendTemplate()
    }
  }

  setDataPayload(component) {
    let payload = {
      buttons: this.props.templates[this.state.selectedIndex].buttons,
      templateArguments: this.state.templateArguments,
      templateName: this.props.templates[this.state.selectedIndex].name,
      templateId: this.props.templates[this.state.selectedIndex].namespace || this.props.templates[this.state.selectedIndex].id,
      templateCode: this.props.templates[this.state.selectedIndex].code,
      templateType: this.props.templates[this.state.selectedIndex].type
    }
    if (component === 'text') {
      payload.componentType = 'text'
      payload.text = this.state.templateMessage
    } else {
      payload.componentType = this.state.componentType
      payload.fileName = this.state.attachment.name
      payload.size = this.state.attachment.size
      payload.type = this.state.attachment.type
      payload.fileurl = {
        id: this.state.attachment.id,
        name: this.state.attachment.name,
        url: this.state.attachment.url
      }
      payload.caption = this.state.templateMessage
    }
    return payload
  }

  _sendTemplate () {
    let payload = this.setDataPayload(this.state.componentType)
    let data = this.props.setMessageData(this.props.activeSession, payload)
    this.props.sendChatMessage(data, (res) => {
      if (res.status === 'success') {
        this.resetTemplate()
        if (this.props.updateChatAreaHeight) {
          this.props.updateChatAreaHeight('57vh')
        }
        if (this.props.activeSession) {
          data.format = 'convos'
          this.updateChatData(data, payload)
        }
        document.getElementById(`_close_${this.props.id}`).click()
        this.props.alertMsg.success('Template Successfully Sent')
      } else {
        this.setState({sendingTemplate: false})
        let errorMsg = res.description || res.payload
        if (errorMsg.message) {
          this.props.alertMsg.error(JSON.stringify(errorMsg.message))
        } else {
          this.props.alertMsg.error(JSON.stringify(errorMsg))
        }
      }
    })
  }

  updateChatData (data, payload) {
    data._id = new Date().getTime()
    let sessions = this.props.sessions
    let session = this.props.activeSession
    let index = sessions.findIndex((s) => s._id === session._id)
    sessions.splice(index, 1)
    session.lastPayload = payload
    session.lastRepliedBy = data.replied_by
    session.pendingResponse = false
    session.last_activity_time = new Date()
    if (this.props.updateNewMessage) {
      this.props.updateNewMessage(true)
    }
    this.props.updateState({
      reducer: true,
      userChat: [...this.props.userChat, data],
      sessions: [session, ...sessions]
    })
  }

  setDataPayloadForBroadcast(component) {
    let payload = {
      buttons: this.props.templates[this.state.selectedIndex].buttons,
      templateArguments: this.state.templateArguments,
      templateName: this.props.templates[this.state.selectedIndex].name,
      templateId: this.props.templates[this.state.selectedIndex].namespace || this.props.templates[this.state.selectedIndex].id,
      templateCode: this.props.templates[this.state.selectedIndex].code,
      templateType: this.props.templates[this.state.selectedIndex].type,
      selectedIndex: this.state.selectedIndex,
      id: this.props.id >= 0 ? this.props.id : null,
      componentName: 'template'
    }
    if (component === 'text') {
      payload.componentType = 'text'
      payload.text = this.state.templateMessage
    } else if (component === 'image' || component === 'video') {
      payload.componentType = 'media'
      payload.mediaType = this.state.componentType
      payload.fileName = this.state.attachment.name
      payload.size = this.state.attachment.size
      payload.type = this.state.attachment.type
      payload.fileurl = {
        id: this.state.attachment.id,
        name: this.state.attachment.name,
        url: this.state.attachment.url
      }
      if (component === 'image') payload.image_url = this.state.attachment.url
      payload.caption = this.state.templateMessage
    } else if (component === 'file') {
      payload.componentType = 'file'
      payload.file = {
        fileName:  this.state.attachment.name,
        size: this.state.attachment.size,
        type: this.state.attachment.type,
        fileurl: {
          id: this.state.attachment.id,
          name: this.state.attachment.name,
          url: this.state.attachment.url
        }
      }
      payload.caption = this.state.templateMessage
    }
    return payload
  }

  addComponent() {
    let payload = this.setDataPayloadForBroadcast(this.state.componentType)
    this.props.addComponent(payload, this.props.edit)
  }

  closeModal() {
    if (!this.state.edited) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
  }

  getUploadedFileType(type) {
    if (type.match('image.*')) {
      return 'image'
    } else if (type.match('video.*')) {
      return 'video'
    } else if (type.match('application.*') || type.match('text.*')) {
      return 'file'
    }
  }
  onFilesChange (files) {
    if (files.length > 0) {
      var file = files[files.length - 1]
      console.log('file', file)
      this.setState({file: file})
      if (file.size > 25000000) {
        this.setState({errorMsg: '*Attachment exceeds the limit of 25MB'})
        this.props.alertMsg.error('Attachment exceeds the limit of 25MB')
      } else if (
        [
          'application/zip',
          'text/javascript',
          'text/exe',
          'application/x-ms-dos-executable',
          'application/x-pem-file',
          'application/x-x509-ca-cert'
        ].includes(file.type)
      ) {
        this.props.alertMsg.error(
          `${file.type} files are not supported. Please select another file`
        )
      } else {
        var fileData = new FormData()
        const type = this.getUploadedFileType(file.type)
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('componentType', type)
        var fileInfo = {
          componentType: type,
          componentName: 'file',
          fileName: file.name,
          type: file.type,
          size: file.size
        }
        this.setState({uploadingAttachment: true})
        this.props.uploadFile(fileData, fileInfo, this.handleFile)
      }
    }
  }

  handleFile (fileInfo) {
    let attachment = cloneDeep(this.state.attachment)
    attachment.id = fileInfo.fileurl.id
    attachment.url = fileInfo.fileurl.url
    attachment.name = fileInfo.fileurl.name
    attachment.type = fileInfo.componentType
    this.setState({
      attachment: attachment,
      uploadingAttachment: false,
      errorMsg: false
    })
  }

  onFilesError (error, file) {
    this.props.alertMsg.error('Attachment exceeds the limit of 25MB')
  }

  getAcceptedFiles (type) {
    let accepted = []
    switch (type) {
      case 'image':
        accepted.push('image/*')
        break
      case 'video':
        accepted.push('video/*')
        break
      case 'file':
        accepted.push('application/*')
        break
      default:
    }
    return accepted
  }

  getAttachmentPreview (type) {
    if (type === 'image') {
      if (this.state.attachment.url) {
        return (
          <div className='align-center'>
            <img style={{maxWidth: 300, margin: -25, padding: 25}} src={this.state.attachment.url} alt='' />
          </div>
        )
      } else {
        return (
          <div className='align-center' style={{padding: '5px'}}>
            <img src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Text' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} />
            <h4 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline', wordBreak: 'break-all'}}>Upload Image</h4>
          </div>
        )
      }
    } else if (type === 'video') {
      if (this.state.attachment.url) {
        return (
          <video ref="video" controls style={{ width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} name='media' id='youtube_player'>
            <source src={this.state.attachment.url} type='audio/mpeg' />
          </video>
        )
      } else {
        return (
          <div className='align-center' style={{padding: '5px'}}>
             <img src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Text' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} />
             <h4 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline', wordBreak: 'break-all'}}>Upload Video</h4>
           </div>
        )
      }
    } else if (type === 'file') {
      return (
        <div className='align-center' style={{padding: '5px'}}>
          <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='Text' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} />
          <h4 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline', wordBreak: 'break-all'}}>{this.state.attachment.name ? this.state.attachment.name : 'Upload File'}</h4>
        </div>
      )
    }
  }

  getAttachmentContent (type) {
    return (
      <Files
        className='files-dropzone'
        onChange={this.onFilesChange}
        onError={this.onFilesError}
        accepts= {this.getAcceptedFiles(type)}
        maxFileSize={25000000}
        minFileSize={0}
        clickable>
        {this.getAttachmentPreview(type)}
      </Files>
    )
  }

  render () {
    return (
      <div className="modal-content" style={{width: '60vw'}}>
        <div style={{ display: 'block' }} className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            {this.props.heading ? this.props.heading : 'Message Templates'}
          </h5>
          <button id={`_close_${this.props.id}`} style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" aria-label="Close" data-dismiss='modal'>
            <span aria-hidden="true">
              &times;
            </span>
          </button>
        </div>
        <div style={{color: 'black'}} className="modal-body">

        {
          this.props.templates.length > 0 ?
          <div className='row'>
            <div className='col-6' style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
            {
              this.props.sendingToNewNumber ?
                <div>
                  <label className='control-label'>WhatsApp Number:</label>
                  <div style={{display: 'flex'}} id='_whatsapp_number' className='form-group m-form__group'>
                    <input type='tel'
                      style={{width: '95%'}}
                      placeholder='Enter a valid WhatsApp phone number...'
                      disabled={this.state.sendingTemplate}
                      className={this.state.isPhoneNumberValid ? 'form-control' : 'form-control border-danger'}
                      value={this.state.number}
                      onChange={(e) => this.updateNumber(e)} />
                      { !this.state.isPhoneNumberValid &&
                      <div style={{marginLeft: '5px', marginTop: '3px'}}>
                        <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='phoneNumberWarning'>
                          <span>Invalid phone number</span>
                        </UncontrolledTooltip>
                        <i id='phoneNumberWarning' className='flaticon-exclamation m--font-danger'/>
                      </div>
                      }
                  </div>
                </div>
              : this.props.showDescription &&
              <p>To send a message outside the 24 hours session window, use one of the following pre-approved templates</p>
            }

            <div>
            <label>Select Template:</label>
              <div className='radio-buttons' style={{marginLeft: '37px'}}>
                {
                  this.props.templates.map((template, index) => {
                    return (
                      <div className='radio'>
                        <input
                          disabled={this.state.sendingTemplate}
                          id={template.name+this.props.id}
                          type='radio'
                          value={template.name+this.props.id}
                          name={template.name+this.props.id}
                          onChange={() => this.handleRadioButton(index)}
                          checked={this.state.selectedIndex === index} />
                        <span>{template.name}</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className='col-1'>
            <div style={{ minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)' }} />
          </div>
          <div className='col-5'>
            <h4 style={{ marginLeft: '-50px' }}>Preview:</h4>
            <div className='ui-block' style={{ overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '68vh', maxHeight: '68vh', marginLeft: '-50px' }} >
              <div className='discussion' style={{ display: 'inline-block', marginTop: '50px', paddingLeft: '10px', paddingRight: '10px' }} >
                {this.state.componentType !== 'text' &&
                  <div className='ui-block hoverborder' style={{padding: 25, borderColor: this.state.errorMsg ? 'red' : ''}}>
                    {this.state.uploadingAttachment
                    ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
                    : this.getAttachmentContent(this.state.componentType)
                  }
                </div>
              }
              <div style={{textAlign: 'center', display: 'flex'}}>
                <textarea disabled={this.state.sendingTemplate} rows='5' id='templateText' onChange={this.onTextChange} value={this.state.templateMessage}  className='form-control m-messenger__form-input' style={{resize: 'none'}} maxLength='200' />
                { !this.state.isTemplateValid &&
                <div style={{marginTop: '25px', marginLeft: '5px'}}>
                  <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='templateWarning'>
                    <span>Message template format cannot be changed</span>
                  </UncontrolledTooltip>
                  <i id='templateWarning' className='flaticon-exclamation m--font-danger'/>
                </div>
                }
              </div>
                {
                  this.props.templates[this.state.selectedIndex].buttons.map((button, index) => (
                    (
                      <div className='bubble recipient'
                        style={{
                          maxWidth: '100%',
                          textAlign: 'center',
                          margin: 'auto',
                          marginTop: '5px',
                          fontSize: '15px',
                          backgroundColor: 'white',
                          border: '1px solid rgba(0,0,0,.1)',
                          borderRadius: '10px',
                          wordBreak: 'break-all',
                          color: '#0782FF' }}>{button.title}</div>
                    )
                  ))
                }
                <p style={{fontSize: '12px', marginTop: '5px'}}>{'Each variable "{{x}}" can be replaced with text that contains letters, digits, special characters or spaces.'}</p>
              </div>
            </div>
          </div>

          <div className='col-6' style={{ marginTop: '-5vh' }}>
            <div className='pull-right'>
            <div style={{ width: '100%', textAlign: 'right' }}>
              <div style={{ display: 'inline-block', padding: '5px' }}>
                <button disabled={this.state.sendingTemplate} className='btn btn-secondary' onClick={this.resetTemplate}>
                  Reset
                  </button>
              </div>
              <div style={{ display: 'inline-block', padding: '5px' }}>
                <button disabled={this.state.sendingTemplate} className='btn btn-secondary' data-dismiss='modal'>
                  Cancel
                  </button>
              </div>
              <div style={{ display: 'inline-block', padding: '5px' }}>
                {
                  this.props.sendChatMessage &&
                  <button disabled={(this.props.sendingToNewNumber && !this.state.isPhoneNumberValid) || !this.state.isTemplateValid || this.state.sendingTemplate || this.state.errorMsg} className='btn btn-primary' onClick={this.sendTemplate}>
                    {
                      this.state.sendingTemplate ?
                      <div>
                        <div className="m-loader" style={{height: '10px', width: "30px", display: "inline-block"}}></div>
                        <span>Sending...</span>
                      </div>
                      :
                      <span>Send</span>
                    }
                  </button>
                }
                {
                  this.props.addComponent &&
                  <button disabled={!this.state.isTemplateValid || this.state.errorMsg} className='btn btn-primary' onClick={this.addComponent}>
                    {this.props.edit ? 'Edit' : 'Next'}
                  </button>
                }
              </div>
            </div>
            </div>
          </div>

        </div> :

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <span>Loading Templates...</span>
        </div>

        }

        </div>
      </div>
    )
  }
}

MessageTemplate.defaultPropTypes = {
  showDescription: true
}

MessageTemplate.propTypes = {
  'sendTemplate': PropTypes.func.isRequired,
  'closeTemplates': PropTypes.func.isRequired,
}
export default MessageTemplate
