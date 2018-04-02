/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { unSubscribe, assignToTeam, assignToAgent } from '../../redux/actions/livechat.actions'

// import Image from 'react-image-resizer'
//  import ChatBox from './chatbox'

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      subscriber: '',
      page: '',
      teamValue: '',
      agentValue: '',
      showAssignTeam: false,
      showAssignAgent: false
    }
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.onTeamChange = this.onTeamChange.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
    this.assignToAgent = this.assignToAgent.bind(this)
    this.toggleAssignTeam = this.toggleAssignTeam.bind(this)
    this.toggleAssignAgent = this.toggleAssignAgent.bind(this)
  }

  showDialog (subscriber, page) {
    this.setState({isShowingModal: true, subscriber: subscriber, page: page})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  onTeamChange (e) {
    let team = {}

    for (let i = 0; i < this.props.teams.length; i++) {
      if (this.props.teams[i]._id === e.target.value) {
        team = this.props.teams[i]
        break
      }
    }

    this.setState({teamValue: team})
  }

  onAgentChange (e) {
    let agent = {}

    for (let i = 0; i < this.props.agents.length; i++) {
      if (this.props.agents[i]._id === e.target.value) {
        agent = this.props.agents[i]
        break
      }
    }
    this.setState({agentValue: agent})
  }

  assignToAgent () {
    let data = {
      agentId: this.state.agentValue._id,
      agentName: this.state.agentValue.name,
      sessionId: this.props.currentSession._id
    }
    this.props.assignToAgent(data, {company_id: this.props.user._id})
  }

  assignToTeam () {
    let data = {
      teamId: this.state.teamValue._id,
      teamName: this.state.teamValue.name,
      sessionId: this.props.currentSession._id
    }
    this.props.assignToTeam(data, {company_id: this.props.user._id})
  }

  toggleAssignTeam () {
    this.setState({showAssignTeam: !this.state.showAssignTeam})
  }

  toggleAssignAgent () {
    this.setState({showAssignAgent: !this.state.showAssignAgent})
  }

  render () {
    return (
      <div className='col-xl-3'>
        {
            this.state.isShowingModal &&
            <ModalContainer style={{width: '500px'}}
              onClose={this.closeDialog}>
              <ModalDialog style={{width: '500px'}}
                onClose={this.closeDialog}>
                <h3>Unsubscribe</h3>
                <p>Are you sure you want to Unsubscribe this Subscriber?</p>
                <div style={{width: '100%', textAlign: 'center'}}>
                  <div style={{display: 'inline-block', padding: '5px'}}>
                    <button className='btn btn-primary' onClick={(e) => {
                      this.props.changeActiveSessionFromChatbox()
                      this.props.unSubscribe({subscriber_id: this.state.subscriber, page_id: this.state.page}, {company_id: this.props.user._id})
                      this.closeDialog()
                    }}>
                      Yes
                    </button>
                  </div>
                  <div style={{display: 'inline-block', padding: '5px'}}>
                    <button className='btn btn-primary' onClick={this.closeDialog}>
                      No
                    </button>
                  </div>
                </div>
              </ModalDialog>
            </ModalContainer>
          }
        <div className='m-portlet m-portlet--full-height'>
          <div style={{padding: '0rem 1.5rem'}} className='m-portlet__body'>
            <div className='m-card-profile'>
              <div className='m-card-profile__pic'>
                <div className='m-card-profile__pic-wrapper'>
                  <img style={{width: '80px', height: '80px'}} src={this.props.currentSession.subscriber_id.profilePic} alt='' />
                </div>
              </div>
              <div className='m-card-profile__details'>
                <span className='m-card-profile__name'>
                  {this.props.currentSession.subscriber_id.firstName + ' ' + this.props.currentSession.subscriber_id.lastName}
                </span>
                {this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
                <a className='m-card-profile__email m-link' onClick={() => this.showDialog(this.props.currentSession.subscriber_id._id, this.props.currentSession.page_id._id)} style={{color: '#716aca', cursor: 'pointer'}}>
                      (Unsubscribe)
                    </a>
                  }
                <br />
                <a className='m-card-profile__email m-link'>
                  {this.props.currentSession.subscriber_id.gender + ', ' + this.props.currentSession.subscriber_id.locale}
                </a>
                {
                  (this.props.user.currentPlan === 'plan_C' || this.props.user.currentPlan === 'plan_D') &&
                  <div style={{marginTop: '20px'}} className='m-accordion m-accordion--default'>
                    {
                      this.props.currentSession.is_assigned &&
                      <div style={{marginBottom: '20px'}}>
                        <span className='m--font-bolder'>Team:</span>
                        <span> {this.props.currentSession.assigned_to.type === 'team' ? this.props.currentSession.assigned_to.name : 'Not Assigned'}</span>
                        <br />
                        <span className='m--font-bolder'>Agent:</span>
                        <span> {this.props.currentSession.assigned_to.type === 'agent' ? this.props.currentSession.assigned_to.name : 'Not Assigned'}</span>
                      </div>
                    }
                    {
                      this.state.showAssignTeam
                      ? <div className='m-accordion__item'>
                        <div className='m-accordion__item-head'>
                          <span className='m-accordion__item-icon'>
                            <i className='fa fa-users' />
                          </span>
                          <span className='m-accordion__item-title'>Assign to team</span>
                          <span style={{cursor: 'pointer'}} onClick={this.toggleAssignTeam} className='m-accordion__item-icon'>
                            <i className='la la-minus' />
                          </span>
                        </div>
                        <div className='m-accordion__item-body'>
                          <div className='m-accordion__item-content'>
                            <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.teamValue} onChange={this.onTeamChange}>
                              <option value='' disabled>Select team</option>
                              {
                                this.props.teams.map((team, i) => (
                                  <option key={i} value={team._id}>{team.name}</option>
                                ))
                              }
                            </select>
                            <button style={{marginTop: '10px'}} className='btn btn-primary' onClick={this.assignToTeam}>Assign</button>
                          </div>
                        </div>
                      </div>
                      : <div className='m-accordion__item'>
                        <div className='m-accordion__item-head collapsed'>
                          <span className='m-accordion__item-icon'>
                            <i className='fa fa-users' />
                          </span>
                          <span className='m-accordion__item-title'>Assign to team</span>
                          <span style={{cursor: 'pointer'}} onClick={this.toggleAssignTeam} className='m-accordion__item-icon'>
                            <i className='la la-plus' />
                          </span>
                        </div>
                      </div>
                    }
                    {
                      this.state.showAssignAgent
                      ? <div className='m-accordion__item'>
                        <div className='m-accordion__item-head'>
                          <span className='m-accordion__item-icon'>
                            <i className='fa fa-user' />
                          </span>
                          <span className='m-accordion__item-title'>Assign to agent</span>
                          <span style={{cursor: 'pointer'}} onClick={this.toggleAssignAgent} className='m-accordion__item-icon'>
                            <i className='la la-minus' />
                          </span>
                        </div>
                        <div className='m-accordion__item-body'>
                          <div className='m-accordion__item-content'>
                            <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.agentValue} onChange={this.onAgentChange}>
                              <option value='' disabled>Select agent</option>
                              {
                                this.props.agents.map((agent, i) => (
                                  <option key={i} value={agent._id}>{agent.name}</option>
                                ))
                              }
                            </select>
                            <button style={{marginTop: '10px'}} className='btn btn-primary' onClick={this.assignToAgent}>Assign</button>
                          </div>
                        </div>
                      </div>
                      : <div className='m-accordion__item'>
                        <div className='m-accordion__item-head collapsed'>
                          <span className='m-accordion__item-icon'>
                            <i className='fa fa-user' />
                          </span>
                          <span className='m-accordion__item-title'>Assign to agent</span>
                          <span style={{cursor: 'pointer'}} onClick={this.toggleAssignAgent} className='m-accordion__item-icon'>
                            <i className='la la-plus' />
                          </span>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    chat: (state.liveChat.chat),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    unSubscribe: unSubscribe,
    assignToAgent: assignToAgent,
    assignToTeam: assignToTeam
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
