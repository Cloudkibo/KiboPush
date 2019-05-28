import React from 'react'
import PropTypes from 'prop-types'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import MAPCUSTOMER from './mapCustomer'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import Select from 'react-select'

class ProfileArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showUnsubscribeModal: false,
      isAssigned: '',
      role: '',
      assignedTeam: '',
      assignAgent: '',
      teamObject: {},
      showAssignTeam: false,
      teamValue: '',
      agentObject: {},
      showAssignAgent: false,
      agentValue: '',
      popoverAddTagOpen: false,
      addTag: '',
      removeTag: '',
      tagOptions: this.props.tagOptions,
      saveEnable: false
    }
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.unassignTeam = this.unassignTeam.bind(this)
    this.toggleAssignTeam = this.toggleAssignTeam.bind(this)
    this.onTeamChange = this.onTeamChange.bind(this)
    this.unassignAgent = this.unassignAgent.bind(this)
    this.toggleAssignAgent = this.toggleAssignAgent.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.assignToAgent = this.assignToAgent.bind(this)
    this.showAddTag = this.showAddTag.bind(this)
    this.removeTags = this.removeTags.bind(this)
    this.toggleAdd = this.toggleAdd.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleCreateTag = this.handleCreateTag.bind(this)
    this.addTags = this.addTags.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
  }

  showDialog (subscriber, page) {
    this.setState({showUnsubscribeModal: true})
  }

  closeDialog () {
    this.setState({showUnsubscribeModal: false})
  }

  unassignTeam () {
    this.setState({isAssigned: false})
    let data = {
      teamId: this.state.teamObject._id,
      teamName: this.state.teamObject.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: false
    }
    this.props.fetchTeamAgents(this.state.teamObject._id)
    this.props.assignToTeam(data)
  }

  assignToTeam () {
    this.setState({ showAssignTeam: !this.state.showAssignTeam, role: 'team', assignAdmin: false, isAssigned: true })
    let data = {
      teamId: this.state.teamObject._id,
      teamName: this.state.teamObject.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: true
    }
    this.props.fetchTeamAgents(this.state.teamObject._id)
    this.props.assignToTeam(data)
  }

  toggleAssignTeam () {
    this.setState({showAssignTeam: !this.state.showAssignTeam})
  }

  onTeamChange (e) {
    let team = {}
    for (let i = 0; i < this.props.teams.length; i++) {
      if (this.props.teams[i]._id === e.target.value) {
        team = this.props.teams[i]
        break
      }
    }
    this.setState({teamValue: e.target.value, teamObject: team, assignedTeam: team.name})
  }

  unassignAgent () {
    this.setState({isAssigned: false})
    let data = {
      agentId: this.state.agentObject._id,
      agentName: this.state.agentObject.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: false
    }
    this.props.assignToAgent(data)
    if (this.state.agentObject._id !== this.props.user._id) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been unassigned from you.`,
        category: {type: 'chat_session', id: this.props.activeSession._id},
        agentIds: [this.state.agentObject._id],
        companyId: this.props.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  toggleAssignAgent () {
    this.setState({showAssignAgent: !this.state.showAssignAgent})
  }

  onAgentChange (e) {
    let agent = {}
    for (let i = 0; i < this.props.agents.length; i++) {
      if (this.props.agents[i]._id === e.target.value) {
        agent = this.props.agents[i]
        break
      }
    }
    this.setState({agentValue: e.target.value, agentObject: agent, assignedAgent: agent.name})
  }

  assignToAgent () {
    this.setState({showAssignAgent: !this.state.showAssignAgent, role: 'agent', assignAgent: false, isAssigned: true})
    let data = {
      agentId: this.state.agentObject._id,
      agentName: this.state.agentObject.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: true
    }
    this.props.assignToAgent(data)
    if (this.state.agentObject._id !== this.props.user._id) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been assigned to you.`,
        category: {type: 'chat_session', id: this.props.activeSession._id},
        agentIds: [this.state.agentObject._id],
        companyId: this.props.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  showAddTag () {
    this.setState({
      addTag: null,
      popoverAddTagOpen: true
    })
  }

  removeTags (value) {
    var payload = {}
    var selectedIds = []
    selectedIds.push(this.props.activeSession._id)
    payload.subscribers = selectedIds
    this.setState({
      removeTag: value
    })
    payload.tag = value
    this.props.unassignTags(payload, this.msg)
  }

  toggleAdd () {
    this.setState({
      popoverAddTagOpen: !this.state.popoverAddTagOpen
    })
  }

  handleAdd (value) {
    var index = 0
    if (value) {
      for (var i = 0; i < this.props.tags.length; i++) {
        if (this.props.tags[i].tag !== value.label) {
          index++
        }
      }
      if (index === this.props.tags.length) {
        this.props.createTag(value.label, this.handleCreateTag, this.msg)
      } else {
        this.setState({
          saveEnable: true,
          addTag: value
        })
      }
    } else {
      this.setState({
        saveEnable: false,
        addTag: value
      })
    }
  }

  handleCreateTag () {
    this.setState({
      saveEnable: false
    })
  }

  addTags () {
    var payload = {}
    var selectedIds = []
    var index = 0
    for (var i = 0; i < this.props.subscriberTags.length; i++) {
      if (this.props.subscriberTags[i].tag !== this.state.addTag.label) {
        index++
      }
    }
    if (index === this.props.subscriberTags.length) {
      selectedIds.push(this.props.activeSession._id)
    } else {
      this.msg.error('Tag is already assigned')
      return
    }
    payload.subscribers = selectedIds
    payload.tag = this.state.addTag.label
    this.props.assignTags(payload, this.msg)
  }

  componentWillMount () {
    if (this.props.activeSession.is_assigned) {
      if (this.props.activeSession.assigned_to.type === 'agent') {
        this.setState({
          assignedAgent: this.props.activeSession.assigned_to.name,
          role: this.props.activeSession.assigned_to.type,
          isAssigned: this.props.activeSession.is_assigned
        })
      } else {
        this.setState({
          assignedTeam: this.props.activeSession.assigned_to.name,
          role: this.props.activeSession.assigned_to.type,
          isAssigned: this.props.activeSession.is_assigned
        })
      }
    }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='col-xl-3'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height'>
          <div style={{padding: '0rem 1.5rem'}} className='m-portlet__body'>
            <div className='m-card-profile'>
              <div className='m-card-profile__pic'>
                <div className='m-card-profile__pic-wrapper'>
                  <img style={{width: '80px', height: '80px'}} src={this.props.activeSession.profilePic} alt='' />
                </div>
              </div>
              <div className='m-card-profile__details'>
                <span className='m-card-profile__name'>
                  {this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName}
                </span>
                {
                  this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
                  <a className='m-card-profile__email m-link' onClick={() => this.showDialog()} style={{color: '#716aca', cursor: 'pointer'}}>
                    (Unsubscribe)
                  </a>
                }
                <br />
                <a className='m-card-profile__email m-link'>
                  {this.props.activeSession.gender + ', ' + this.props.activeSession.locale}
                </a>
                <br />
                {
                  this.props.user.isSuperUser && this.props.activeSession.customerId &&
                  <a style={{color: 'white'}}
                    onClick={() => {
                      window.open(`http://demoapp.cloudkibo.com/${this.props.activeSession.customerId}`, '_blank', 'fullscreen=yes')
                    }}
                    className='btn m-btn--pill    btn-primary'
                  >
                    <i className='fa fa-external-link' /> View Customer Details
                  </a>
                }
                {
                  this.props.user.isSuperUser &&
                  <MAPCUSTOMER
                    currentSession={this.props.activeSession}
                    msg={this.msg}
                  />
                }
                {
                  (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
                  <div style={{marginTop: '20px'}} className='m-accordion m-accordion--default'>
                    {
                      this.state.isAssigned &&
                      <div style={{marginBottom: '20px'}}>
                        <span className='m--font-bolder'>Team:</span>
                        <span> {
                          this.state.role === 'team' ? this.state.assignedTeam : 'Not Assigned'}</span>
                        <br />
                        <span className='m--font-bolder'>Agent:</span>
                        <span> {this.state.role === 'agent' ? this.state.assignedAgent : 'Not Assigned'}</span>
                      </div>
                    }
                    {
                      this.props.user && this.props.user.role !== 'agent' &&
                      (
                        this.state.isAssigned && this.state.role === 'team'
                        ? <button style={{marginTop: '10px'}} className='btn btn-primary' onClick={this.unassignTeam}>Unassign Team</button>
                        : this.state.showAssignTeam
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
                      )
                    }
                    {
                      this.state.isAssigned && this.state.role === 'agent'
                      ? <button style={{marginTop: '10px'}} className='btn btn-primary' onClick={this.unassignAgent}>Unassign Agent</button>
                      : this.state.showAssignAgent
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
              <div className='row' style={{display: 'block'}}>
                <div style={{marginLeft: '50px', marginTop: '40px'}}>
                  <a id='assignTag' className='m-link' onClick={this.showAddTag} style={{color: '#716aca', cursor: 'pointer', width: '110px'}}>
                    <i className='la la-plus' /> Assign Tags
                  </a>
                </div>
                {/* <span style={{fontSize: '0.8rem', color: '#5cb85c', marginLeft: '20px'}}>Tag limit for each subscriber is 10</span> */}
              </div>
              {this.props.subscriberTags && this.props.subscriberTags.length > 0 && <div className='row' style={{minWidth: '150px', padding: '10px'}}>
                {
                  this.props.subscriberTags.map((tag, i) => (
                    <span key={i} style={{display: 'flex'}} className='tagLabel'>
                      <label className='tagName'>{tag.tag}</label>
                      <div className='deleteTag' style={{marginLeft: '10px'}}>
                        <i className='fa fa-times fa-stack' style={{marginRight: '-8px', cursor: 'pointer'}} onClick={() => this.removeTags(tag.tag)} />
                      </div>
                    </span>
                  ))
                }
              </div>
            }
              <Popover placement='left' className='liveChatPopover' isOpen={this.state.popoverAddTagOpen} target='assignTag' toggle={this.toggleAdd}>
                <PopoverHeader>Add Tags</PopoverHeader>
                <PopoverBody>
                  <div className='row' style={{minWidth: '250px'}}>
                    <div className='col-12'>
                      <label>Select Tags</label>
                      <Select.Creatable
                        options={this.state.tagOptions}
                        onChange={this.handleAdd}
                        value={this.state.addTag}
                        placeholder='Add User Tags'
                      />
                    </div>
                    {this.state.saveEnable
                    ? <div className='col-12'>
                      <button style={{float: 'right', margin: '15px'}}
                        className='btn btn-primary btn-sm'
                        onClick={() => {
                          this.addTags()
                          this.toggleAdd()
                        }}>Save
                      </button>
                    </div>
                    : <div className='col-12'>
                      <button style={{float: 'right', margin: '15px'}}
                        className='btn btn-primary btn-sm'
                        disabled>
                         Save
                      </button>
                    </div>
                  }
                  </div>
                </PopoverBody>
              </Popover>
            </div>
          </div>
        </div>
        {
            this.state.showUnsubscribeModal &&
            <ModalContainer style={{width: '500px'}}
              onClose={this.closeDialog}>
              <ModalDialog style={{width: '500px'}}
                onClose={this.closeDialog}>
                <h3>Unsubscribe</h3>
                <p>Are you sure you want to Unsubscribe this Subscriber?</p>
                <div style={{width: '100%', textAlign: 'center'}}>
                  <div style={{display: 'inline-block', padding: '5px'}}>
                    <button className='btn btn-primary' onClick={(e) => {
                      this.props.changeActiveSession('none')
                      this.props.unSubscribe({subscriber_id: this.props.activeSession._id, page_id: this.props.activeSession.pageId._id})
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
      </div>
    )
  }
}

ProfileArea.propTypes = {
  'teams': PropTypes.array.isRequired,
  'agents': PropTypes.array.isRequired,
  'subscriberTags': PropTypes.array.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'unSubscribe': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'fetchTeamAgents': PropTypes.func.isRequired,
  'assignToTeam': PropTypes.func.isRequired,
  'assignToAgent': PropTypes.func.isRequired,
  'sendNotifications': PropTypes.func.isRequired,
  'unassignTags': PropTypes.func.isRequired,
  'tags': PropTypes.array.isRequired,
  'createTag': PropTypes.func.isRequired,
  'assignTags': PropTypes.func.isRequired,
  'tagOptions': PropTypes.array.isRequired,
  'members': PropTypes.array.isRequired
}

export default ProfileArea
