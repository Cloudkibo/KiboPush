/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import {
  unSubscribe,
  assignToTeam,
  assignToAgent,
  sendNotifications,
  fetchTeamAgents
} from '../../redux/actions/livechat.actions'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import Select from 'react-select'
import { assignTags, unassignTags, loadTags, createTag, getSubscriberTags } from '../../redux/actions/tags.actions'
import AlertContainer from 'react-alert'
import MapCustomer from './mapCustomer'

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
      teamObject: {},
      agentValue: '',
      agentObject: {},
      showAssignTeam: false,
      showAssignAgent: false,
      popoverAddTagOpen: false,
      addTag: '',
      removeTag: '',
      tagOptions: [],
      saveEnable: false,
      assignedTeam: '',
      assignedAgent: '',
      Role: '',
      assignAdmin: false,
      assignAgent: false,
      isAssigned: '',
      customerId: this.props.currentSession.customerId ? this.props.currentSession.customerId : ''
    }
    props.loadTags()
    this.toggleAdd = this.toggleAdd.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleCreateTag = this.handleCreateTag.bind(this)
    this.showAddTag = this.showAddTag.bind(this)
    this.addTags = this.addTags.bind(this)
    this.removeTags = this.removeTags.bind(this)
    this.handleSaveTags = this.handleSaveTags.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.onTeamChange = this.onTeamChange.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
    this.assignToAgent = this.assignToAgent.bind(this)
    this.toggleAssignTeam = this.toggleAssignTeam.bind(this)
    this.toggleAssignAgent = this.toggleAssignAgent.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.unassignTeam = this.unassignTeam.bind(this)
    this.unassignAgent = this.unassignAgent.bind(this)
    this.updateCustomerId = this.updateCustomerId.bind(this)
  }

  componentWillMount () {
    if (this.props.currentSession.is_assigned) {
      if (this.props.currentSession.assigned_to.type === 'agent') {
        this.setState({
          assignedAgent: this.props.currentSession.assigned_to.name,
          Role: this.props.currentSession.assigned_to.type,
          isAssigned: this.props.currentSession.is_assigned
        })
      } else {
        this.setState({
          assignedTeam: this.props.currentSession.assigned_to.name,
          Role: this.props.currentSession.assigned_to.type,
          isAssigned: this.props.currentSession.is_assigned
        })
      }
    }
  }

  updateCustomerId (id) {
    this.setState({customerId: id})
  }

  showAddTag () {
    this.setState({
      addTag: null,
      popoverAddTagOpen: true
    })
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
      selectedIds.push(this.props.currentSession._id)
    } else {
      this.msg.error('Tag is already assigned')
      return
    }
    payload.subscribers = selectedIds
    payload.tagId = this.state.addTag.value
    this.props.assignTags(payload, this.handleSaveTags, this.msg)
  }
  removeTags (value) {
    var payload = {}
    var selectedIds = []
    selectedIds.push(this.props.currentSession._id)
    payload.subscribers = selectedIds
    this.setState({
      removeTag: value
    })
    payload.tagId = value
    this.props.unassignTags(payload, this.handleSaveTags, this.msg)
  }
  handleSaveTags () {
    var subscriberId = this.props.currentSession._id
    this.props.getSubscriberTags(subscriberId, this.msg)
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
    console.log('The team name  is', team.name)
    // this.setState({assignedTeam: team.name})
    this.setState({teamValue: e.target.value, teamObject: team, assignedTeam: team.name})
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
    this.setState({showAssignAgent: !this.state.showAssignAgent, Role: 'agent', assignAgent: false, isAssigned: true})
    let data = {
      agentId: this.state.agentObject._id,
      agentName: this.state.agentObject.name,
      sessionId: this.props.currentSession._id,
      isAssigned: true
    }
    this.props.assignToAgent(data)
    if (this.state.agentObject._id !== this.props.user._id) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.currentSession.firstName + ' ' + this.props.currentSession.lastName} has been assigned to you.`,
        category: {type: 'chat_session', id: this.props.currentSession._id},
        agentIds: [this.state.agentObject._id],
        companyId: this.props.currentSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  handleAgents (teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId)
      }
    }
    if (agentIds.length > 0) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.currentSession.firstName + ' ' + this.props.currentSession.lastName} has been assigned to your team ${this.state.teamObject.name}.`,
        category: {type: 'chat_session', id: this.props.currentSession._id},
        agentIds: agentIds,
        companyId: this.props.currentSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  assignToTeam () {
    this.setState({ showAssignTeam: !this.state.showAssignTeam, Role: 'team', assignAdmin: false, isAssigned: true })
    let data = {
      teamId: this.state.teamObject._id,
      teamName: this.state.teamObject.name,
      sessionId: this.props.currentSession._id,
      isAssigned: true
    }
    this.props.fetchTeamAgents(this.state.teamObject._id, this.handleAgents)
    this.props.assignToTeam(data)
  }

  toggleAssignTeam () {
    this.setState({showAssignTeam: !this.state.showAssignTeam})
  }
  toggleAssignAgent () {
    this.setState({showAssignAgent: !this.state.showAssignAgent})
  }

  unassignTeam () {
    this.setState({isAssigned: false})
    let data = {
      teamId: this.state.teamObject._id,
      teamName: this.state.teamObject.name,
      sessionId: this.props.currentSession._id,
      isAssigned: false
    }
    this.props.fetchTeamAgents(this.state.teamObject._id, this.handleAgents)
    this.props.assignToTeam(data)

    console.log('The value of unassigned is ', this.state.isAssigned)
  }
  unassignAgent () {
    this.setState({isAssigned: false})
    let data = {
      agentId: this.state.agentObject._id,
      agentName: this.state.agentObject.name,
      sessionId: this.props.currentSession._id,
      isAssigned: false
    }
    this.props.assignToAgent(data)
    if (this.state.agentObject._id !== this.props.user._id) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.currentSession.firstName + ' ' + this.props.currentSession.lastName} has been assigned to you.`,
        category: {type: 'chat_session', id: this.props.currentSession._id},
        agentIds: [this.state.agentObject._id],
        companyId: this.props.currentSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.tags) {
      var tagOptions = []
      for (var i = 0; i < nextProps.tags.length; i++) {
        tagOptions.push({'value': nextProps.tags[i]._id, 'label': nextProps.tags[i].tag})
      }
      this.setState({
        tagOptions: tagOptions
      })
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
                      this.props.unSubscribe({subscriber_id: this.state.subscriber, page_id: this.state.page})
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
                  <img style={{width: '80px', height: '80px'}} src={this.props.currentSession.profilePic} alt='' />
                </div>
              </div>
              <div className='m-card-profile__details'>
                <span className='m-card-profile__name'>
                  {this.props.currentSession.firstName + ' ' + this.props.currentSession.lastName}
                </span>
                {this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
                <a className='m-card-profile__email m-link' onClick={() => this.showDialog(this.props.currentSession._id, this.props.currentSession.pageId._id)} style={{color: '#716aca', cursor: 'pointer'}}>
                      (Unsubscribe)
                    </a>
                  }
                <br />
                <a className='m-card-profile__email m-link'>
                  {this.props.currentSession.gender + ', ' + this.props.currentSession.locale}
                </a>
                <br />
                {
                  this.state.customerId !== '' &&
                  <a style={{color: 'white'}}
                    onClick={() => {
                      window.open(`http://demoapp.cloudkibo.com/${this.state.customerId}`, '_blank', 'fullscreen=yes')
                    }}
                    className='btn m-btn--pill    btn-primary'
                  >
                    <i className='fa fa-external-link' /> View Customer Details
                  </a>
                }
                <MapCustomer updateCustomerId={this.updateCustomerId} currentSession={this.props.currentSession} msg={this.msg} />
                {
                  (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
                  <div style={{marginTop: '20px'}} className='m-accordion m-accordion--default'>
                    {
                      this.state.isAssigned &&
                      <div style={{marginBottom: '20px'}}>
                        <span className='m--font-bolder'>Team:</span>
                        <span> {
                          this.state.Role === 'team' ? this.state.assignedTeam : 'Not Assigned'}</span>
                        <br />
                        <span className='m--font-bolder'>Agent:</span>
                        <span> {this.state.Role === 'agent' ? this.state.assignedAgent : 'Not Assigned'}</span>
                      </div>
                    }
                    {
                      (this.state.assignAdmin || this.state.isAssigned) && this.state.Role === 'team'
                      ? <div className='m-accordion__item'>
                        <div className='m-accordion__item-head'>
                          <span className='m-accordion__item-icon'>
                            <i className='fa fa-users' />
                          </span>
                          <span className='m-accordion__item-title'>Unassign team</span>
                          <span style={{cursor: 'pointer'}} onClick={this.unassignTeam} className='m-accordion__item-icon'>
                            <i className='la la-minus' />
                          </span>
                        </div>
                      </div>
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
                    }
                    {
                      (this.state.assignAgent || this.state.isAssigned) && this.state.Role === 'agent'
                      ? <div className='m-accordion__item'>
                        <div className='m-accordion__item-head'>
                          <span className='m-accordion__item-icon'>
                            <i className='fa fa-user' />
                          </span>
                          <span className='m-accordion__item-title'>Unassign Agent</span>
                          <span style={{cursor: 'pointer'}} onClick={this.unassignAgent} className='m-accordion__item-icon'>
                            <i className='la la-minus' />
                          </span>
                        </div>
                      </div>
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
                        <i className='fa fa-times fa-stack' style={{marginRight: '-8px', cursor: 'pointer'}} onClick={() => this.removeTags(tag._id)} />
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    chat: (state.liveChat.chat),
    user: (state.basicInfo.user),
    tags: (state.tagsInfo.tags),
    subscriberTags: (state.tagsInfo.subscriberTags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    unSubscribe: unSubscribe,
    assignToAgent: assignToAgent,
    assignToTeam: assignToTeam,
    assignTags: assignTags,
    unassignTags: unassignTags,
    loadTags: loadTags,
    createTag: createTag,
    getSubscriberTags: getSubscriberTags,
    sendNotifications: sendNotifications,
    fetchTeamAgents: fetchTeamAgents
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
