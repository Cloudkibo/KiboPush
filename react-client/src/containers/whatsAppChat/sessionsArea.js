import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './sessionsAreaHead'
import BODY from './sessionsAreaBody'

class SessionsArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter: false,
      filter_criteria: {
        sort_value: -1,
        page_value: '',
        search_value: ''
      }
    }
    this.updateState = this.updateState.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  updateState (data) {
    this.setState(data)
  }

  loadMore (type) {
    this.props.fetchOpenSessions({
      first_page: this.state.first_page,
      last_id: this.props.openSessions.length > 0 ? this.props.openSessions[this.props.openSessions.length - 1]._id : 'none',
      number_of_records: this.state.number_of_records,
      filter: this.state.filter,
      pendingResponse: true,
      unreadCount: true,
      filter_criteria: {
        sort_value: this.state.sort_value,
        page_value: this.state.page_value,
        search_value: this.state.search_value,
        pendingResponse: true,
        unreadCount: true
      }
    }, type)
  }

  render () {
    return (
      <div className='col-xl-4'>
        <div className='m-portlet m-portlet--full-height' >
          <HEADER
            sessions={this.props.sessions}
            updateState={this.updateState}
            fetchSessions={this.props.fetchSessions}
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
            sessions={this.props.sessions}
            count={this.props.count}
            activeSession={this.props.activeSession}
            changeActiveSession={this.props.changeActiveSession}
            loadMore={this.loadMore}
            user={this.props.user}
          />
        </div>
      </div>
    )
  }
}

SessionsArea.propTypes = {
  'sessions': PropTypes.array.isRequired,
  'count': PropTypes.array.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'fetchSessions': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired
}

export default SessionsArea
