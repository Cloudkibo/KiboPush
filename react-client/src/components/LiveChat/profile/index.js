import React from 'react'
import PropTypes from 'prop-types'
import Header from './header'
// import MapCustomer from './mapCustomer'
import AssignTag from './assignTag'
import AssignChat from './assignChat'
import CustomFields from './customFields'

class Profile extends React.Component {

  render() {
    return (
        <div id='profileArea' style={{padding: '0px', border: '1px solid #F2F3F8', marginBottom: '0px'}} className='col-xl-3 m-portlet'>
            <div className='m-card-profile'>
                <div className='m-portlet__head'>
                    <Header
                        showUnsubscribe={this.props.showUnsubscribe}
                        unSubscribe={this.props.unSubscribe}
                        activeSession={this.props.activeSession}
                        user={this.props.user}
                        profilePicError={this.props.profilePicError}
                        alertMsg={this.props.alertMsg}
                        updateState={this.props.updateState}
                        fetchTeamAgents={this.props.fetchTeamAgents}
                        assignToTeam={this.props.assignToTeam}
                        assignToAgent={this.props.assignToAgent}
                        sendNotifications={this.props.sendNotifications}
                        agents={this.props.agents}
                        teams={this.props.teams}
                        editSubscriberWhatsApp={this.props.editSubscriberWhatsApp}
                    />
                  {
                      (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
                      <AssignChat
                      alertMsg={this.props.alertMsg}
                      activeSession={this.props.activeSession}
                      teams={
                          (this.props.teams && this.props.teams.length > 0) ?
                              this.props.teams.map(team => (
                                  {
                                      label: team.name,
                                      value: team._id,
                                      group: 'team'
                                  })
                              )
                          : []
                      }
                      agents={this.props.agents.map(agent => (
                          {
                              label: agent.name,
                              value: agent._id,
                              group: 'agent'
                          }
                      ))}
                      fetchTeamAgents={this.props.fetchTeamAgents}
                      assignToTeam={this.props.assignToTeam}
                      sendNotifications={this.props.sendNotifications}
                      assignToAgent={this.props.assignToAgent}
                      user={this.props.user}
                      />
                  }
                </div>
                <div style={{ padding: '0rem 1.5rem' }} className='m-portlet__body'>
                    {/* {
                    this.props.user.isSuperUser &&
                    <MapCustomer
                        currentSession={this.props.activeSession}
                        alertMsg={this.props.alertMsg}
                        customers={this.props.customers}
                        getCustomers={this.props.getCustomers}
                        appendSubscriber={this.props.appendSubscriber}
                    />
                    } */}
                    {
                        this.props.showTags &&
                        (
                            this.props.subscriberTags ?
                            <AssignTag
                                assignTags={this.props.assignTags}
                                unassignTags={this.props.unassignTags}
                                createTag={this.props.createTag}
                                alertMsg={this.props.alertMsg}
                                subscriberTags={this.props.subscriberTags}
                                activeSession={this.props.activeSession}
                                tags={this.props.tags.map(tag => (
                                    {
                                        label: tag.tag,
                                        value: tag._id
                                    }
                                ))}
                            /> :
                            <div style={{marginTop: '50px', marginBottom: '50px'}} className='align-center'>
                                <center>
                                <div className="m-loader" style={{width: "30px", display: "inline-block"}}></div>
                                <span>Loading Tags...</span>
                                </center>
                            </div>
                        )
                    }
                    {
                        this.props.showCustomFields &&
                        (
                            this.props.customFieldOptions && this.props.customFieldOptions.length > 0 ?
                            <CustomFields
                                activeSession={this.props.activeSession}
                                customFieldOptions={this.props.customFieldOptions}
                                setCustomFieldValue={this.props.setCustomFieldValue}
                            /> :
                            <div style={{ marginTop: '50px'}} className='align-center'>
                                <center>
                                <div className="m-loader" style={{width: "30px", display: "inline-block"}}></div>
                                <span>Loading Custom Fields...</span>
                                </center>
                            </div>
                        )
                    }
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
  'updateState': PropTypes.func.isRequired,
  'customers': PropTypes.array,
  'appendSubscriber': PropTypes.func,
  'getCustomers': PropTypes.func.isRequired,
  'fetchTeamAgents': PropTypes.func.isRequired,
  'assignToTeam': PropTypes.func.isRequired,
  'teams': PropTypes.array,
  'unSubscribe': PropTypes.func.isRequired,
  'agents': PropTypes.array.isRequired,
  'assignToAgent': PropTypes.func.isRequired,
  'sendNotifications': PropTypes.func.isRequired,
  'tags': PropTypes.array,
  'showTags': PropTypes.bool.isRequired,
  'subscriberTags': PropTypes.object,
  'assignTags': PropTypes.func,
  'unassignTags': PropTypes.func,
  'createTag': PropTypes.func,
  'customFieldOptions': PropTypes.array,
  'setCustomFieldValue': PropTypes.func,
  'showCustomFields': PropTypes.bool.isRequired
}

export default Profile
