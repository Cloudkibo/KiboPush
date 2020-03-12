import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const styles = {
  sessionStyle: {
    cursor: 'pointer',
    padding: '1rem'
  },
  activeSessionStyle: {
    cursor: 'pointer',
    backgroundColor: '#f0f1f4',
    padding: '1rem'
  }
}

class SessionItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showingQuickAction: false
    }

    this.showQuickAction = this.showQuickAction.bind(this)
    this.hideQuickAction = this.hideQuickAction.bind(this)
    this.getChatPreview = this.getChatPreview.bind(this)
  }

  showQuickAction (e) {
    this.setState({showingQuickAction: true})
  }

  hideQuickAction (e) {
    this.setState({showingQuickAction: false})
  }

  getChatPreview () {
    const chatPreview = this.props.getChatPreview(this.props.session.lastPayload, this.props.session.lastRepliedBy, this.props.session.firstName)
    if (chatPreview.length > 25) {
      return `${chatPreview.substring(0, 25)}...`
    } else {
      return chatPreview
    }
  }

  render () {
    return (
      <div key={this.props.session._id}>
        <div
          style={(this.props.session._id === this.props.activeSession._id) ? styles.activeSessionStyle : styles.sessionStyle}
          onMouseEnter={this.showQuickAction}
          onMouseLeave={this.hideQuickAction}
          onClick={() => this.props.changeActiveSession(this.props.session)}
          className='m-widget4__item'
        >
          <div className='m-widget4__img m-widget4__img--pic'>
            <img onError={(e) => this.props.profilePicError(e, this.props.session)} style={{width: '56px', height: '56px'}} src={this.props.session.profilePic} alt='' />
          </div>
          <div className='m-widget4__info'>
            <div style={{marginBottom: '-10px'}} className='row'>
              <div
                style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
                className={this.state.showingQuickAction ? 'col-10' : 'col-9'}
              >
                <span className='m-widget4__title'>
                  <span style={{marginRight: '5px'}}>
                    {this.props.session.name}
                  </span>
                </span>
              </div>
              {
                this.state.showingQuickAction
                ? <div className='col-2'>
                  <span title={this.props.session.status === 'new' ? 'Mark as resolved' : 'Reopen session'}>
                  {
                    this.props.session.status === 'new'
                    ? <i
                      id={'resolve_session'+this.props.session._id}
                      style={{marginRight: '10px', cursor: 'pointer', color: '#34bfa3', fontSize: '20px', fontWeight: 'bold'}}
                      onClick={(e) => {
                        e.stopPropagation()
                        this.props.changeStatus('resolved', this.props.session)
                      }}
                      data-tip='Mark as done'
                      className='la la-check'
                    />
                    : <i
                      id={'reopen_session'+this.props.session._id}
                      style={{ marginLeft: '10px', cursor: 'pointer', color: '#34bfa3', fontSize: '20px', fontWeight: 'bold' }}
                      data-tip='Reopen'
                      onClick={(e) => {
                        e.stopPropagation()
                        this.props.changeStatus('new', this.props.session)
                      }}
                      className='fa fa-envelope-open-o'
                    />
                  }
                  </span>
                </div>
                : <div style={{paddingLeft: '0px'}} className='col-3'>
                  {
                    (this.props.session.unreadCount && this.props.session.unreadCount > 0)
                    ? <a href='#/' style={{backgroundColor: '#d9534f', color: '#fff', fontSize: '0.7em', marginRight: '2px', pointerEvents: 'none'}} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-danger'>
                      {this.props.session.unreadCount}
                    </a>
                    : this.props.session.pendingResponse &&
                    <span className='m-badge m-badge--metal m-badge--wide'>
                      pending
                    </span>
                  }
                </div>
              }
            </div>
            <br />
            <span className={`m-widget4__sub ${(this.props.session.unreadCount && this.props.session.unreadCount > 0) && 'm--font-boldest'}`}>
              {
                this.props.session.lastPayload
                ? this.getChatPreview()
                : 'No chat preview is available'
              }
            </span>
            <br />
            {
              this.props.showPageInfo ?
              <span className={`m-widget4__sub ${(this.props.session.unreadCount && this.props.session.unreadCount > 0) && 'm--font-boldest'}`}>
                <i className='fa fa-facebook-square' />&nbsp;&nbsp;
                {(this.props.session.pageId.pageName.length > 10) ? this.props.session.pageId.pageName.slice(0, 10) + '...' : this.props.session.pageId.pageName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <i className='fa fa-calendar' />&nbsp;&nbsp;
                {
                  this.props.session.last_activity_time &&
                  moment(this.props.session.last_activity_time).fromNow()
                }
              </span>
              : <span className={`m-widget4__sub ${(this.props.session.unreadCount && this.props.session.unreadCount > 0) && 'm--font-boldest'}`}>
                <i className='fa fa-calendar' />&nbsp;&nbsp;
                {
                  this.props.session.last_activity_time &&
                  moment(this.props.session.last_activity_time).fromNow()
                }
              </span>
            }
            <br />
          </div>
        </div>
      </div>
    )
  }
}

SessionItem.propTypes = {
  'session': PropTypes.object.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'profilePicError': PropTypes.func.isRequired,
  'changeStatus': PropTypes.func.isRequired,
  'showPageInfo': PropTypes.bool.isRequired
}

export default SessionItem
