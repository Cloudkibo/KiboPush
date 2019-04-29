import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { Link } from 'react-router'
// actions
import {
  fetchSessions,
  fetchChat,
  markRead
} from '../../redux/actions/whatsAppChat.actions'

// Components
import SESSIONSAREA from './sessionsArea.js'
import PROFILEAREA from './profileArea.js'
import CHATAREA from './chatArea.js'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      activeSession: {},
      scroll: true,
      tagOptions: []
    }

    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.fetchSessions = this.fetchSessions.bind(this)
    this.disableScroll = this.disableScroll.bind(this)
    this.updateUnreadCount = this.updateUnreadCount.bind(this)

    props.fetchSessions({first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter_criteria: {sort_value: -1, search_value: ''}
    })
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
    this.props.fetchSessions(data)
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
    console.log('out unread count mark', this.props.sessions)
    this.props.sessions.filter(session => {
      if (session._id === this.state.activeSession._id) {
        delete session.unreadCount
        console.log('unread count mark', this.props.sessions)
        this.forceUpdate()
      }
    })
  }

  render () {
    console.log('State in live chat', this.state)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding livechat? Here is the <a href='https://kibopush.com/twilio/' target='_blank'>documentation</a>.
            </div>
          </div>
          {
            (this.props.sessions && this.props.sessions.length > 0) || (Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object)
            ? <div className='row'>
              <SESSIONSAREA
                sessions={this.props.sessions}
                count={this.props.count}
                activeSession={this.state.activeSession}
                changeActiveSession={this.changeActiveSession}
                fetchSessions={this.fetchSessions}
                user={this.props.user}
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
                  changeActiveSession={this.changeActiveSession}
                  user={this.props.user}
                  sessions={this.props.sessions}
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('props in live chat', state)
  return {
    sessions: (state.whatsAppChatInfo.sessions),
    count: (state.whatsAppChatInfo.count),
    chat: (state.whatsAppChatInfo.chat),
    chatCount: (state.whatsAppChatInfo.chatCount),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSessions,
    fetchChat,
    markRead
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
