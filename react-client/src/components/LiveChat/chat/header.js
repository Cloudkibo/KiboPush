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
        {
          this.props.isMobile &&
          <button
            className="btn btn-secondary m-btn m-btn--icon m-btn--icon-only"
            onClick={this.props.backToSessions}
            style={{border: 'none'}}
          >
            <i
              style={{color: '#212529', fontSize: '25px', marginRight: '5px'}}
              className='la la-arrow-left'
            />
          </button>
        }
        <button style={{ backgroundColor: 'white', pointerEvents: 'none' }} className='btn'>
          {this.props.activeSession.name}
        </button>
        <div style={{ float: 'right' }}>
          {
            this.props.activeSession.pendingResponse
            ? <button
              className="btn btn-secondary m-btn m-btn--icon m-btn--icon-only"
              data-target='#_remove-pending-response'
              data-toggle='modal'
              data-tip='Remove Pending Flag'
              style={{border: 'none'}}
            >
              <i
                style={{color: '#212529', fontSize: '25px', marginRight: '5px'}}
                className='la la-user-times'
              />
            </button>
            : <button
              className="btn btn-secondary m-btn m-btn--icon m-btn--icon-only"
              onClick={() => this.props.handlePendingResponse(this.props.activeSession, true)}
              data-tip='Add Pending Flag'
              style={{border: 'none'}}
            >
              <i
                style={{color: '#212529', fontSize: '25px', marginRight: '5px'}}
                className='la la-user-plus'
              />
            </button>
          }
          {
            !this.props.isMobile &&
            <button
              className="btn btn-secondary m-btn m-btn--icon m-btn--icon-only"
              onClick={this.props.showSearch}
              data-tip='Search'
              style={{border: 'none'}}
            >
              <i
                style={{ color: '#212529', fontSize: '25px', marginRight: '5px' }}
                className='la la-search'
              />
            </button>
          }
          {
            this.props.activeSession.status === 'new'
            ? <button
              className="btn btn-secondary m-btn m-btn--icon m-btn--icon-only"
              data-target="#_resolve-chat-session"
              data-toggle='modal'
              data-tip='Mark as done'
              style={{border: 'none'}}
            >
              <i
                style={{ color: '#34bfa3', fontSize: '25px', fontWeight: 'bold' }}
                className='la la-check'
              />
            </button>
            : <button
              className="btn btn-secondary m-btn m-btn--icon m-btn--icon-only"
              onClick={() => {this.props.changeStatus('new', this.props.activeSession)}}
              data-tip='Reopen'
              style={{border: 'none'}}
            >
              <i
                style={{ color: '#34bfa3', fontSize: '25px', fontWeight: 'bold' }}
                className='fa fa-envelope-open-o'
              />
            </button>
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
  'handlePendingResponse': PropTypes.func.isRequired,
  'isMobile': PropTypes.bool.isRequired,
  'backToSessions': PropTypes.func.isRequired
}

export default Header
