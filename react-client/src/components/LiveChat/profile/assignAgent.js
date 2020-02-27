import React from 'react'
import PropTypes from 'prop-types'
import ProfileAction from './profileAction'

class AssignAgent extends React.Component {
  constructor (props, context) {
    super(props, context)
    let agents = this.props.agents.map(agent => {
        return {
            label: agent.name,
            value: agent._id
        }
    })
    this.state = {
      selectedTeam: '',
      agents
    }
    this.onAgentChange = this.onAgentChange.bind(this)
    this.assignToAgent = this.assignToAgent.bind(this)
  }

  onAgentChange(value) {
    console.log('onAgentChange', value)
    if (value) {
        this.setState({selectedAgent: value})
    }
  }

  assignToAgent() {
    let data = {
      agentId: this.state.selectedAgent.value,
      agentName: this.state.selectedAgent.label,
      subscriberId: this.props.activeSession._id,
      isAssigned: true
    }
    this.props.assignToAgent(data)
    if (this.state.selectedAgent.value !== this.props.user._id) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been assigned to you.`,
        category: { type: 'chat_session', id: this.props.activeSession._id },
        agentIds: [this.state.selectedAgent.value],
        companyId: this.props.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }


  render () {
    return (
        <ProfileAction 
            title='Assign to Agent'
            options={this.state.agents}
            currentSelected={this.state.selectedAgent}
            selectPlaceholder='Select an agent...'
            performAction={this.assignToAgent}
            onSelectChange={this.onAgentChange}
            actionTitle='Assign'
            iconClass='fa fa-user'
        />
    )
  }
}

AssignAgent.propTypes = {
    'agents': PropTypes.array.isRequired,
    'activeSession': PropTypes.object.isRequired,
    'assignToAgent': PropTypes.func.isRequired,
    'sendNotifications': PropTypes.func.isRequired,
    'user': PropTypes.func.isRequired
  }
  
  export default AssignAgent
