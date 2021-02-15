import React from 'react'
import PropTypes from 'prop-types'

class PauseChatbot extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      chatbotPaused: this.props.activeSession.chatbotPaused
    }
    this.pauseChatbot = this.pauseChatbot.bind(this)
  }
  pauseChatbot (e) {
    let payload = {
      subscriberId: this.props.activeSession._id,
      chatbotPaused: e.target.checked
    }
    this.props.pauseChatbot(payload, (res) => {
      if (res.status === 'success') {
        console.log('updated chatbot paused')
      } else {
        console.log('unable to update chatbot paused')
      }
    })
  }
  render () {
    return (
      <div className='row'>
      <span className='col-12'>
          <div className='m-form__group form-group row'>
          <span className='col-7 col-form-label'>
             Pause Chatbot
          </span>
          <div className='col-3'>
              <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
              <label>
                  <input type='checkbox' data-switch='true' checked={this.props.activeSession.chatbotPaused} onChange={this.pauseChatbot} />
                  <span></span>
              </label>
              </span>
          </div>
          </div>
      </span>
  `</div>
    )
  }
}

PauseChatbot.propTypes = {
    'activeSession': PropTypes.object.isRequired,
    'pauseChatbot': PropTypes.func.isRequired
  }
  
  export default PauseChatbot
