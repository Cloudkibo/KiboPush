import React from 'react'
import PropTypes from 'prop-types'

// Components
import CONFIRMATIONMODAL from '../../extras/confirmationModal'

class ProfileHeader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
    this.unassignTeam = this.unassignTeam.bind(this)
    this.unassignAgent = this.unassignAgent.bind(this)
    this.unSubscribe = this.unSubscribe.bind(this)
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this)
  }

  unassignAgent() {
    let data = {
      agentId: this.props.activeSession.assigned_to.id,
      agentName: this.props.activeSession.assigned_to.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: false
    }
    this.props.assignToAgent(data)
    if (this.props.activeSession.assigned_to.id !== this.props.user._id) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been unassigned from you.`,
        category: { type: 'chat_session', id: this.props.activeSession._id },
        agentIds: [this.props.activeSession.assigned_to.id],
        companyId: this.props.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  unassignTeam() {
    let data = {
      teamId: this.props.activeSession.assigned_to.id,
      teamName: this.props.activeSession.assigned_to.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: false
    }
    this.props.fetchTeamAgents(this.props.activeSession.assigned_to.id)
    this.props.assignToTeam(data)
  }

  unSubscribe() {
    this.props.unSubscribe({ subscriber_id: this.props.activeSession._id, page_id: this.props.activeSession.pageId._id }, this.handleUnsubscribe)
  }

  handleUnsubscribe (res) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Unsubscribed successfully')
      this.props.changeActiveSession('none')
    } else {
      this.props.alertMsg.error('Unable to unsubscribe subscriber')
    }
  }

  render() {
    console.log('state in profile header', this.state)
    return (
      <div>
        <div className='m-card-profile__pic'>
          <div className='m-card-profile__pic-wrapper'>
            <img onError={(e) => this.props.profilePicError(e, this.props.activeSession)} style={{ width: '80px', height: '80px' }} src={this.props.activeSession.profilePic} alt='' />
          </div>
        </div>
        <div className='m-card-profile__details'>
          <span className='m-card-profile__name'>
            {this.props.activeSession.name}
          </span>
          {
            this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
            <span className='m-card-profile__email m-link' data-toggle="modal" data-target="#_unsubscribe" style={{ color: '#716aca', cursor: 'pointer' }}>
              (Unsubscribe)
            </span>
          }
          <br />
          <span className='m-card-profile__email m-link'>
            {
              (this.props.activeSession.gender && this.props.activeSession.locale) &&
                this.props.activeSession.gender + ', ' + this.props.activeSession.locale
            }
          </span>
          <br />
          {
            this.props.user.isSuperUser && this.props.activeSession.customerId &&
            <a href='#/' style={{ color: 'white' }}
              onClick={() => {
                window.open(`http://demoapp.cloudkibo.com/${this.props.activeSession.customerId}`, '_blank', 'fullscreen=yes')
              }}
              className='btn m-btn--pill    btn-primary'
            >
              <i className='fa fa-external-link' /> View Customer Details
            </a>
          }
          <br />
          <div>
            <span className='m--font-bolder'>Status:</span>
            <span> {this.props.activeSession.is_assigned ? 'Assigned' : 'Not assigned'}</span>
          </div>

          {
            this.props.activeSession.is_assigned &&
            <div style={{ marginBottom: '20px' }}>
              <div>
                <span className='m--font-bolder'>{this.props.activeSession.assigned_to.type === 'team' ? 'Team:' : 'Agent:'}</span>
                <span> {this.props.activeSession.assigned_to.name}</span>
              </div>
            </div>
          }

          {
            this.props.activeSession.is_assigned &&
            (
              this.props.activeSession.assigned_to.type === 'team'
                ? <div>
                  <button style={{ marginTop: '10px' }} className='btn btn-primary' onClick={this.unassignTeam}>Unassign Team</button>
                  <br />
                  <br />
                </div>
                : <div>
                  <button style={{ marginTop: '10px' }} className='btn btn-primary' onClick={this.unassignAgent}>Unassign Agent</button>
                  <br />
                  <br />
                </div>
            )
          }
        </div>

        <CONFIRMATIONMODAL
          id='_unsubscribe'
          title='Unsubscribe'
          description='Are you sure you want to Unsubscribe this Subscriber?'
          onConfirm={this.unSubscribe}
        />

      </div>
    )
  }
}

ProfileHeader.propTypes = {
  'unSubscribe': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'user': PropTypes.object.isRequired,
  'profilePicError': PropTypes.func.isRequired
}

export default ProfileHeader
