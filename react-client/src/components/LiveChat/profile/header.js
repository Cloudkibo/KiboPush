import React from 'react'
import PropTypes from 'prop-types'
import {localeCodeToEnglish} from '../../../utility/utils'

// Components
import CONFIRMATIONMODAL from '../../extras/confirmationModal'

class ProfileHeader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      editName: false,
      name: this.props.activeSession.name,
      savingName: false
    }
    this.unSubscribe = this.unSubscribe.bind(this)
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this)
    this.onEditName = this.onEditName.bind(this)
    this.onCancelEditName = this.onCancelEditName.bind(this)
    this.onSaveName = this.onSaveName.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.activeSession) {
      this.setState({name: nextProps.activeSession.name, savingName: false, editName: false})
    }
  }

  onNameChange (e) {
    this.setState({name: e.target.value})
  }

  onEditName () {
    this.setState({editName: true}, () => {
      document.getElementById('_edit_name').focus()
    })
  }

  onCancelEditName () {
    this.setState({editName: false, name: this.props.activeSession.name})
  }

  onSaveName () {
    if (this.state.name === '') {
      this.props.alertMsg.error('Subscriber name cannot be empty')
    } else {
      this.setState({savingName: true})
      if (this.props.user.platform === 'whatsApp') {
        this.props.editSubscriberWhatsApp(this.props.activeSession._id, {name: this.state.name}, this.props.alertMsg)
      } else if (this.props.user.platform === 'sms') {
        this.props.editSubscriberSms(this.props.activeSession._id, {name: this.state.name}, this.props.alertMsg)
      }
    }
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
          {
            this.props.user.platform === 'whatsApp' ?
            <span>
              <input
                id='_edit_name'
                style={{
                  border: !this.state.editName && 'none',
                  color: '#575962',
                  textAlign: 'center',
                  background: !this.state.editName && 'none',
                  boxShadow: !this.state.editName && 'none',
                  textOverFlow: 'ellipsis'
                }}
                className='form-control m-input m-card-profile__name'
                type='text'
                value={this.state.name}
                onChange={this.onNameChange}
                readOnly={!this.state.editName}
                disabled={this.state.savingName}
              />
              {
                this.state.editName
                ? <span>
                  <button disabled={this.state.savingName} style={{border: 'none'}} onClick={this.onSaveName} className="m-portlet__nav-link btn m-btn m-btn--hover-success m-btn--icon m-btn--icon-only m-btn--pill" title="Save">
                    {
                      this.state.savingName
                      ? <div className="m-loader" style={{width: "30px"}} />
                      : <i className="la la-check" />
                    }
                  </button>
                  {
                    !this.state.savingName &&
                    <button style={{border: 'none'}} onClick={this.onCancelEditName} className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Cancel">
                      <i className="la la-close" />
                    </button>
                  }
                </span>
                : <span>
                  <button style={{border: 'none'}} onClick={this.onEditName} className="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">
                    <i className="la la-edit" />
                  </button>
                </span>
              }
              <br />
            </span> :
            <span className='m-card-profile__name'>{this.props.activeSession.name}</span>
          }
          {
            this.props.showUnsubscribe && this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
            <span className='m-card-profile__email m-link' data-toggle="modal" data-target="#_unsubscribe" style={{ color: '#716aca', cursor: 'pointer' }}>
              (Block User)
            </span>
          }
          <br />
          {
              (this.props.activeSession.number) && (this.props.activeSession.name !== this.props.activeSession.number) &&
              <div>
                <span style={{pointerEvents: 'none'}} className='m-card-profile__email m-link'>
                  {this.props.activeSession.number}
                </span>
              </div>
          }
          {
            (this.props.activeSession.gender) &&
              <div>
                <span style={{pointerEvents: 'none'}} className='m-card-profile__email m-link'>
                  {this.props.activeSession.gender}
                </span>
              </div>
          }
          {
              (this.props.activeSession.locale) &&
              <div>
                <span style={{pointerEvents: 'none'}} className='m-card-profile__email m-link'>
                  {localeCodeToEnglish(this.props.activeSession.locale)}
                </span>
              </div>
          }
          <br />
          {
            this.props.user.isSuperUser && this.props.activeSession.customerId &&
            <div>
              <a href='#/' style={{ color: 'white' }}
                onClick={() => {
                  window.open(`http://demoapp.cloudkibo.com/${this.props.activeSession.customerId}`, '_blank', 'fullscreen=yes')
                }}
                className='btn m-btn--pill btn-primary'
              >
              <i className='fa fa-external-link' /> View Customer Details
              </a>
            </div>
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
