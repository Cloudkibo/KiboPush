import React from 'react'
import PropTypes from 'prop-types'
import {localeCodeToEnglish} from '../../../utility/utils'

// Components
import CONFIRMATIONMODAL from '../../extras/confirmationModal'

class ProfileHeader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
    this.unSubscribe = this.unSubscribe.bind(this)
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this)
  }


  unSubscribe() {
    this.props.unSubscribe({ subscriber_id: this.props.activeSession._id, page_id: this.props.activeSession.pageId._id }, this.handleUnsubscribe)
  }

  handleUnsubscribe (res) {
    if (res.status === 'success') {
      this.props.sendNotifications({
        message: `Subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been blocked by ${this.props.user.name}`,
        category: { type: 'unsubscribe', id: this.props.activeSession._id },
        agentIds: this.props.agents.length > 0 ? this.props.agents.filter(a => a._id !== this.props.user._id).map(b => b._id): [],
        companyId: this.props.activeSession.companyId
      })
      this.props.alertMsg.success('Unsubscribed successfully')
      this.props.updateState({activeSession: {}})
    } else {
      this.props.alertMsg.error('Unable to unsubscribe subscriber')
    }
  }

  render() {
    return (
      <div>
        <div className='m-card-profile__pic'>
          <div className='m-card-profile__pic-wrapper' style={{margin: '10px auto'}}>
            <img onError={(e) => this.props.profilePicError(e, this.props.activeSession)} style={{ width: '80px', height: '80px' }} src={this.props.activeSession.profilePic} alt='' />
          </div>
        </div>
        <div className='m-card-profile__details'>
          <span className='m-card-profile__name'>
            {this.props.activeSession.name}
          </span>
          {
            this.props.showUnsubscribe && this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
            <span className='m-card-profile__email m-link' data-toggle="modal" data-target="#_unsubscribe" style={{ color: '#716aca', cursor: 'pointer' }}>
              (Block User)
            </span>
          }
          <br />
          <span style={{pointerEvents: 'none'}} className='m-card-profile__email m-link'>
            {
              (this.props.activeSession.gender) &&
                this.props.activeSession.gender
            }
          </span>
          <br />
          <span style={{pointerEvents: 'none'}} className='m-card-profile__email m-link'>
            {
                (this.props.activeSession.locale) &&
                localeCodeToEnglish(this.props.activeSession.locale)
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
  'unSubscribe': PropTypes.func,
  'activeSession': PropTypes.object.isRequired,
  'user': PropTypes.object.isRequired,
  'profilePicError': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired,
  'showUnsubscribe': PropTypes.bool.isRequired
}

export default ProfileHeader
