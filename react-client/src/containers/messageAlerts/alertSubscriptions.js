import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { validateEmail } from '../../utility/utils'

import SUBSCRIPTIONITEM from './subscriptionItem'

const MessengerPlugin = require('react-messenger-plugin').default

class AlertSubscriptions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      agents: [],
      selectedAgent: '',
      name: '',
      email: '',
      emailError: false
    }

    this.setAgents = this.setAgents.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onAddAgent = this.onAddAgent.bind(this)
    this.onRemoveAgent = this.onRemoveAgent.bind(this)
    this.onAddEmail = this.onAddEmail.bind(this)
  }

  componentDidMount () {
    if (this.props.channel === 'notification' &&
        this.props.members && this.props.members.length > 0) {
      this.setAgents(this.props)
    }
  }

  setAgents (props) {
    let members = []
    if (props.subscriptions.length > 0) {
      const agentIds = props.subscriptions.map((item) => item.channelId)
      members = props.members.filter((item) => !agentIds.includes(item.userId._id))
    } else {
      members = props.members
    }
    const agents = members.map((item) => {
      return {
        label: item.userId.name,
        value: item._id
      }
    })
    this.setState({agents})
  }

  onAgentChange (value, others) {
    this.setState({selectedAgent: value})
  }

  onNameChange (e) {
    if (e.target.value.length <= 30) {
      this.setState({name: e.target.value})
    }
  }

  onEmailChange (e) {
    if (e.target.value.length <= 30) {
      this.setState({email: e.target.value, emailError: false})
    }
  }

  onAddEmail () {
    const { email, name } = this.state
    if (validateEmail(email)) {
      const data = {
        name,
        profilePic: 'http://cdn.cloudkibo.com/public/img/default/default-user.jpg',
        channelId: email,
        channel: this.props.channel
      }
      this.props.addSubscription(data, () => {
        this.setState({name: '', email: '', emailError: false})
      })
    } else {
      this.setState({emailError: true})
    }
  }

  onAddAgent () {
    const member = this.props.members.find((item) => item._id === this.state.selectedAgent.value)
    const data = {
      name: this.state.selectedAgent.label,
      profilePic: member.userId.facebookInfo ? member.userId.facebookInfo.profilePic : 'http://cdn.cloudkibo.com/public/img/default/default-user.jpg',
      channelId: member.userId._id,
      channel: this.props.channel
    }
    this.props.addSubscription(data, () => {
      this.setState({selectedAgent: ''})
    })
  }

  onRemoveAgent (id, userId) {
    this.props.removeSubscription(id)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.channel === 'notification' &&
        nextProps.members && nextProps.members.length > 0) {
      this.setAgents(nextProps)
    }
  }

  render () {
    return (
      <div>
        {
          this.props.channel === 'notification' &&
          <>
            <div className='form-group m-form__group row'>
              <div className='col-lg-2 col-md-2 col-sm-12' />
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <Select
                  className='basic-single'
                  classNamePrefix='select'
                  isClearable={true}
                  isSearchable={true}
                  options={this.state.agents}
                  value={this.state.selectedAgent}
                  onChange={this.onAgentChange}
                />
              </div>
              <div className='col-lg-2 col-md-2 col-sm-12'>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.onAddAgent}
                  disabled={!this.state.selectedAgent}
                >
                  Add
                </button>
              </div>
              <div className='col-lg-2 col-md-2 col-sm-12' />
            </div>
            <div className='m--space-30' />
          </>
        }
        {
          this.props.channel === 'whatsapp' &&
          <>
            <div className='form-group m-form__group row'>
              <div className="alert m-alert m-alert--icon m-alert--default" role="alert">
                <div className='m-alert__icon'>
                  <i className='la la-info-circle' />
                </div>
                <div className='m-alert__text'>
                  To receive alerts via WhatsApp, please send <span className='m--font-boldest'>notify-me</span> on WhatsApp Business number <span className='m--font-boldest'>{this.props.whatsAppInfo.businessNumber}</span>
                </div>
              </div>
            </div>
            <div className='m--space-30' />
          </>
        }
        {
          this.props.channel === 'messenger' &&
          <>
            <div className='form-group m-form__group row'>
              <div className="alert m-alert m-alert--icon m-alert--default" role="alert">
                <div className='m-alert__icon'>
                  <i className='la la-info-circle' />
                </div>
                <div className='m-alert__text'>
                  To receive alerts via messenger, please subscribe by clicking the button below:
                </div>
              </div>
            </div>
            <div className='form-group m-form__group row'>
              <div className='col-lg-4 col-md-4 col-sm-4' />
              <div className='col-lg-4 col-md-4 col-sm-4'>
                <MessengerPlugin
                  appId={this.props.fbAppId}
                  pageId='321030461961407' // 151990922046256
                  size='large'
                  version='v6.0'
                  passthroughParams={`notify-me_${this.props.user.companyId}`}
                />
              </div>
              <div className='col-lg-4 col-md-4 col-sm-4' />
            </div>
            <div className='m--space-30' />
          </>
        }
        {
          this.props.channel === 'email' &&
          <>
            <div className='form-group m-form__group row'>
              <div className='col-lg-5 col-md-5 col-sm-12'>
                <input
                  type="text"
                  className="form-control m-input m-input--air"
                  placeholder="Enter name..."
                  value={this.state.name}
                  onChange={this.onNameChange}
                />
              </div>
              <div className='col-lg-5 col-md-5 col-sm-12'>
                <input
                  type="email"
                  className="form-control m-input m-input--air"
                  placeholder="Enter email..."
                  value={this.state.email}
                  onChange={this.onEmailChange}
                />
                {
                  this.state.emailError &&
                  <span className="m-form__help m--font-danger">
                    Enter a valid email address
  								</span>
                }
              </div>
              <div className='col-lg-2 col-md-2 col-sm-12'>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.onAddEmail}
                  disabled={!(this.state.name && this.state.email)}
                >
                  Add
                </button>
              </div>
            </div>
            <div className='m--space-30' />
          </>
        }
        {
          this.props.subscriptions.length > 0 &&
          <>
            <div className='form-group m-form__group row'>
              <div className='col-lg-12 col-md-12 col-sm-12 m--font-boldest'>
                Subscriptions:
              </div>
            </div>
            <div className='form-group m-form__group row'>
              {
                this.props.subscriptions.map((item, i) => (
                  <SUBSCRIPTIONITEM
                    key={i}
                    name={item.userName}
                    profilePic={item.profilePic}
                    onRemove={() => {this.onRemoveAgent(item._id)}}
                  />
                ))
              }
            </div>
          </>
        }
      </div>
    )
  }
}

AlertSubscriptions.propTypes = {
  'channel': PropTypes.string.isRequired,
  'subscriptions': PropTypes.array.isRequired,
  'members': PropTypes.array,
  'user': PropTypes.object,
  'addSubscription': PropTypes.func,
  'removeSubscription': PropTypes.func.isRequired,
  'updateMainState': PropTypes.func.isRequired,
  'whatsAppInfo': PropTypes.object,
  'facebookInfo': PropTypes.object,
  'fbAppId': PropTypes.string
}

export default AlertSubscriptions
