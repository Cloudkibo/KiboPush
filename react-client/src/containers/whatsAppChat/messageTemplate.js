/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class MessageTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      templateMessage: 'Your {{1}} appointment is coming up on {{2}}',
      selectedRadio: 'appointmentReminders'
    }
    this.resetTemplate = this.resetTemplate.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
  }

  resetTemplate () {
    this.setState({
      templateMessage: 'Your {{1}} appointment is coming up on {{2}}',
      selectedRadio: 'appointmentReminders'
    })
  }
  onTextChange (e) {
    this.setState({
      templateMessage: e.value
    })
  }
  handleRadioButton (e) {
    var textValue = ''
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value == 'appointmentReminders') {
      textValue = 'Your {{1}} appointment is coming up on {{2}}'
    } else if (e.currentTarget.value == 'orderNotification') {
      textValue = 'Your {{1}} order of {{2}} has shipped and should be delivered on {{3}}. Details : {{4}}'
    } else if (e.currentTarget.value == 'verificationCodes') {
      textValue = 'Your {{1}} code is {{2}}'
    }
    this.setState({
      templateMessage: textValue
    })
  }

  render () {
    return (
      <div> 
        <h3>Message templates</h3>
        <p>To send a message outside the 24 hours session window, use one of the following pre-approved templates</p>
        <div>
        <label>Select templates</label>
          <div className='radio-buttons' style={{marginLeft: '37px'}}>
            <div className='radio'>
              <input id='appointmentReminders'
                type='radio'
                value='appointmentReminders'
                name='appointmentReminders'
                onChange={this.handleRadioButton}
                checked={this.state.selectedRadio === 'appointmentReminders'} />
              <span><i style={{marginRight: '5px', color: '#e1e14078'}} className='fa fa-times fa-calendar' />Appointment Reminders</span>
            </div>
            <div className='radio'>
              <input id='orderNotification'
                type='radio'
                value='orderNotification'
                name='orderNotification'
                onChange={this.handleRadioButton}
                checked={this.state.selectedRadio === 'orderNotification'} />
              <span><i style={{marginRight: '5px', color: '#34bf9f'}} className='fa fa-times fa-truck' />Order Notification</span>
            </div>
            <div className='radio'>
              <input id='verificationCodes'
                type='radio'
                value='verificationCodes'
                name='verificationCodes'
                onChange={this.handleRadioButton}
                checked={this.state.selectedRadio === 'verificationCodes'} />
              <span><i style={{marginRight: '5px', color: '#5867ddb5'}} className='fa fa-times fa-commenting' />Verification Codes</span>
            </div>
          </div>
          <textarea onChange={this.onTextChange} value={this.state.templateMessage} className='form-control'  className='m-messenger__form-input' style={{resize: 'none', width: '100%', marginTop: '25px', borderRadius: '5px'}} rows='5' maxLength='200' />
          <p>Each variable 'x' can be replaced with the text that contains letters, digits, special characters or spaces</p>
        </div>
        <div style={{ width: '100%', textAlign: 'right' }}>
          <div style={{ display: 'inline-block', padding: '5px' }}>
            <button className='btn btn-secondary' onClick={this.resetTemplate}>
              Reset
              </button>
          </div>
          <div style={{ display: 'inline-block', padding: '5px' }}>
            <button className='btn btn-secondary' onClick={this.props.closeTemplates}>
              Cancel
              </button>
          </div>
          <div style={{ display: 'inline-block', padding: '5px' }}>
            <button className='btn btn-primary' onClick={() => { this.props.sendTemplate(this.state.templateMessage)}}>
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default MessageTemplate

