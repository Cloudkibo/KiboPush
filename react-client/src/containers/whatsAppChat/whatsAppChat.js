import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { Link } from 'react-router'
// actions
import {
  fetchOpenSessions,
  fetchCloseSessions,
  fetchChat,
  markRead
} from '../../redux/actions/whatsAppChat.actions'
import AlertContainer from 'react-alert'
import INFO from '../../components/LiveChat/info.js'
import Halogen from 'halogen'

// Components
//import SESSIONSAREA from './sessionsArea.js'
import SESSIONSAREA from '../../components/LiveChat/sessionsArea.js'
import PROFILEAREA from './profileArea.js'
import CHATAREA from './chatArea.js'

const CHATMODULE= 'WHATSAPP'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      activeSession: {},
      scroll: true,
      tagOptions: [],
      loading: false,
      status: 'Unresolved'
    }
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.fetchSessions = this.fetchSessions.bind(this)
    this.disableScroll = this.disableScroll.bind(this)
    this.updateUnreadCount = this.updateUnreadCount.bind(this)
    this.showSearch = this.showSearch.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
  }
  componentWillMount () {
    this.fetchSessions({first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter_criteria: {sort_value: -1, search_value: '', pendingResponse: false, unreadCount: false}
    })
  }
  showSearch () {

  }
  changeStatus () {
    this.setState({status: 'Resolved'})
  }
  disableScroll () {
    this.setState({scroll: false})
  }

  changeActiveSession (session) {
    console.log('in changeActiveSession', session)
    this.setState({activeSession: session, scroll: true})
    this.props.fetchChat(session._id, {page: 'first', number: 25})
    this.props.markRead(session._id, this.props.sessions)
  }

  fetchSessions (data, type) {
    if (type === 'open') {
      this.props.fetchOpenSessions(data)
    } else if (type === 'close') {
      this.props.fetchCloseSessions(data)
    } else {
      this.props.fetchOpenSessions(data)
      this.props.fetchCloseSessions(data)
    }
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Live Chat`
  }

  componentWillReceiveProps (nextProps) {
    console.log('in componentWillReceiveProps of whatsAppChat', nextProps)
    if (nextProps.sessions && nextProps.sessions.length > 0 && Object.keys(this.state.activeSession).length === 0 && this.state.activeSession.constructor === Object) {
      this.setState({loading: false, activeSession: nextProps.sessions[0]})
    }
  }

  updateUnreadCount () {
  /*  console.log('out unread count mark', this.props.sessions)
    this.props.sessions.filter(session => {
      if (session._id === this.state.activeSession._id) {
        delete session.unreadCount
        console.log('unread count mark', this.props.sessions)
        this.forceUpdate()
      }
    })*/
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('State in WhatsApp chat', this.state)
    return (
    <div className='m-grid__item m-grid__item--fluid m-wrapper'>
      <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.loading
            ? <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
              className='align-center'>
              <center><Halogen.RingLoader color='#716aca' /></center>
            </div>
            : <div className='m-content'>
              <INFO module={CHATMODULE} />
              {
                (this.props.contacts && this.props.contacts.length > 0) /*|| (Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object)*/
                ? <div className='row'>
                  <SESSIONSAREA
                    openSessions={this.props.openSessions ? this.props.openSessions: []}
                    closeSessions={this.props.closeSessions ? this.props.closeSessions: []}
                    openCount={this.props.openCount ? this.props.openCount: 0}
                    closeCount={this.props.closeCount ? this.props.closeCount: 0}
                    pages={this.props.pages ? this.props.pages: []}
                    fetchSessions={this.fetchSessions}
                    user={this.props.user}
                    activeSession={this.state.activeSession}
                    changeActiveSession={this.changeActiveSession}
                    module={CHATMODULE}
                  />
                  {
                    Object.keys(this.state.activeSession).length === 0 && this.state.activeSession.constructor === Object &&
                    <div className='col-xl-8'>
                      <div className='m-portlet m-portlet--full-height'>
                        <div style={{textAlign: 'center'}} className='m-portlet__body'>
                          <p>Please select a session to view its chat.</p>
                        </div>
                      </div>
                    </div>
                  }
                  {
                    Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object &&
                    <CHATAREA
                      activeSession={this.state.activeSession}
                      showSearch={this.showSearch}
                      changeStatus={this.changeStatus}
                      changeActiveSession={this.changeActiveSession}
                      user={this.props.user}
                      sessions={this.props.sessions ? this.props.sessions: []}
                      disableScroll={this.disableScroll}
                      updateUnreadCount={this.updateUnreadCount}
                    />
                  }
                  {
                    Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object &&
                    <PROFILEAREA
                      activeSession={this.state.activeSession}
                      changeActiveSession={this.changeActiveSession}
                      user={this.props.user}
                    />
                }
                </div>
                : <p>No data to display</p>
              }
              </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('props in live chat', state)
  return {
    openSessions: (state.whatsAppChatInfo.openSessions),
    openCount: (state.whatsAppChatInfo.openCount),
    closeCount: (state.whatsAppChatInfo.closeCount),
    closeSessions: (state.whatsAppChatInfo.closeSessions),
    chat: (state.whatsAppChatInfo.chat),
    chatCount: (state.whatsAppChatInfo.chatCount),
    user: (state.basicInfo.user),
    contacts: (state.contactsInfo.contacts),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchOpenSessions,
    fetchChat,
    markRead,
    fetchCloseSessions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
