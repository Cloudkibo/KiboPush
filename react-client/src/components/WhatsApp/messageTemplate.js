/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'
import PropTypes from 'prop-types'
import {validatePhoneNumber} from '../../utility/utils'

class MessageTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      templateMessage: this.props.templateMessage,
      isTemplateValid: true,
      templateArguments: this.props.templateArguments,
      number: '',
      sendingTemplate: false,
      selectedIndex: this.props.selectedIndex ? this.props.selectedIndex : 0,
      isPhoneNumberValid: false,
      edited: true
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
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.templateMessage) {
      this.setState({
        templateMessage: nextProps.templateMessage,
        templateName: nextProps.templateName,
        selectedIndex: nextProps.selectedIndex,
        templateArguments: nextProps.templateArguments,
        edited: false,
        isTemplateValid: true
      })
    } else if (nextProps.templates.length > 0) {
      this.setState({
        templateMessage: nextProps.templates[0].text,
        templateArguments: nextProps.templates[0].templateArguments
      })
    }
  }

  updateNumber (e) {
    this.setState({
      number: e.target.value, 
      isPhoneNumberValid: validatePhoneNumber(e.target.value)
    })
  }

  resetTemplate () {
    this.setState({
      templateMessage: this.props.templates[0].text,
      templateArguments: this.props.templates[0].templateArguments,
      isTemplateValid: true,
      sendingTemplate: false,
      number: '',
      selectedIndex: 0,
      isPhoneNumberValid: false
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
        this.props.changeActiveSession(res.payload, null, () => {
          this._sendTemplate()
        })
      })
    } else {
      this._sendTemplate()
    }
  }

  _sendTemplate () {
    let payload = {
      componentType: 'text',
      text: this.state.templateMessage,
      buttons: this.props.templates[this.state.selectedIndex].buttons,
      templateArguments: this.state.templateArguments,
      templateName: this.props.templates[this.state.selectedIndex].name
    }
    let data = this.props.setMessageData(this.props.activeSession, payload)
    this.props.sendChatMessage(data, (res) => {
      if (res.status === 'success') {
        this.resetTemplate()
        if (this.props.updateChatAreaHeight) {
          this.props.updateChatAreaHeight('57vh')
        }
        data.format = 'convos'
        this.updateChatData(data, payload)
        document.getElementById(`_close_${this.props.id}`).click()
        this.props.alertMsg.success('Template Successfully Sent')
      } else {
        this.setState({sendingTemplate: false})
        this.props.alertMsg.error(res.payload)
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

  addComponent() {
    this.props.addComponent({
      id: this.props.id >= 0 ? this.props.id : null,
      componentName: 'template',
      componentType: 'text',
      text: this.state.templateMessage,
      buttons: this.props.templates[this.state.selectedIndex].buttons,
      templateName: this.props.templates[this.state.selectedIndex].name,
      templateArguments: this.state.templateArguments,
      selectedIndex: this.state.selectedIndex
    }, this.props.edit)
  }

  closeModal() {
    if (!this.state.edited) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
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
              :
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
              <div style={{textAlign: 'center', display: 'flex'}}>
                <textarea disabled={this.state.sendingTemplate} rows='5' id='templateText' onChange={this.onTextChange} value={this.state.templateMessage}  className='form-control m-messenger__form-input' style={{resize: 'none', width: '95%', marginTop: '10px', borderRadius: '5px'}} maxLength='200' />
                { !this.state.isTemplateValid &&
                <div style={{marginTop: '25px', marginLeft: '5px'}}>
                  <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='templateWarning'>
                    <span>Message template format cannot be changed</span>
                  </UncontrolledTooltip>
                  <i id='templateWarning' className='flaticon-exclamation m--font-danger'/>
                </div>
                }
              </div>
              <p style={{fontSize: '12px', marginTop: '5px'}}>{'Each variable "{{x}}" can be replaced with text that contains letters, digits, special characters or spaces.'}</p>
            </div>
          </div>
          <div className='col-1'>
            <div style={{ minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)' }} />
          </div>
          <div className='col-5'>
            <h4 style={{ marginLeft: '-50px' }}>Preview:</h4>
            <div className='ui-block' style={{ overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '68vh', maxHeight: '68vh', marginLeft: '-50px' }} >
              <div className='discussion' style={{ display: 'inline-block', marginTop: '50px', paddingLeft: '10px', paddingRight: '10px' }} >
                <div style={{ maxWidth: '100%', fontSize: '15px', textAlign: 'justify', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} className='bubble recipient'>{this.state.templateMessage}</div>
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
                  <button disabled={(this.props.sendingToNewNumber && !this.state.isPhoneNumberValid) || !this.state.isTemplateValid || this.state.sendingTemplate} className='btn btn-primary' onClick={this.sendTemplate}>
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
                  <button disabled={!this.state.isTemplateValid} className='btn btn-primary' onClick={this.addComponent}>
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

MessageTemplate.propTypes = {
  'sendTemplate': PropTypes.func.isRequired,
  'closeTemplates': PropTypes.func.isRequired
}
export default MessageTemplate
