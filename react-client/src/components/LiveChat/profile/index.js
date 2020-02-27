import React from 'react'
import PropTypes from 'prop-types'
import Header from './header'
import MapCustomer from './mapCustomer'
import AssignTeam from './assignTeam'
import AssignAgent from './assignAgent'

class Profile extends React.Component {

  render() {
    return (
        <div style={{padding: '0px', border: '1px solid #F2F3F8', overflow: 'auto', marginBottom: '0px'}} className='col-xl-3 m-portlet'>
                <div style={{ padding: '0rem 1.5rem', height: '68vh'}} className='m-portlet__body'>
                    <div className='m-card-profile'>
                        <Header
                            unSubscribe={this.props.unSubscribe}
                            activeSession={this.props.activeSession}
                            user={this.props.user}
                            profilePicError={this.props.profilePicError}
                            alertMsg={this.props.alertMsg}
                            changeActiveSession={this.props.changeActiveSession}
                            fetchTeamAgents={this.props.fetchTeamAgents}
                            assignToTeam={this.props.assignToTeam}
                            assignToAgent={this.props.assignToAgent}
                            sendNotifications={this.props.sendNotifications}
                        />
                        {
                        this.props.user.isSuperUser &&
                        <MapCustomer
                            currentSession={this.props.activeSession}
                            alertMsg={this.props.alertMsg}
                            customers={this.props.customers}
                            getCustomers={this.props.getCustomers}
                            appendSubscriber={this.props.appendSubscriber}
                        />
                        }
                        {
                          this.props.user && this.props.user.role !== 'agent' && 
                          this.props.teams && this.props.teams.length > 0 &&
                          <AssignTeam
                            activeSession={this.props.activeSession}
                            teams={this.props.teams}
                            fetchTeamAgents={this.props.fetchTeamAgents}
                            assignToTeam={this.props.assignToTeam}
                        />
                        }
                        <AssignAgent
                            activeSession={this.props.activeSession}
                            agents={this.props.agents}
                            sendNotifications={this.props.sendNotifications}
                            assignToAgent={this.props.assignToAgent}
                            user={this.props.user}
                        />
                    </div>
                </div>
        </div>
    )
  }
}

Profile.propTypes = {
  'activeSession': PropTypes.object.isRequired,
  'user': PropTypes.object.isRequired,
  'profilePicError': PropTypes.func.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'customers': PropTypes.array,
  'appendSubscriber': PropTypes.func,
  'getCustomers': PropTypes.func.isRequired,
  'fetchTeamAgents': PropTypes.func.isRequired,
  'assignToTeam': PropTypes.func.isRequired,
  'teams': PropTypes.array,
  'unSubscribe': PropTypes.func.isRequired,
  'agents': PropTypes.array.isRequired,
  'assignToAgent': PropTypes.func.isRequired,
  'sendNotifications': PropTypes.func.isRequired
}

export default Profile
