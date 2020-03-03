import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

class AssignChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentSelected: this.props.activeSession.is_assigned ? {
          value: this.props.activeSession.assigned_to.id,
          label: this.props.activeSession.assigned_to.name,
          group: this.props.activeSession.assigned_to.type
      } : ''
    }
    this.onSelectChange = this.onSelectChange.bind(this)
    this.assignToAgent = this.assignToAgent.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
    this.unassignAgent = this.unassignAgent.bind(this)
    this.unassignTeam = this.unassignTeam.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps.activeSession) {
            this.setState({
                currentSelected: nextProps.activeSession.is_assigned ? {
                    value: nextProps.activeSession.assigned_to.id,
                    label: nextProps.activeSession.assigned_to.name,
                    group: nextProps.activeSession.assigned_to.type
                } : ''
            })
        }
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

  assignToAgent() {
    let data = {
      agentId: this.state.currentSelected.value,
      agentName: this.state.currentSelected.label,
      subscriberId: this.props.activeSession._id,
      isAssigned: true
    }
    this.props.assignToAgent(data)
    if (this.state.currentSelected.value !== this.props.user._id) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been assigned to you.`,
        category: { type: 'chat_session', id: this.props.activeSession._id },
        agentIds: [this.state.currentSelected.value],
        companyId: this.props.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  assignToTeam() {
    console.log('assignToTeam', this.state)
    let data = {
        teamId: this.state.currentSelected.value,
        teamName: this.state.currentSelected.label,
        subscriberId: this.props.activeSession._id,
        isAssigned: true
    }
    this.props.fetchTeamAgents(this.state.currentSelected.value)
    this.props.assignToTeam(data)
  }

  onSelectChange (selected) {
      console.log(selected)
      if (selected) {
        this.setState({currentSelected: selected}, () => {
            if (selected.group === 'team') {
                this.assignToTeam()
            } else if (selected.group === 'agent') {
                this.assignToAgent()
            }
        })
      } else {
        if (this.state.currentSelected) {
            if (this.state.currentSelected.group === 'team') {
                this.unassignTeam()
            } else if (this.state.currentSelected.group === 'agent') {
                this.unassignAgent()
            }
        } 
        this.setState({currentSelected: ''})
      }
  }

  render () {
    let options = [
        {
          label: 'Agents',
          options: this.props.agents,
        }
    ]
    if (this.props.teams.length > 0) {
        options.push({
            label: 'Teams',
            options: this.props.teams,
        })
    }
    return (
        <div style={{marginBottom: '20px'}}>
            <h6>Assigned to:</h6>
            <Select
                isClearable
                isSearchable
                options={options}
                onChange={this.onSelectChange}
                value={this.state.currentSelected}
                placeholder={'Not Assigned'}
            />
      </div>
    )
  }
}

AssignChat.propTypes = {
    'agents': PropTypes.array.isRequired,
    'teams': PropTypes.array.isRequired,
    'fetchTeamAgents': PropTypes.func.isRequired,
    'assignToTeam': PropTypes.func.isRequired,
    'activeSession': PropTypes.object.isRequired,
    'assignToAgent': PropTypes.func.isRequired,
    'sendNotifications': PropTypes.func.isRequired,
    'user': PropTypes.object.isRequired
  }
  
  export default AssignChat
