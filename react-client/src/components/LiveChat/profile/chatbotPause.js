import React from 'react'
import PropTypes from 'prop-types'

class PauseChatbot extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {

    }
    this.unPauseChatbot = this.unPauseChatbot.bind(this)
  }
  unPauseChatbot (e) {
    let payload = {
      subscriberId: this.props.activeSession._id,
      chatbotPaused: false
    }
    this.props.pauseChatbot(payload, (res) => {
      if (res.status === 'success') {
        if (this.props.sessions && this.props.updateState) {
          let sessions = this.props.sessions
          let session = this.props.activeSession
          let index = sessions.findIndex((s) => s._id === session._id)
          sessions.splice(index, 1)
          this.props.updateState({
            reducer: true,
            sessions: [session, ...sessions]
          })
        }
      } else {
        console.log('unable to update chatbot paused')
      }
    })
  }
  render () {
    return (
      <div className='row'>
        <span className='col-12' style={{textAlign: 'center'}}> 
          { this.props.activeSession.chatbotPaused &&
          <button type="button" class="btn m-btn--pill m-btn--air btn-outline-danger" onClick={this.unPauseChatbot}>
            <span className='la la-power-off' /> Unpause Chatbot 
          </button>
          }
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
