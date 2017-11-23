/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { fetchSessions, fetchSingleSession, fetchUserChats, resetSocket } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import ChatBox from './chatbox'
// import Sessions from './sessions'
import Profile from './profile'
// import Halogen from 'halogen'
// import Notification from 'react-web-notification'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSession: '',
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
    addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Live Chat'
    if (!this.state.ignore) {
      this.setState({ignore: true})
    }
  }

  componentWillMount () {
    console.log('Fetch Sessions')
  }

  changeActiveSession (session) {
    console.log('active session updated')
    this.props.fetchUserChats(session._id)
    this.setState({activeSession: session})
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    this.setState({ignore: true})

    if (nextProps.sessions) {
      this.setState({loading: false})
      this.setState({activeSession: nextProps.sessions[0]})
    }

    if (nextProps.socketSession !== '' && nextProps.socketSession !== this.props.socketSession) {
      this.setState({ignore: false, body: 'You got a new message from ' + nextProps.socketData.name + ' : ' + nextProps.socketData.text})
    }

    if (nextProps.socketSession && nextProps.socketSession !== '') {
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

  onNotificationClick () {
    window.focus()
    console.log('Notificaation was clicked')
    this.setState({ignore: true})
  }

  render () {
    console.log('sessions: ', this.props.sessions)
    console.log('currentProfile: ', this.state.currentProfile)
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Live Chat</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                this.props.sessions && this.props.sessions.length > 0
                ? <div className='row'>
                  <div className='col-xl-3'>
                    <div className='m-portlet m-portlet--full-height' >
                      <div className='m-portlet__head'>
                        <div className='m-portlet__head-caption'>
                          <div className='m-portlet__head-title'>
                            <h3 className='m-portlet__head-text'>
                              Sessions
                            </h3>
                          </div>
                        </div>
                        <div className='m-portlet__head-tools'>
                          <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                            <li className='nav-item m-tabs__item'>
                              <a className='nav-link m-tabs__link active' data-toggle='tab' href='#m_widget4_tab1_content' role='tab'>
                                Today
                              </a>
                            </li>
                            <li className='nav-item m-tabs__item'>
                              <a className='nav-link m-tabs__link' data-toggle='tab' href='#m_widget4_tab2_content' role='tab'>
                                Month
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className='m-portlet__body'>
                        <div className='tab-content'>
                          <div className='tab-pane active' id='m_widget4_tab1_content'>
                            <div className='m-widget4'>
                              {
                                this.props.sessions.map((session) => (
                                  <div key={session._id} style={{cursor: 'pointer'}} onClick={this.changeActiveSession(session)} className='m-widget4__item'>
                                    <div className='m-widget4__img m-widget4__img--pic'>
                                      <img src={session.subscriber_id.profilePic} alt='' />
                                    </div>
                                    <div className='m-widget4__info'>
                                      <span className='m-widget4__title'>
                                        {session.subscriber_id.firstName + ' ' + session.subscriber_id.lastName}
                                      </span>
                                      <br />
                                      <span className='m-widget4__sub'>
                                        {session.page_id.pageName}
                                      </span>
                                    </div>
                                    <div className='m-widget4__ext'>
                                      {
                                        session.unreadCount &&
                                        <a className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-danger'>
                                          {session.unreadCount}
                                        </a>
                                      }
                                    </div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChatBox currentSession={this.state.activeSession} />
                  <Profile currentSession={this.state.activeSession} />
                </div>
                : <div className='col-xl-12'>
                  <h3>Right now you dont have any chat sessions</h3>
                </div>
              }
            </div>
          </div>
        </div>
        {/**
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
      **/}
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
