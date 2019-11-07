import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import AlertContainer from 'react-alert'
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap'

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
      unreadCount: this.props.session.unreadCount !== 0 ? this.props.session.unreadCount : null,
      disabledValue: false,
      isShowingModal: false
    }
    this.changeStatus = this.changeStatus.bind(this)
    this.getDisabledValue = this.getDisabledValue.bind(this)
    this.handleAgentsForDisbaledValue = this.handleAgentsForDisbaledValue.bind(this)
    this.handleAgentsForReopen = this.handleAgentsForReopen.bind(this)
    this.handleAgentsForResolved = this.handleAgentsForResolved.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialog = this.showDialog.bind(this)
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }
  closeDialog () {
    this.setState({isShowingModal: false})
  }

  componentDidMount () {
    this.getDisabledValue()
  }

  handleAgentsForResolved (teamAgents) {
    let agentIds = []
    console.log('teamAgents', teamAgents)
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId._id !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId._id)
      }
    }
    console.log('agentIds', agentIds)
    if (agentIds.length > 0) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.session.firstName + ' ' + this.props.session.lastName} has been marked resolved by ${this.props.user.name}.`,
        category: {type: 'chat_session', id: this.props.session._id},
        agentIds: agentIds,
        companyId: this.props.session.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  handleAgentsForReopen (teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId._id !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId._id)
      }
    }
    if (agentIds.length > 0) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.session.firstName + ' ' + this.props.session.lastName} has been reopened by ${this.props.user.name}.`,
        category: {type: 'chat_session', id: this.props.session._id},
        agentIds: agentIds,
        companyId: this.props.session.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  handleAgentsForDisbaledValue (teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      agentIds.push(teamAgents[i].agentId._id)
    }
    if (!agentIds.includes(this.props.user._id)) {
      this.setState({disabledValue: true})
    }
  }

  getDisabledValue () {
    if (this.props.session.is_assigned) {
      if (this.props.session.assigned_to.type === 'agent' && this.props.session.assigned_to.id !== this.props.user._id) {
        this.setState({disabledValue: true})
      } else if (this.props.session.assigned_to.type === 'team') {
        this.props.fetchTeamAgents(this.props.session.assigned_to.id, this.handleAgentsForDisbaledValue)
      }
    }
  }

  changeStatus (e, status, id) {
    if (this.state.disabledValue && this.props.session.assigned_to.type === 'agent' && status === 'resolved') {
      this.msg.error('You can not resolve chat session. Only assigned agent can resolve it.')
    } else if (this.state.disabledValue && this.props.session.assigned_to.type === 'agent' && status === 'new') {
      this.msg.error('You can not reopen chat session. Only assigned agent can reopen it.')
    } else if (this.state.disabledValue && this.props.session.assigned_to.type === 'team' && status === 'resolved') {
      this.msg.error('You can not resolve chat session. Only agents who are part of assigned team can resolve chat session.')
    } else if (this.state.disabledValue && this.props.session.assigned_to.type === 'team' && status === 'new') {
      this.msg.error('You can not reopen chat session. Only agents who are part of assigned team can reopen chat session.')
    } else {
      this.props.changeStatus({_id: id, status: status}, this.props.changeActiveSessionFromChatbox)
      if (status === 'resolved' && this.props.session.is_assigned) {
        if (this.props.session.assigned_to.type === 'agent' && this.props.session.assigned_to.id !== this.props.user._id) {
          let notificationsData = {
            message: `Session of subscriber ${this.props.session.firstName + ' ' + this.props.session.lastName} has been marked resolved by ${this.props.user.name}.`,
            category: {type: 'chat_session', id: this.props.session._id},
            agentIds: [this.props.session.assigned_to.id],
            companyId: this.props.session.companyId
          }
          this.props.sendNotifications(notificationsData)
        } else if (this.props.session.assigned_to.type === 'team') {
          this.props.fetchTeamAgents(this.props.session.assigned_to.id, this.handleAgentsForResolved)
        }
      } else if (status === 'new' && this.props.session.is_assigned) {
        if (this.props.session.assigned_to.type === 'agent' && this.props.session.assigned_to.id !== this.props.user._id) {
          let notificationsData = {
            message: `Session of subscriber ${this.props.session.firstName + ' ' + this.props.session.lastName} has been reopened by ${this.props.user.name}.`,
            category: {type: 'chat_session', id: this.props.session._id},
            agentIds: [this.props.session.assigned_to.id],
            companyId: this.props.session.companyId
          }
          this.props.sendNotifications(notificationsData)
        } else if (this.props.session.assigned_to.type === 'team') {
          this.props.fetchTeamAgents(this.props.session.assigned_to.id, this.handleAgentsForReopen)
        }
      }
    }
  }

  componentWillReceiveProps () {
    this.setState({
      unreadCount: this.props.session.unreadCount !== 0 ? this.props.session.unreadCount : null,
    })
  }
  render () {
    let alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div key={this.props.session._id}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Popover placement='left' className='subscriberPopover' isOpen={this.state.isShowingModal} target='resolve_session' toggle={this.closeDialog}>
            <PopoverHeader><label>Resolve Chat Session</label></PopoverHeader>
            <PopoverBody>
              <div className='row' style={{ minWidth: '250px' }}>
                <div className='col-12'>
                  <p>Are you sure you want to resolve this chat session?</p>
                  <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={(e) => {
                    this.changeStatus(e, 'resolved', this.props.activeSession._id)
                    this.closeDialog()
                  }}>
                    Yes
                  </button>
                </div>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={this.closeDialog}>
                    No
                  </button>
                </div>
              </div>
                </div>
              </div>
            </PopoverBody>
          </Popover>
        <div style={this.props.session._id === (this.props.activeSession !== {} && this.props.activeSession._id) ? styles.activeSessionStyle : styles.sessionStyle} onClick={() => this.props.changeActiveSession(this.props.session)} className='m-widget4__item'>
          <div className='m-widget4__img m-widget4__img--pic'>
            <img onError={(e) => this.props.profilePicError(e, this.props.session)} style={{width: '56px', height: '56px'}} src={this.props.session.profilePic} alt='' />
          </div>
          <div className='m-widget4__info'>
            <span className='m-widget4__title'>
              {this.props.subscriberName}


              <div style={{display: 'inline-block'}}>
                {
                  (this.props.session.unreadCount && this.props.session.unreadCount > 0) ? 
                  <a style={{backgroundColor: '#d9534f', color: '#fff', fontSize: '0.7em'}} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-danger'>
                    {this.props.session.unreadCount}
                  </a>
                  : null
                }

                {
                  this.props.session.pendingResponse &&
                  <a style={{backgroundColor: '#c4c5d6', color: '#000000', fontSize: '0.7em'}} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                    pending
                  </a>
                }

                {
                  this.props.session.status === 'new'
                  ? 
                  <i  id='resolve_session' style={{cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold'}} onClick={this.showDialog} data-tip='Mark as done' className='la la-check' />
                  : 
                    <i id='resolve_session' style={{ marginLeft: '10px', cursor: 'pointer', color: '#34bfa3', fontSize: '20px', fontWeight: 'bold' }} data-tip='Reopen' onClick={(e) => {
                        this.changeStatus(e, 'new', this.props.session._id)}} className='fa fa-envelope-open-o' />
                }
              </div>
            </span>
            <br />
            {
              this.props.session.lastPayload && ((!this.props.session.lastPayload.componentType && this.props.session.lastPayload.text) || (this.props.session.lastPayload.componentType && this.props.session.lastPayload.componentType === 'text'))
              ? <span className='m-widget4__sub'>
                {
                  !this.props.session.lastRepliedBy
                  ? <span>{(this.props.session.lastPayload.text.length > 30) ? this.props.subscriberName.split(' ')[0] + ': ' + this.props.session.lastPayload.text.slice(0, 30) + '...' : this.props.subscriberName.split(' ')[0] + ': ' + this.props.session.lastPayload.text}</span>
                  : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
                  ? <span>You: {(this.props.session.lastPayload.text.length > 30) ? this.props.session.lastPayload.text.slice(0, 25) + '...' : this.props.session.lastPayload.text }</span>
                  : <span>{(this.props.session.lastPayload.text.length > 30) ? this.props.session.lastRepliedBy.name + ': ' + this.props.session.lastPayload.text.slice(0, 20) + '...' : this.props.session.lastRepliedBy.name + ': ' + this.props.session.lastPayload.text}</span>
                }
              </span>
              : this.props.session.lastPayload && this.props.session.lastPayload.componentType && this.props.session.lastPayload.componentType !== 'thumbsUp'
              ? <span className='m-widget4__sub'>
                {
                  (!this.props.session.lastRepliedBy || this.props.session.lastRepliedBy === null) && this.props.session.lastPayload
                  ? <span>{this.props.subscriberName.split(' ')[0]} sent {this.props.session.lastPayload.componentType}</span>
                  : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
                  ? <span>You sent {this.props.session.lastPayload.componentType}</span>
                  : <span>{this.props.session.lastRepliedBy.name} sent {this.props.session.lastPayload.componentType}</span>
                }
              </span>
              : this.props.session.lastPayload && this.props.session.lastPayload.attachments &&
              <span className='m-widget4__sub'>
                {
                  (!this.props.session.lastRepliedBy || this.props.session.lastRepliedBy === null) && this.props.session.lastPayload
                  ? <span>{this.props.subscriberName.split(' ')[0]} sent {this.props.session.lastPayload.attachments[0].type}</span>
                  : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
                  ? <span>You sent {this.props.session.lastPayload.attachments[0].type}</span>
                  : <span>{this.props.session.lastRepliedBy.name} sent {this.props.session.lastPayload.attachments[0].type}</span>
                }
              </span>
            }
            {
              this.props.session.lastPayload && this.props.session.lastPayload.componentType && this.props.session.lastPayload.componentType === 'thumbsUp' &&
              <span className='m-widget4__sub'>
                {
                  !this.props.session.lastRepliedBy || this.props.session.lastRepliedBy === null
                  ? <span>{this.props.subscriberName.split(' ')[0]}: <i className='fa fa-thumbs-o-up' /></span>
                  : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
                  ? <span> You: <i className='fa fa-thumbs-o-up' /></span>
                  : <span>{this.props.session.lastRepliedBy.name}: <i className='fa fa-thumbs-o-up' /></span>
                }
              </span>
            }
            <br />
            { this.props.session.pageId
            ? <span className='m-widget4__sub'>
              <i className='fa fa-facebook-square' />&nbsp;&nbsp;
              {(this.props.session.pageId.pageName.length > 10) ? this.props.session.pageId.pageName.slice(0, 10) + '...' : this.props.session.pageId.pageName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <i className='fa fa-calendar' />&nbsp;&nbsp;
              {
                this.props.session.last_activity_time &&
                moment(this.props.session.last_activity_time).fromNow()
              }
            </span>
            : <span className='m-widget4__sub'>
            {
              this.props.session.last_activity_time &&
              moment(this.props.session.last_activity_time).fromNow()
            }
            </span>
          }
          </div>
        </div>
      </div>
    )
  }
}

SessionItem.propTypes = {
  'session': PropTypes.object.isRequired,
  'subscriberName': PropTypes.string.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'changeStatus': PropTypes.func.isRequired
}

export default SessionItem
