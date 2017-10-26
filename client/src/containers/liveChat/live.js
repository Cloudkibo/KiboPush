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
import { fetchSessions, fetchSingleSession, fetchUserChats, resetSocket } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import ChatBox from './chatbox'
import Sessions from './sessions'
import Profile from './profile'
import Halogen from 'halogen'
import Notification from 'react-web-notification'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSession: '',
      currentProfile: {},
      loading: true,
      ignore: true
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
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    if(!this.state.ignore){
      this.setState({ignore: true})
    }
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

    if (nextProps.socketSession !== '' && nextProps.socketSession !== this.props.socketSession) {
      this.setState({ignore: false, body: 'You got a new message from ' + nextProps.socketData.name + " : " + nextProps.socketData.text})
    }

    if (nextProps.socketSession) {
      console.log('New Message Received at following session id', nextProps.socketSession)
      console.log('New Message data', nextProps.socketData)
      if (this.props.userChat && this.props.userChat.length > 0 && nextProps.socketSession !== '' && this.props.userChat[0].session_id === nextProps.socketSession) {
        this.props.fetchUserChats(nextProps.socketSession)
      } else if (nextProps.socketSession !== '') {
        var isPresent = false
        this.props.sessions.map((sess) => {
          if (sess._id === nextProps.socketSession) {
            isPresent = true
          }
        })

        if (isPresent) {
          console.log('Session exists ignoring the message')
          if (nextProps.socketSession !== this.state.activeSession._id) {
            console.log('updating unread count')
            this.props.fetchSingleSession(nextProps.socketSession, this.props.sessions)
          }
          this.props.resetSocket()
        } else {
          console.log('New Session Detected, initiating session fetch')
          this.props.fetchSessions({ company_id: this.props.user._id })
        }
      }
    }
  }

  handleNotificationOnShow () {
    this.setState({ignore: true})
  }

  onNotificationClick(){
     window.focus();
     console.log("Notificaation was clicked")
     this.setState({ignore: true})
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

        <Notification
          ignore={this.state.ignore}
          title={'New Message'}
          onShow={this.handleNotificationOnShow.bind(this)}
          onClick={this.onNotificationClick.bind(this)}
          options={{
            body: this.state.body,
            lang: 'en',
            dir: 'ltr',
            icon: 'icons/text.png',
          }}
        />

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
                <Sessions activeSession={this.state.activeSession === '' ? this.props.sessions[0] : this.state.activeSession} changeActiveSession={this.changeActiveSession} />
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
    socketData: (state.liveChat.socketData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSessions: fetchSessions,
    fetchUserChats: fetchUserChats,
    resetSocket: resetSocket,
    fetchSingleSession: fetchSingleSession
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
