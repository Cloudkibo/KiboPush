import React from 'react'
import PropTypes from 'prop-types'
import SESSIONITEM from './sessionItem.js'

class SessionsAreaBody extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.loadMoreOpen = this.loadMoreOpen.bind(this)
    this.loadMoreClose = this.loadMoreClose.bind(this)
  }

  loadMoreOpen () {
    this.props.loadMore('open')
  }

  loadMoreClose () {
    this.props.loadMore('close')
  }

  render () {
    console.log('close sessions in sessions area body', this.props.closeSessions)
    return (
      <div style={{height: '525px', overflowY: 'scroll', padding: '0rem'}} className='m-portlet__body'>
        <div className='tab-content'>
          {
            this.props.tabValue === 'open'
            ? <div className='tab-pane active' id='m_widget4_tab1_content'>
              <div className='m-widget4'>
                {
                  this.props.openSessions && this.props.openSessions.length > 0
                  ? (this.props.openSessions.map((session) => (
                    <SESSIONITEM
                      profilePicError={this.props.profilePicError}
                      session={session}
                      activeSession={this.props.activeSession}
                      changeActiveSession={this.props.changeActiveSession}
                      user={this.props.user}
                    />
                  )))
                  : <p style={{marginLeft: '30px'}}>No data to display</p>
                }
                {
                  this.props.openSessions.length < this.props.openCount &&
                  <center>
                    <i className='fa fa-refresh' style={{color: '#716aca'}} />&nbsp;
                    <a id='assignTag' className='m-link' style={{color: '#716aca', cursor: 'pointer', marginTop: '20px'}} onClick={this.loadMoreOpen}>Load More</a>
                  </center>
                }
              </div>
            </div>
            : <div className='tab-pane active' id='m_widget4_tab1_content'>
              <div className='m-widget4'>
                {
                  this.props.closeSessions && this.props.closeSessions.length > 0
                  ? (this.props.closeSessions.map((session) => (
                    <SESSIONITEM
                      session={session}
                      activeSession={this.props.activeSession}
                      changeActiveSession={this.props.changeActiveSession}
                      user={this.props.user}
                    />
                    )))
                  : <p style={{marginLeft: '30px'}}>No data to display</p>
                }
                {
                  this.props.closeSessions.length < this.props.closeCount &&
                  <center>
                    <i className='fa fa-refresh' style={{color: '#716aca'}} />&nbsp;
                    <a id='assignTag' className='m-link' style={{color: '#716aca', cursor: 'pointer', marginTop: '20px'}} onClick={this.loadMoreClose}>Load More</a>
                  </center>
                }
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

SessionsAreaBody.propTypes = {
  'openSessions': PropTypes.array.isRequired,
  'openCount': PropTypes.number.isRequired,
  'closeCount': PropTypes.number.isRequired,
  'closeSessions': PropTypes.array.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'tabValue': PropTypes.string.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'loadMore': PropTypes.func.isRequired
}

export default SessionsAreaBody
