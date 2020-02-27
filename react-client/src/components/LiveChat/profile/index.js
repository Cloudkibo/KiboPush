import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './header'
import MAPCUSTOMER from './mapCustomer'
import ASSIGNTEAM from './assignTeam'

class Profile extends React.Component {

  render() {
    return (
        <div style={{padding: '0px', border: '1px solid #F2F3F8'}} className='col-xl-3'>
            <div style={{overflow: 'hidden', marginBottom: '0px'}} className='m-portlet' >
                <div style={{ padding: '0rem 1.5rem' }} className='m-portlet__body'>
                    <div className='m-card-profile'>
                        <HEADER
                            unSubscribe={this.props.unSubscribe}
                            activeSession={this.props.activeSession}
                            user={this.props.user}
                            profilePicError={this.props.profilePicError}
                            alertMsg={this.props.alertMsg}
                            changeActiveSession={this.props.changeActiveSession}
                            fetchTeamAgents={this.props.fetchTeamAgents}
                            assignToTeam={this.props.assignToTeam}
                        />
                        {
                        this.props.user.isSuperUser &&
                        <MAPCUSTOMER
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
                          <ASSIGNTEAM
                            activeSession={this.props.activeSession}
                            teams={this.props.teams}
                            fetchTeamAgents={this.props.fetchTeamAgents}
                            assignToTeam={this.props.assignToTeam}
                        />
                        }
                    </div>
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
  'unSubscribe': PropTypes.func.isRequired
}

export default Profile
