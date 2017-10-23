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
import { fetchSessions, fetchUserChats } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import ChatBox from './chatbox'
import Sessions from './sessions'
import Profile from './profile'
import Halogen from 'halogen'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSession: '',
      currentProfile: {},
      loading: true
    }
    props.fetchSessions({ company_id: this.props.user._id })
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

  componentWillMount () {
    console.log('Fetch Sessions')
  }

  changeActiveSession (session, subscriber) {
    console.log('active session updated')
    this.props.fetchUserChats(session._id)
    this.setState({activeSession: session, currentProfile: subscriber})
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.sessions) {
      this.setState({loading: false})
    }
    if (nextProps.socketSession) {
      console.log("New Message Received at following session id", nextProps.socketSession)
      if(this.props.userChat && this.props.userChat.length > 0 && nextProps.socketSession !== '' && this.props.userChat[0].session_id === nextProps.socketSession){
          this.props.fetchUserChats(nextProps.socketSession)
      }
    }
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
            {
              this.state.loading
              ? <div style={{position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em'}}
                className='align-center'>
                <center><Halogen.RingLoader color='#FF5E3A' /></center>
              </div>
              : (this.props.sessions && this.props.sessions.length === 0
              ? <div className='col-xl-12 col-lg-12 col-md-4 col-sm-12 col-xs-12'>
                <h3>Right now you dont have any chat sessions</h3>
              </div>
              : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                <Sessions changeActiveSession={this.changeActiveSession} />
              </div>
              )
            }
            {
              this.props.sessions && this.props.sessions.length > 0 && (
                this.state.activeSession === ''
                  ? <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                    <ChatBox session={this.props.sessions[0]} />
                  </div>
                  : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                    <ChatBox session={this.state.activeSession} />
                  </div>
              )
            }
            {
              this.props.sessions && this.props.sessions.length > 0 && (
                this.state.activeSession === ''
                  ? <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                    <Profile session={this.props.sessions[0]} profile={(this.props.sessions[0] && Object.keys(this.state.currentProfile).length === 0) ? this.props.sessions[0].subscriber_id : this.state.currentProfile} />
                  </div>
                  : <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                    <Profile session={this.state.activeSession} profile={(this.props.sessions[0] && Object.keys(this.state.currentProfile).length === 0) ? this.props.sessions[0].subscriber_id : this.state.currentProfile} />
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
    user: (state.basicInfo.user),
    socketSession: (state.liveChat.socketSession),
    userChat: (state.liveChat.userChat),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSessions: fetchSessions,
    fetchUserChats: fetchUserChats
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
