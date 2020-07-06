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
    this.addToBulkAction = this.addToBulkAction.bind(this)
    this.markSessionsRead = this.markSessionsRead.bind(this)
    this.selectAllSessions = this.selectAllSessions.bind(this)
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

  addToBulkAction (e, session) {
    let showingBulkActions = this.props.showingBulkActions
    let selected = this.props.selected
    if (e.target.checked) {
      session.selected = true
      selected.push(session)
      showingBulkActions = true
    } else {
      session.selected = false
      let selectedIndex = selected.findIndex(s => s._id === session._id)
      selected.splice(selectedIndex, 1)
      if (selected.length === 0) {
        showingBulkActions = false
      }
      this.props.updateState({allSelected: false})
    }
    this.props.updateState({showingBulkActions, selected})
  }

  markSessionsRead () {
    this.props.markSessionsRead(this.props.selected)
    this.props.updateState({
      selected: [],
      showingBulkActions: false,
      allSelected: false
    })
    for (let i = 0; i < this.props.sessions.length; i++) {
      this.props.sessions[i].selected = false
    }
  }

  selectAllSessions (e) {
    if (e.target.checked) {
      let selected = this.props.selected
      for (let i = 0; i < this.props.sessions.length; i++) {
        if (!this.props.sessions[i].selected) {
          this.props.sessions[i].selected = true
          selected.push(this.props.sessions[i])
        }
      }
      this.props.updateState({selected, showingBulkActions: true, allSelected: true})
    } else {
      for (let i = 0; i < this.props.sessions.length; i++) {
        this.props.sessions[i].selected = false
      }
      this.props.updateState({selected: [], showingBulkActions: false, allSelected: false})
    }
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
              showingBulkActions={this.props.showingBulkActions}
              markSessionsRead={this.markSessionsRead}
          />
          <div style={{padding: '0rem 2.2rem'}}>
            <ul className='nav nav-tabs m-tabs-line' role='tablist'>
              {
                this.props.markSessionsRead &&
                <li style={{   
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '30px'
                }}>
                  <input checked={this.props.allSelected} onChange={this.selectAllSessions} type='checkbox' />
                </li>
              }
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
                          addToBulkAction={this.addToBulkAction}
                          showingBulkActions={this.props.showingBulkActions}
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
