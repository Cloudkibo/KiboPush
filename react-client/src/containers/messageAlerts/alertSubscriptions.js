import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import SUBSCRIPTIONITEM from './subscriptionItem'

class AlertSubscriptions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      agents: [],
      selectedAgent: ''
    }

    this.setAgents = this.setAgents.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.onAddAgent = this.onAddAgent.bind(this)
    this.onRemoveAgent = this.onRemoveAgent.bind(this)
  }

  componentDidMount () {
    if (this.props.members && this.props.members.length > 0) {
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
    if (nextProps.members && nextProps.members.length > 0) {
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
              <div className='col-lg-6 col-md-16 col-sm-12'>
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
  'addSubscription': PropTypes.func.isRequired,
  'removeSubscription': PropTypes.func.isRequired,
  'updateMainState': PropTypes.func.isRequired
}

export default AlertSubscriptions
