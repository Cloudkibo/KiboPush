/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { fetchSessions } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import ChatBox from './chatbox'
import Sessions from './sessions'
import Profile from './profile'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSessionId: '',
      currentProfile: {},
    }
    this.changeActiveSession = this.changeActiveSession.bind(this)
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

  componentWillMount(){
    console.log("Fetch Sessions")
  }

  changeActiveSession (sessionid, subscriber) {
    console.log('active session updated')
    this.setState({activeSessionId: sessionid, currentProfile: subscriber})
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
  }

  render () {
    console.log('sessions: ', this.props.sessions)
    console.log('currentProfile: ', this.state.currentProfile)
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
              <Sessions changeActiveSession={this.changeActiveSession} />
            </div>
            {
              this.props.sessions && (
                this.state.activeSessionId === ''
                ? <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                  <ChatBox sessionid={(this.props.sessions[0]) ? this.props.sessions[0]._id : 0} />
                </div>
                : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                  <ChatBox sessionid={this.state.activeSessionId} />
                </div>
              )
            }
            {
              this.props.sessions && (
                this.state.activeSessionId === ''
                ? <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                  <Profile sessionid={(this.props.sessions[0]) ? this.props.sessions[0]._id : 0} profile={(!this.state.currentProfile && this.props.sessions.length > 0) ? this.props.sessions[0].subscriber_id : this.state.currentProfile} />
                </div>
                : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                  <Profile sessionid={this.state.activeSessionId} profile={(!this.state.currentProfile && this.props.sessions.length > 0) ? this.props.sessions[0].subscriber_id : this.state.currentProfile} />
                </div>
              )
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
    sessions: (state.liveChat.sessions),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSessions: fetchSessions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
