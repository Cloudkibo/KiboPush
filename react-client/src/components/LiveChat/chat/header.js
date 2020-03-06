import React from 'react'
import PropTypes from 'prop-types'

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render() {
    return (
      <div style={{ padding: '1.3rem', borderBottom: '1px solid #ebedf2' }}>
        <button style={{ backgroundColor: 'white', pointerEvents: 'none' }} className='btn'>
          {this.props.activeSession.name}
        </button>
        <div style={{ float: 'right' }}>
          {
            this.props.activeSession.pendingResponse
            ? <i
              style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}}
              data-target='#_remove-pending-response'
              data-toggle='modal'
              data-tip='Remove Pending Flag'
              className='la la-user-times'
            />
            : <i
              style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}}
              onClick={() => this.props.handlePendingResponse(this.props.activeSession, true)}
              data-tip='Add Pending Flag'
              className='la la-user-plus'
            />
          }
          <i style={{ cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px' }} onClick={this.props.showSearch} data-tip='Search' className='la la-search' />
          {
            this.props.activeSession.status === 'new'
            ? <i
              style={{ cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold' }}
              data-tip='Mark as done'
              className='la la-check'
              data-toggle="modal"
              data-target="#_resolve-chat-session"
            />
            : <i
              style={{ cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold' }}
              data-tip='Reopen'
              onClick={() => {this.props.changeStatus('new', this.props.activeSession)}}
              className='fa fa-envelope-open-o'
            />
          }
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  'activeSession': PropTypes.object.isRequired,
  'showSearch': PropTypes.func.isRequired,
  'changeStatus': PropTypes.func.isRequired,
  'handlePendingResponse': PropTypes.func.isRequired
}

export default Header
