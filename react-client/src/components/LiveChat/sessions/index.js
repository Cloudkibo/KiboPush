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
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  onLoadMore () {
    const lastId = this.props.sessions[this.props.sessions.length - 1].last_activity_time
    this.props.fetchSessions(false, lastId)
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
              showPageInfo={this.props.showPageInfo}
          />
          <div style={{padding: '0rem 2.2rem'}}>
            <ul className='nav nav-tabs m-tabs-line' role='tablist'>
              <li className='nav-item m-tabs__item'>
                <span className={`nav-link m-tabs__link ${this.props.tabValue === 'open' ? 'active' : ''}`} data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.props.changeTab('open')}>
                  Open
                </span>
              </li>
              <li className='nav-item m-tabs__item'>
                <span className={`nav-link m-tabs__link ${this.props.tabValue === 'close' ? 'active' : ''}`} data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.props.changeTab('close')}>
                  Closed
                </span>
              </li>
            </ul>
          </div>
          <div style={{overflowY: 'scroll', overflowX: 'hidden', height: '68vh', padding: '0rem'}} className='m-portlet__body'>
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
                          key={index}
                          session={session}
                          activeSession={this.props.activeSession}
                          changeActiveSession={this.props.changeActiveSession}
                          profilePicError={this.props.profilePicError}
                          changeStatus={this.props.changeStatus}
                          getChatPreview={this.props.getChatPreview}
                          showPageInfo={this.props.showPageInfo}
                        />
                      ))
                      : <p style={{marginLeft: '30px'}}>No data to display</p>
                    }
                    {
                      this.props.sessionsCount > 0 &&
                      this.props.sessionsCount > this.props.sessions.length &&
                      <center style={{marginBottom: '15px'}}>
                        <i className='fa fa-refresh' style={{color: '#716aca'}} />&nbsp;
                        <button
                          id='load-more-chat-sessions'
                          className='m-link'
                          style={{
                            color: '#716aca',
                            cursor: 'pointer',
                            marginTop: '20px',
                            border: 'none'
                          }}
                          onClick={this.onLoadMore}
                        >
                          Load More
                        </button>
                      </center>
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
  'changeTab': PropTypes.func.isRequired,
  'fetchSessions': PropTypes.func.isRequired,
  'getChatPreview': PropTypes.func.isRequired
}

Sessions.defaultProps = {
  showPageInfo: true
}

export default Sessions
