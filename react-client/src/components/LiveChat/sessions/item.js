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
      showingQuickAction: false,
      showingCheckbox: false,
      checked: this.props.checked
    }

    this.showQuickAction = this.showQuickAction.bind(this)
    this.hideQuickAction = this.hideQuickAction.bind(this)
    this.getChatPreview = this.getChatPreview.bind(this)
    this.showCheckbox = this.showCheckbox.bind(this)
    this.hideCheckbox = this.hideCheckbox.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.showingBulkActions) {
      this.setState({showingQuickAction: false})
    }
    if (nextProps.checked) {
      this.setState({checked: true})
    } 
  }

  hideCheckbox (e) {
    this.setState({showingCheckbox: false})
  }

  showCheckbox (e) {
    this.setState({showingCheckbox: true})
  }

  showQuickAction (e) {
    if (!this.props.showingBulkActions) {
      this.setState({showingQuickAction: true}) 
    }
  }

  hideQuickAction (e) {
    if (!this.props.showingBulkActions) {
      this.setState({showingQuickAction: false})
    }
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
          onClick={(e) => this.props.changeActiveSession(this.props.session, e)}
          className='m-widget4__item'
        >
          <div 
            style={{
              minWidth: '50px', 
              minHeight: '50px', 
              width: '50px', 
              height: '50px', 
              textAlign: 'center'
            }}
            onMouseEnter={this.props.showingBulkActions ? this.showCheckbox : null}
            onMouseLeave={this.props.showingBulkActions ? this.hideCheckbox : null}
            className='m-widget4__img m-widget4__img--pic'>
              {
                !this.state.showingCheckbox && !this.props.showingBulkActions ? 
                <img 
                style={{width: 'inherit', height: 'inherit'}} onError={(e) => this.props.profilePicError(e, this.props.session)} src={this.props.session.profilePic} alt='' />
                : <input checked={this.props.session.selected} onChange={(e) => this.props.addToBulkAction(e, this.props.session)} type='checkbox' />
              }
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
                    : this.props.session.pendingResponse &&  this.props.session.status === 'new' && 
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
