import React from 'react'
import PropTypes from 'prop-types'

// components
import SESSIONITEM from './item'
import HEADER from './header'

class Sessions extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.removeFilters = this.removeFilters.bind(this)
    this.updateFilterPage = this.updateFilterPage.bind(this)
    this.updateFilterSort = this.updateFilterSort.bind(this)
    this.updateFilterSearch = this.updateFilterSearch.bind(this)
    this.updateFilterPending = this.updateFilterPending.bind(this)
    this.updateFilterUnread = this.updateFilterUnread.bind(this)
    this.changeTab = this.changeTab.bind(this)
  }

  removeFilters () {
    this.props.updateState({
      filterPage: '',
      filterSearch: '',
      filterPending: false,
      filterUnread: false,
      sessionsLoading: true
    }, () => {
      this.props.fetchSessions(true, 'none')
    })
  }

  updateFilterPage (filterPage) {
    this.props.updateState({filterPage, sessionsLoading: true}, () => {
      this.props.fetchSessions(true, 'none')
    })
  }

  updateFilterSort (filterSort) {
    this.props.updateState({filterSort, sessionsLoading: true}, () => {
      this.props.fetchSessions(true, 'none')
    })
  }

  updateFilterSearch (value) {
    this.props.updateState({filterSearch: value, sessionsLoading: true}, () => {
      this.props.fetchSessions(true, 'none')
    })
  }

  updateFilterPending (filterPending) {
    this.props.updateState({filterPending, sessionsLoading: true}, () => {
      this.props.fetchSessions(true, 'none')
    })
  }

  updateFilterUnread (filterUnread) {
    this.props.updateState({filterUnread, sessionsLoading: true}, () => {
      this.props.fetchSessions(true, 'none')
    })
  }

  changeTab (value) {
    this.porps.updateState({
      tabValue: value,
      sessions: value === 'open' ? this.props.openSessions : this.props.closeSessions,
      sessionsCount: value === 'open' ? this.props.openCount : this.props.closeCount,
      userChat: [],
      activeSession: {}
    })
  }

  render() {
    return (
      <div style={{padding: '0px', border: '1px solid #F2F3F8'}} className='col-xl-4'>
        <div style={{overflow: 'hidden', marginBottom: '0px'}} className='m-portlet' >
          <HEADER
              pages={this.props.pages ? this.props.pages : []}
              removeFilters={this.removeFilters}
              updateFilterSort={this.updateFilterSort}
              updateFilterPage={this.updateFilterPage}
              updateFilterSearch={this.updateFilterSearch}
              updateFilterPending={this.updateFilterPending}
              updateFilterUnread={this.updateFilterUnread}
              filterSort={this.props.filterSort}
              filterPage={this.props.filterPage}
              filterSearch={this.props.filterSearch}
              filterPending={this.props.filterPending}
              filterUnread={this.props.filterUnread}
          />
          <div style={{padding: '0rem 2.2rem'}}>
            <ul className='nav nav-tabs m-tabs-line' role='tablist'>
              <li className='nav-item m-tabs__item'>
                <a href='#/' className={`nav-link m-tabs__link ${this.props.tabValue === 'open' ? 'active' : ''}`} data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('open')}>
                  Open
                </a>
              </li>
              <li className='nav-item m-tabs__item'>
                <a href='#/' className={`nav-link m-tabs__link ${this.props.tabValue === 'closed' ? 'active' : ''}`} data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.changeTab('closed')}>
                  Closed
                </a>
              </li>
            </ul>
          </div>
          <div style={{overflowY: 'scroll', height: '67vh', padding: '0rem'}} className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active' id='m_widget4_tab1_content'>
                {
                  this.props.loading
                  ?
                  <div className='align-center'>
                    <center>
                      <div className="m-loader" style={{width: "30px", display: "inline-block"}}></div>
                      <span>Loading...</span>
                    </center>
                  </div>
                  :
                  <div className='m-widget4'>
                    {
                      this.props.sessionsCount > 0
                      ? this.props.sessions.map((session, index) => (
                        <SESSIONITEM
                          session={session}
                          activeSession={this.props.activeSession}
                          changeActiveSession={this.props.changeActiveSession}
                          profilePicError={this.props.profilePicError}
                          changeStatus={this.props.changeStatus}
                          getChatPreview={this.props.getChatPreview}
                        />
                      ))
                      : <p style={{marginLeft: '30px'}}>No data to display</p>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Sessions.propTypes = {
  'sessions': PropTypes.array.isRequired,
  'sessionsCount': PropTypes.number.isRequired,
  'tabValue': PropTypes.string.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'profilePicError': PropTypes.func.isRequired,
  'changeStatus': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired,
  'fetchSessions': PropTypes.func.isRequired,
  'getChatPreview': PropTypes.func.isRequired
}

export default Sessions
