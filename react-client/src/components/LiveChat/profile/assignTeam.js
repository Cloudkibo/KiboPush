import React from 'react'
import PropTypes from 'prop-types'
import ProfileAction from './profileAction'

class AssignTeam extends React.Component {
  constructor (props, context) {
    super(props, context)
    let teams = this.props.teams.map(team => {
        return {
            label: team.name,
            value: team._id
        }
    })
    this.state = {
      selectedTeam: '',
      teamObject: {},
      teams
    }
    this.onTeamChange = this.onTeamChange.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
  }

  toggle () {
    this.setState({expanded: !this.state.expanded, selectedTeam: ''})
  }

  onTeamChange(value) {
    console.log('onTeamChange', value)
    if (value) {
        let team = this.props.teams.find(team => team._id === value.value)
        this.setState({selectedTeam: value, teamObject: team})
    }
  }

  assignToTeam() {
    console.log('assignToTeam', this.state)
    this.props.updateState({ 
        assignInfo: {
            isAssigned: true,
            type: 'team',
            name: this.state.teamObject.name
        }
    }, () => {
        let data = {
            teamId: this.state.teamObject._id,
            teamName: this.state.teamObject.name,
            subscriberId: this.props.activeSession._id,
            isAssigned: true
        }
        this.props.fetchTeamAgents(this.state.teamObject._id)
        this.props.assignToTeam(data)
    })
  }


  render () {
    return (
        <ProfileAction 
            title='Assign to Team'
            options={this.state.teams}
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
    'updateState': PropTypes.func.isRequired,
    'activeSession': PropTypes.object.isRequired
  }
  
  export default AssignTeam
