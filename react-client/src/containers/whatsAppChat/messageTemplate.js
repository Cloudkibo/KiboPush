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
    let templates = [
      {
        name: 'contact_reminder',
        text: 'Hi {{1}}.\n\nThank you for contacting {{2}}.\n\nPlease choose from the options below to continue:',
        regex:  new RegExp(/^Hi (.*).\n\nThank you for contacting (.*).\n\nPlease choose from the options below to continue:$/, 'i'),
        buttons: [
          {title: 'Get in Touch'},
          {title: 'Explore Options'},
          {title: 'Speak to Support'}
        ],
        templateArguments: '{{1}},{{2}}'
      },
      {
        name: 'sign_up_confirmation',
        text: 'Hello {{1}}! Your {{2}} account is ready to go! If you need help getting started you can:',
        regex:  new RegExp(/^Hello (.*)! Your (.*) account is ready to go! If you need help getting started you can:$/, 'i'),
        buttons: [
          {title: 'Schedule Demo'},
          {title: 'Contact Support'},
          {title: 'Upgrade Plan'}
        ],
        templateArguments: '{{1}},{{2}}'
      },
      {
        name: 'issue_resolution',
        text: 'Hi {{1}},\nYour issue {{2}} has been resolved,\nPlease confirm by selecting one of the options below:',
        regex:  new RegExp(/^Hi (.*),\nYour issue (.*) has been resolved,\nPlease confirm by selecting one of the options below:$/, 'i'),
        buttons: [
          {title: 'It has been resolved'},
          {title: 'Still not working'}
        ],
        templateArguments: '{{1}},{{2}}'
      },
      {
        name: 'issue_update',
        text: 'Hi {{1}},\nWe are working on {{2}}. We will update you as soon as it is {{3}}.',
        regex:  new RegExp(/^Hi (.*),\n We are working on (.*). We will update you as soon as it is (.*).$/, 'i'),
        buttons: [],
        templateArguments: '{{1}},{{2}},{{3}}'
      }
    ]
    this.state = {
      templates,
      templateMessage: templates[0].text,
      isTemplateValid: true,
      templateArguments: templates[0].templateArguments,
      number: '',
      sendingTemplate: false,
      selectedIndex: 0
    }
    this.resetTemplate = this.resetTemplate.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.validateTemplate = this.validateTemplate.bind(this)
    this.sendTemplate = this.sendTemplate.bind(this)
    this._sendTemplate = this._sendTemplate.bind(this)
    this.updateChatData = this.updateChatData.bind(this)
    this.updateNumber = this.updateNumber.bind(this)
  }

  updateNumber (e) {
    this.setState({number: e.target.value})
  }

  resetTemplate () {
    this.setState({
      templateMessage: this.state.templates[0].text,
      templateArguments: this.state.templates[0].templateArguments,
      isTemplateValid: true,
      sendingTemplate: false,
      number: '',
      selectedIndex: 0
    })
     /* eslint-disable */
     $('#templateText').removeClass('border border-danger')
     /* eslint-enable */
  }

  validateTemplate(msg) {
    let regex = this.state.templates[this.state.selectedIndex].regex
    let templateArguments = this.state.templateArguments
    let isValid = regex.test(msg)
    if (isValid) {
      templateArguments = regex.exec(msg).slice(1).join(',')
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

  handleRadioButton (index) {
    this.setState({
      selectedIndex: index,
      isTemplateValid: true,
      templateArguments: this.state.templates[index].templateArguments,
      templateMessage: this.state.templates[index].text
    })
    /* eslint-disable */
    $('#templateText').removeClass('border border-danger')
    /* eslint-enable */
  }

  sendTemplate () {
    this.setState({sendingTemplate: true})
    if (this.props.sendingToNewNumber) {
      const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
      if (!this.state.number.match(regex)) {
        this.props.alertMsg.error('Invalid Number')
        return
      }
      this.props.createNewContact({
        number: this.state.number
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
      buttons: this.state.templates[this.state.selectedIndex].buttons,
      templateArguments: this.state.templateArguments,
      templateName: this.state.templates[this.state.selectedIndex].name
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

  render () {
    return (
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
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



            <div className='row'>
            <div className='col-6' style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
              {
                this.props.sendingToNewNumber ? 
                  <div id='_whatsapp_number' className='form-group m-form__group'>
                    <label className='control-label'>WhatsApp Number:</label>
                    <input disabled={this.state.sendingTemplate} className='form-control' value={this.state.number} onChange={(e) => this.updateNumber(e)} />
                  </div>
                :
                <p>To send a message outside the 24 hours session window, use one of the following pre-approved templates</p>
              }
           
              <div>
              <label>Select Template:</label>
                <div className='radio-buttons' style={{marginLeft: '37px'}}>
                  {
                    this.state.templates.map((template, index) => {
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
                  <textarea disabled={this.state.sendingTemplate} rows='7' id='templateText' onChange={this.onTextChange} value={this.state.templateMessage}  className='form-control m-messenger__form-input' style={{resize: 'none', width: '95%', marginTop: '25px', borderRadius: '5px'}} maxLength='200' />
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
                    this.state.templates[this.state.selectedIndex].buttons.map((button, index) => (
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
                  <button disabled={!this.state.isTemplateValid || this.state.sendingTemplate} className='btn btn-primary' onClick={() => { this.sendTemplate(this.state.templateMessage)}}>
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
