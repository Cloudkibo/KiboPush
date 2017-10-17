/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { fetchSessions } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import ChatBox from './chatbox'
import Sessions from './sessions'
import Profile from './profile'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSessionId: ''
    }
    props.fetchSessions()
    this.changeActiveSession = this.changeActiveSession
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }

  changeActiveSession (sessionid) {
    this.setState({activeSessionId: sessionid})
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
              <Sessions changeActiveSession={this.changeActiveSession} />r
            </div>
            {
              this.state.activeSessionId === '' && this.props.sessions
              ? <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                <ChatBox sessionid={this.props.sessions[0]._id} />
              </div>
              : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                <ChatBox sessionid={this.state.activeSessionId} />
              </div>
            }
            {
              this.state.activeSessionId === '' && this.props.sessions
              ? <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                <Profile sessionid={this.props.sessions[0]._id} />
              </div>
              : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                <Profile sessionid={this.state.activeSessionId} />
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    sessions: (state.liveChat.sessions)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSessions: fetchSessions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
