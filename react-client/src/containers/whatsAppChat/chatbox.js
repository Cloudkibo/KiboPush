/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { sendChatMessage, sendAttachment } from '../../redux/actions/whatsAppChat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { uploadAttachment, deletefile } from '../../redux/actions/livechat.actions'

const styles = {
  iconclass: {
    height: 24,
    padding: '0 15px',
    width: 24,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer'
  },
  inputf: {
    display: 'none'
  }
}

class ChatBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.previousScrollHeight = undefined
    this.newMessage = false
    this.state = {
      textAreaValue: '',
      attachment: [],
      attachmentType: '',
      componentType: '',
      uploaded: false,
      uploadDescription: '',
      uploadedId: '',
      removeFileDescription: ''
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.resetFileComponent = this.resetFileComponent.bind(this)
    this.setComponentType = this.setComponentType.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
    this.handleSendAttachment = this.handleSendAttachment.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  setMessageData (session, payload) {
    let data = {
      senderNumber: this.props.chat[0].recipientNumber,
      recipientNumber: this.props.chat[0].senderNumber,
      contactId: this.props.activeSession._id,
      payload: payload,
      datetime: new Date().toString(),
      repliedBy: {
        id: this.props.user._id,
        name: this.props.user.name,
        type: 'agent'
      }
    }
    return data
  }
  setDataPayload (component) {
    var payload = ''
    if (component === 'attachment') {
      payload = {
        componentType: this.state.componentType,
        fileName: this.state.attachment.name,
        size: this.state.attachment.size,
        type: this.state.attachmentType,
        fileurl: {
          id: this.state.uploadedId,
          name: this.state.attachment.name,
          url: this.state.uploadedUrl
        }
      }
    } else if (component === 'text') {
      payload = {
        componentType: 'text',
        text: this.state.textAreaValue
      }
    }
    return payload
  }

  removeAttachment () {
    if (this.state.uploadedId !== '') {
      this.props.deletefile(this.state.uploadedId, this.handleRemove)
    }
  }

  handleRemove (res) {
    if (res.status === 'success') {
      this.resetFileComponent()
    }
    if (res.status === 'failed') {
      this.setState({uploaded: true, removeFileDescription: res.description})
    }
  }

  resetFileComponent () {
    this.setState({
      attachment: [],
      attachmentType: '',
      componentType: '',
      uploaded: false,
      uploadDescription: '',
      uploadedId: '',
      removeFileDescription: ''
    })
  }

  setComponentType (file) {
    if (file.type.match('image.*')) {
      this.setState({componentType: 'image'})
    } else if (file.type.match('audio.*')) {
      this.setState({componentType: 'audio'})
    } else if (file.type.match('application.*')) {
      this.setState({componentType: 'file'})
    } else {
      this.setState({componentType: 'Not allowed'})
    }
  }

  onFileChange (e) {
    var files = e.target.files
    console.log('e.target.files', e.target.files)
    var file = e.target.files[files.length - 1]
    if (file) {
      this.resetFileComponent()
      this.setState({
        attachment: file,
        attachmentType: file.type
      })
      this.setComponentType(file)
      if (file.type === 'text/javascript' || file.type === 'text/exe') {
        this.msg.error('Cannot add js or exe files. Please select another file')
      } else if (file.size > 25000000) {
        this.msg.error('Files greater than 25MB not allowed')
      } else {
        var fileData = new FormData()
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('componentType', this.state.componentType)
        console.log('file', file)
        this.setState({uploadDescription: 'File is uploading..'})
        this.props.uploadAttachment(fileData, this.handleUpload)
      }
    }
    this.textInput.focus()
  }
  handleUpload (res) {
    if (res.status === 'failed') {
      this.setState({
        uploaded: false,
        attachment: [],
        uploadDescription: res.description,
        attachmentType: '',
        componentType: '',
        uploadedId: '',
        removeFileDescription: ''
      })
    }
    if (res.status === 'success') {
      this.setState({uploaded: true, uploadDescription: '', removeFileDescription: '', uploadedId: res.payload.id, uploadedUrl: res.payload.url})
    }
    console.log('res.payload', res.paylaod)
  }

  getRepliedByMsg (msg) {
    if (
      (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
      msg.replied_by && msg.replied_by.type === 'agent' && this.props.user._id !== msg.replied_by.id
    ) {
      return `${msg.replied_by.name} replied`
    } else {
      return 'You replied'
    }
  }

  showEmojiPicker () {
    this.setState({showEmojiPicker: true})
  }

  toggleEmojiPicker () {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  handleTextChange (e) {
    this.setState({
      textAreaValue: e.target.value
    })
  }

  handleSendAttachment (res) {
    if (res.status === 'success') {
      this.resetFileComponent()
    }
  }

  onEnter (e) {
    if (e.which === 13) {
      e.preventDefault()
      var payload = {}
      var session = this.props.currentSession
      var data = {}
      if (this.state.uploadedId !== '' && this.state.attachment) {
        payload = this.setDataPayload('attachment')
        data = this.setMessageData(session, payload)
        this.props.onEnter(data, 'attachment', this.handleSendAttachment)
      } else if (this.state.textAreaValue !== '') {
        payload = this.setDataPayload('text')
        data = this.setMessageData(session, payload)
        this.props.onEnter(data, 'text')
        this.setState({textAreaValue: ''})
        // data.format = 'kibopush'
        // this.props.chat.push(data)
        // this.props.updateChat(this.props.chat, data)
      }
      this.newMessage = true
    }
  }

  setEmoji (emoji) {
    this.setState({
      textAreaValue: this.state.textAreaValue + emoji.native,
      showEmojiPicker: false
    })
  }

  render () {
    console.log('render in chatbox', this.props.chat)
    return (
      <div>
        <div className='m-messenger__form' style={{width: '93%', margin: 0}}>
          <div className='m-input-icon m-input-icon--right m-messenger__form-controls'>
            <textarea autoFocus ref={(input) => { this.textInput = input }} type='text' name='' placeholder='Type here...' onChange={this.handleTextChange} value={this.state.textAreaValue} onKeyPress={this.onEnter} className='m-messenger__form-input' style={{resize: 'none'}} />
          </div>
        </div>
        { this.state.uploaded
          ? <div style={{wordWrap: 'break-word', overFlow: 'auto', minHeight: '50px'}}>
            <span onClick={this.removeAttachment} style={{cursor: 'pointer', float: 'right'}} className='fa-stack'>
              <i style={{color: '#ccc'}} className='fa fa-times fa-stack-1x fa-inverse' />
            </span>
            <div><i className='fa fa-file-text-o' /> {this.state.attachment.name}</div>
            <div style={{wordWrap: 'break-word', color: 'red', fontSize: 'small'}}>{this.state.removeFileDescription}</div>
          </div>
          : <div style={{wordWrap: 'break-word', color: 'red', fontSize: 'small'}}>{this.state.uploadDescription}</div>
        }
        <div>
          <div style={{display: 'inline-block'}} data-tip='image'>
            <i style={styles.iconclass} onClick={() => {
              this.refs.selectImage.click()
            }}>
              <i style={{
                fontSize: '20px',
                position: 'absolute',
                left: '0',
                width: '100%',
                height: '1em',
                margin: '5px',
                textAlign: 'center'
              }} className='fa fa-file-image-o' />
            </i>
            <input type='file' accept='image/*' onChange={this.onFileChange} onError={this.onFilesError}
              ref='selectImage' style={styles.inputf} />
          </div>
          <div style={{display: 'inline-block'}} data-tip='file'>
            <div>
              <i style={styles.iconclass} onClick={() => {
                this.refs.selectFile.click()
              }}>
                <i style={{
                  fontSize: '20px',
                  position: 'absolute',
                  left: '0',
                  width: '100%',
                  height: '2em',
                  margin: '5px',
                  textAlign: 'center'
                }} className='fa fa-file-pdf-o' />
              </i>
              <input type='file' accept='application/pdf' onChange={this.onFileChange} onError={this.onFilesError}
                ref='selectFile' style={styles.inputf} />
            </div>
          </div>
          <div style={{display: 'inline-block'}} data-tip='audio'>
            <i style={styles.iconclass} onClick={() => {
              this.refs.selectAudio.click()
            }}>
              <i style={{
                fontSize: '20px',
                position: 'absolute',
                left: '0',
                width: '100%',
                height: '1em',
                margin: '5px',
                textAlign: 'center'
              }} className='fa fa-file-audio-o' />
            </i>
            <input type='file' accept='audio/*' onChange={this.onFileChange} onError={this.onFilesError}
              ref='selectAudio' style={styles.inputf} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in ChatBox', state)
  return {
    chatCount: (state.whatsAppChatInfo.chatCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    sendChatMessage,
    uploadAttachment,
    deletefile,
    sendAttachment
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
