import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { RingLoader } from 'halogenium'

// actions
import {
  fetchOpenSessions,
  fetchCloseSessions
} from '../../redux/actions/livechat.actions'

// components
import { INFO, SESSIONS } from '../../components/LiveChat'

const alertOptions = {
  offset: 14,
  position: 'top right',
  theme: 'dark',
  time: 5000,
  transition: 'scale'
}

class LiveChat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: true,
      tabValue: 'open',
      numberOfRecords: 25,
      filterSort: -1,
      filterPage: '',
      filterSearch: '',
      filterPending: false,
      filterUnread: false,
      sessions: [],
      sessionsCount: 0
    }

    this.fetchSessions = this.fetchSessions.bind(this)

    this.fetchSessions(true, 'none', true)
  }

  fetchSessions(firstPage, lastId, fetchBoth) {
    const data = {
      first_page: firstPage,
      last_id: lastId,
      number_of_records: this.state.numberOfRecords,
      filter: false,
      filter_criteria: {
        sort_value: this.state.filterSort,
        page_value: this.state.filterPage,
        search_value: this.state.filterSearch,
        pendingResponse: this.state.filterPending,
        unreadMessages: this.state.filterUnread
      }
    }
    if (fetchBoth) {
      this.props.fetchOpenSessions(data)
      this.props.fetchCloseSessions(data)
    } else if (this.state.tabValue === 'open') {
      this.props.fetchOpenSessions(data)
    } else if (this.state.tabValue === 'close') {
      this.props.fetchCloseSessions(data)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('UNSAFE_componentWillMount called in live chat')
    if (nextProps.openSessions || nextProps.closeSessions) {
      this.setState({loading: false})
      if (this.state.tabValue === 'open') {
        this.setState({sessions: nextProps.openSessions, sessionsCount: nextProps.openCount})
      } else if (this.state.tabValue === 'close') {
        this.setState({sessions: nextProps.closeSessions, sessionsCount: nextProps.closeCount})
      }
    }
  }

  render () {
    console.log('render in live chat')
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.alertMsg = a }} {...alertOptions} />
        {
          this.state.loading
          ? <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '30em',
              height: '18em',
              marginLeft: '-10em'
            }}
            className='align-center'
          >
            <center><RingLoader color='#716aca' /></center>
          </div>
          : <div className='m-content'>
            <INFO
              videoId='XUXc2ZD_lQY'
              showGuideline={true}
              clickHereLink='http://kibopush.com/livechat/'
            />
            {
              this.props.openCount > 0 || this.props.closeCount > 0
              ? <div className='row'>
                <SESSIONS
                  tabValue={this.state.tabValue}
                  sessions={this.state.sessions}
                  sessionsCount={this.state.sessionsCount}
                />
              </div>
              : <p>No data to display</p>
            }
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('mapStateToProps in live chat', state)
  return {
    openSessions: (state.liveChat.openSessions),
    openCount: (state.liveChat.openCount),
    closeCount: (state.liveChat.closeCount),
    closeSessions: (state.liveChat.closeSessions)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchOpenSessions,
    fetchCloseSessions
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
