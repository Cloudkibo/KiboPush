/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'
import PropTypes from 'prop-types'

class MessageTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      templateMessage: 'Hi {{1}}.\n\nThank you for contacting {{2}}.\n\nPlease choose from the options below to continue:',
      selectedRadio: 'contactReminder',
      buttons: [
        {title: 'Get in Touch'},
        {title: 'Explore Options'},
        {title: 'Speak to Support'}
      ],
      isTemplateValid: true,
      templateArguments: ''
    }
    this.resetTemplate = this.resetTemplate.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.validateTemplate = this.validateTemplate.bind(this)
    this.sendTemplate = this.sendTemplate.bind(this)
    this.updateChatData = this.updateChatData.bind(this)
  }

  resetTemplate () {
    this.setState({
      templateMessage: 'Hi {{1}}.\n\nThank you for contacting {{2}}.\n\nPlease choose from the options below to continue:',
      selectedRadio: 'contactReminder',
      isTemplateValid: true
    })
     /* eslint-disable */
     $('#templateText').removeClass('border border-danger')
     /* eslint-enable */
  }

  validateTemplate(msg) {
    var isValid= false
    var regex1 = new RegExp(/^Hi (.*).\n\nThank you for contacting (.*).\n\nPlease choose from the options below to continue:$/, 'i')
    var regex2 = new RegExp(/^Hello (.*)! Your (.*) account is ready to go! If you need help getting started you can:$/, 'i')
    var regex3 = new RegExp(/^Hi (.*),\nWelcome to (.*),\nYour account has been registered and you agree to receive messages on WhatsApp! A copy of your terms and conditions can be found here: (.*)\n\nBest$/, 'i')
    let templateArguments = ''
    if (this.state.selectedRadio === 'contactReminder') {
      isValid = regex1.test(msg)
      if (isValid) {
        templateArguments = regex1.exec(msg).slice(1).join(',')
      }
    }
    if (this.state.selectedRadio === 'signUpConfirmation') {
      isValid = regex2.test(msg)
      if (isValid) {
        templateArguments = regex2.exec(msg).slice(1).join(',')
      }
    }
    if (this.state.selectedRadio === 'registrationMessage') {
      isValid = regex3.test(msg)
      if (isValid) {
        templateArguments = regex3.exec(msg).slice(1).join(',')
      }
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
      templateMessage: e.currentTarget.value
    })
    this.validateTemplate(e.currentTarget.value)
  }
  handleRadioButton (e) {
    let textValue = ''
    let buttons = []
    if (e.currentTarget.value === 'contactReminder') {
      buttons = [
        {title: 'Get in Touch'},
        {title: 'Explore Options'},
        {title: 'Speak to Support'}
      ]
      textValue = 'Hi {{1}}.\n\nThank you for contacting {{2}}.\n\nPlease choose from the options below to continue:'
    } else if (e.currentTarget.value === 'signUpConfirmation') {
      buttons = [
        {title: 'Schedule Demo'},
        {title: 'Contact Support'},
        {title: 'Upgrade Plan'}
      ]
      textValue = 'Hello {{1}}! Your {{2}} account is ready to go! If you need help getting started you can:'
    } else if (e.currentTarget.value === 'registrationMessage') {
      textValue = 'Hi {{1}},\nWelcome to {{2}},\nYour account has been registered and you agree to receive messages on WhatsApp! A copy of your terms and conditions can be found here: {{3}}\n\nBest'
    }
    this.setState({
      selectedRadio: e.currentTarget.value,
      templateMessage: textValue,
      isTemplateValid: true,
      buttons
    })
    /* eslint-disable */
    $('#templateText').removeClass('border border-danger')
    /* eslint-enable */
  }

  sendTemplate () {
    let payload = {
      componentType: 'text',
      text: this.state.templateMessage,
      buttons: this.state.buttons,
      templateArguments: this.state.templateArguments,
      templateName: this.state.selectedRadio
    }
    let data = this.props.setMessageData(this.props.activeSession, payload)
    this.props.sendChatMessage(data)
    this.props.updateChatAreaHeight('57vh')
    data.format = 'convos'
    this.updateChatData(data, payload)
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
    this.props.updateNewMessage(true)
    this.props.updateState({
      reducer: true,
      userChat: [...this.props.userChat, data],
      sessions: [session, ...sessions]
    })
  }

  render () {
    return (
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="messageTemplate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content" style={{width: '60vw'}}>
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Message Templates
              </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" aria-label="Close" data-dismiss='modal'>
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{color: 'black'}} className="modal-body">



            <div className='row'>
            <div className='col-6' style={{ maxHeight: '65vh', overflowY: 'scroll' }}>
            <p>To send a message outside the 24 hours session window, use one of the following pre-approved templates</p>
              <div>
              <label>Select templates</label>
                <div className='radio-buttons' style={{marginLeft: '37px'}}>
                  <div className='radio'>
                    <input id='contactReminder'
                      type='radio'
                      value='contactReminder'
                      name='contactReminder'
                      onChange={this.handleRadioButton}
                      checked={this.state.selectedRadio === 'contactReminder'} />
                    <span><i style={{marginRight: '5px', color: '#e1e14078'}} className='fa fa-times fa-calendar' />Contact Reminder</span>
                  </div>
                  <div className='radio'>
                    <input id='signUpConfirmation'
                      type='radio'
                      value='signUpConfirmation'
                      name='signUpConfirmation'
                      onChange={this.handleRadioButton}
                      checked={this.state.selectedRadio === 'signUpConfirmation'} />
                    <span><i style={{marginRight: '5px', color: '#34bf9f'}} className='fa fa-times fa-truck' />Sign Up Confirmation</span>
                  </div>
                  <div className='radio'>
                    <input id='registrationMessage'
                      type='radio'
                      value='registrationMessage'
                      name='registrationMessage'
                      onChange={this.handleRadioButton}
                      checked={this.state.selectedRadio === 'registrationMessage'} />
                    <span><i style={{marginRight: '5px', color: '#5867ddb5'}} className='fa fa-times fa-commenting' />Registration Message</span>
                  </div>
                </div>
                <div style={{textAlign: 'center', display: 'flex'}}>
                  <textarea rows='8' id='templateText' onChange={this.onTextChange} value={this.state.templateMessage}  className='form-control m-messenger__form-input' style={{resize: 'none', width: '95%', marginTop: '25px', borderRadius: '5px'}} maxLength='200' />
                  { !this.state.isTemplateValid &&
                  <div style={{marginTop: '25px', marginLeft: '5px'}}>
                    <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} target='templateWarning'>
                      <span>Message template format cannot be changed</span>
                    </UncontrolledTooltip>
                    <i id='templateWarning' className='flaticon-exclamation m--font-danger'/>
                  </div>
                  }
                </div>
                <p style={{fontSize: '12px', marginTop: '5px'}}>Each variable 'x' can be replaced with the text that contains letters, digits, special characters or spaces</p>
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
                    this.state.buttons.map((button, index) => (
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
            </div>

            <div className='col-6' style={{ marginTop: '-5vh' }}>
              <div className='pull-right'>
              <div style={{ width: '100%', textAlign: 'right' }}>
                <div style={{ display: 'inline-block', padding: '5px' }}>
                  <button className='btn btn-secondary' onClick={this.resetTemplate}>
                    Reset
                    </button>
                </div>
                <div style={{ display: 'inline-block', padding: '5px' }}>
                  <button className='btn btn-secondary' data-dismiss='modal'>
                    Cancel
                    </button>
                </div>
                <div style={{ display: 'inline-block', padding: '5px' }}>
                  <button className='btn btn-primary' disabled={!this.state.isTemplateValid} onClick={() => { this.sendTemplate(this.state.templateMessage)}} data-dismiss='modal'>
                    Send
                  </button>
                </div>
              </div>

              </div>
            </div>
            </div>
          </div>
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
