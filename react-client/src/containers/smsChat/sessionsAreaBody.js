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
    return (
      <div style={{height: '525px', overflowY: 'scroll', padding: '0rem'}} className='m-portlet__body'>
        <div className='tab-content'>
          <div className='tab-pane active' id='m_widget4_tab1_content'>
            <div className='m-widget4'>
              {
                this.props.sessions && this.props.sessions.length > 0
                ? (this.props.sessions.map((session) => (
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
                this.props.sessions.length < this.props.count &&
                <center>
                  <i className='fa fa-refresh' style={{color: '#716aca'}} />&nbsp;
                  <a href='#/' id='assignTag' className='m-link' style={{color: '#716aca', cursor: 'pointer', marginTop: '20px'}} onClick={this.loadMoreClose}>Load More</a>
                </center>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SessionsAreaBody.propTypes = {
  'sessions': PropTypes.array.isRequired,
  'count': PropTypes.number.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'tabValue': PropTypes.string.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'loadMore': PropTypes.func.isRequired
}

export default SessionsAreaBody
