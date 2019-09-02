import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './sessionsAreaHead'
import BODY from './sessionsAreaBody'

class SessionsArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      tabValue: 'open',
      first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter: false,
      filter_criteria: {
        sort_value: -1,
        page_value: '',
        search_value: '',
        pendingResponse: '',
        unreadMessages: ''
      }
    }
    this.changeTab = this.changeTab.bind(this)
    this.updateState = this.updateState.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  changeTab (value) {
    if (value === 'open') {
      this.setState({tabValue: 'open'})
    } else {
      this.setState({tabValue: 'closed'})
    }
  }

  updateState (data) {
    this.setState(data)
  }

  loadMore (type) {
    this.props.fetchSessions({
      first_page: this.state.first_page,
      last_id: this.props.openSessions.length > 0 ? this.props.openSessions[this.props.openSessions.length - 1]._id : 'none',
      number_of_records: this.state.number_of_records,
      filter: this.state.filter,
      filter_criteria: {
        sort_value: this.state.sort_value,
        page_value: this.state.page_value,
        search_value: this.state.search_value,
        pendingResponse: this.state.pendingResponse,
        unreadMessages: this.state.unreadMessages
      }
    }, type)
  }

  render () {
    return (
      <div className='col-xl-4'>
        <div className='m-portlet m-portlet--full-height' >
          <HEADER
            openSessions={this.props.openSessions}
            closeSessions={this.props.closeSessions}
            pages={this.props.pages}
            fetchSessions={this.props.fetchSessions}
            updateState={this.updateState}
          />
          <div style={{padding: '0rem 2.2rem'}}>
            <ul className='nav nav-tabs m-tabs-line' role='tablist'>
              <li className='nav-item m-tabs__item'>
                <a className='nav-link m-tabs__link active' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('open')}>
                  Open
                </a>
              </li>
              <li className='nav-item m-tabs__item'>
                <a className='nav-link m-tabs__link' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('closed')}>
                  Closed
                </a>
              </li>
            </ul>
          </div>
          <BODY
            profilePicError={this.props.profilePicError}
            openSessions={this.props.openSessions}
            closeSessions={this.props.closeSessions}
            openCount={this.props.openCount}
            closeCount={this.props.closeCount}
            activeSession={this.props.activeSession}
            tabValue={this.state.tabValue}
            changeActiveSession={this.props.changeActiveSession}
            user={this.props.user}
            loadMore={this.loadMore}
          />
        </div>
      </div>
    )
  }
}

SessionsArea.propTypes = {
  'openSessions': PropTypes.array.isRequired,
  'closeSessions': PropTypes.array.isRequired,
  'openCount': PropTypes.number.isRequired,
  'closeCount': PropTypes.number.isRequired,
  'pages': PropTypes.array.isRequired,
  'fetchSessions': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired
}

export default SessionsArea
