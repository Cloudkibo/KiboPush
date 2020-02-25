import React from 'react'
import PropTypes from 'prop-types'

// components
import SESSIONITEM from './item'
import HEADER from './header'


import { RingLoader } from 'halogenium'

class Sessions extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div style={{padding: '0px', border: '1px solid #F2F3F8'}} className='col-xl-4'>
        <div style={{marginBottom: '0px'}} className='m-portlet' >
          <HEADER
              pages={this.props.pages ? this.props.pages : []}
              removeFilters={this.props.removeFilters}
              updateFilterSort={this.props.updateFilterSort}
              updateFilterPage={this.props.updateFilterPage}
              updateFilterSearch={this.props.updateFilterSearch}
              updateFilterPending={this.props.updateFilterPending}
              updateFilterUnread={this.props.updateFilterUnread}
              filterSort={this.props.filterSort}
              filterPage={this.props.filterPage}
              filterSearch={this.props.filterSearch}
              filterPending={this.props.filterPending}
              filterUnread={this.props.filterUnread}
          />
          <div style={{padding: '0rem 2.2rem'}}>
            <ul className='nav nav-tabs m-tabs-line' role='tablist'>
              <li className='nav-item m-tabs__item'>
                <a href='#/' className={`nav-link m-tabs__link ${this.props.tabValue === 'open' ? 'active' : ''}`} data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.props.changeTab('open')}>
                  Open
                </a>
              </li>
              <li className='nav-item m-tabs__item'>
                <a href='#/' className={`nav-link m-tabs__link ${this.props.tabValue === 'closed' ? 'active' : ''}`} data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={() => this.props.changeTab('closed')}>
                  Closed
                </a>
              </li>
            </ul>
          </div>
          <div style={{height: '525px', overflowY: 'scroll', padding: '0rem'}} className='m-portlet__body'>
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
  'changeTab': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'profilePicError': PropTypes.func.isRequired,
  'changeStatus': PropTypes.func.isRequired
}

export default Sessions
