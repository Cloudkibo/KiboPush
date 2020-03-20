/* eslint-disable no-return-assign */
/**
 * Created by imran on 26/12/2017.
 */

import React from 'react'

class WhatsAppDeleteModal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      password: ''
    }
    this.onPasswordChange = this.onPasswordChange.bind(this)
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({password: ''})
  }
  onPasswordChange(e) {
    this.setState({ password: e.target.value })
  }
  render () {
    return (
      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="disconnectWhatsApp" ref='disconnectWhatsApp' tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
          <div className="modal-content">
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {this.props.type} WhatsApp Twilio Account
              </h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div style={{ color: 'black' }} className="modal-body">
              <p>Are you sure you want to {this.props.type} your WhatsApp Twilio Account? Doing so will be remove all of your subscribers, their chat history and the broadcasts you have created.</p>
              <br />
              <div id='question' className='form-group m-form__group'>
                <span className='control-label'>If you wish to proceed, please enter your password below:</span>
                <input className='form-control' type='password' placeholder='Enter password here'
                  value={this.state.password} onChange={this.onPasswordChange} />
              </div>
              <button style={{ float: 'right' }}
                className='btn btn-primary btn-sm'
                disabled={this.state.password === ''}
                onClick={() => {
                  this.props.deleteWhatsApp(this.props.type, this.state.password)
                }}>Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WhatsAppDeleteModal
