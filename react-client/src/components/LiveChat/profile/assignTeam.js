import React from 'react'
import PropTypes from 'prop-types'
import ProfileAction from './profileAction'

class AssignTeam extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedTeam: ''
    }
    this.onTeamChange = this.onTeamChange.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
  }

  onTeamChange(value) {
    if (value) {
        this.setState({selectedTeam: value})
    } else {
        this.setState({selectedTeam: ''})
    }
  }

  assignToTeam() {
    console.log('assignToTeam', this.state)
    let data = {
        teamId: this.state.selectedTeam.value,
        teamName: this.state.selectedTeam.label,
        subscriberId: this.props.activeSession._id,
        isAssigned: true
    }
    this.props.fetchTeamAgents(this.state.selectedTeam.value)
    this.props.assignToTeam(data)
  }


  render () {
    return (
        <ProfileAction 
            title='Assign to Team'
            options={this.props.teams}
            currentSelected={this.state.selectedTeam}
            selectPlaceholder='Select a team...'
            performAction={this.assignToTeam}
            onSelectChange={this.onTeamChange}
            actionTitle='Assign'
            iconClass='fa fa-users'
        />
    )
  }
}

AssignTeam.propTypes = {
    'teams': PropTypes.array.isRequired,
    'fetchTeamAgents': PropTypes.func.isRequired,
    'assignToTeam': PropTypes.func.isRequired,
    'activeSession': PropTypes.object.isRequired
  }
  
  export default AssignTeam
