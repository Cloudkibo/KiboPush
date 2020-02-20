import React from 'react'
import PropTypes from 'prop-types'
import MAPCUSTOMER from './mapCustomer'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import Select from 'react-select'
import { Link } from 'react-router-dom'

class ProfileArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
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
      saveEnable: false,
      setFieldIndex: false,
      show: false,
      selectedField: {},
      saveFieldValueButton: true,
      oldSelectedFieldValue: '',
      hoverId: '',
    }
    this.unassignTeam = this.unassignTeam.bind(this)
    this.toggleAssignTeam = this.toggleAssignTeam.bind(this)
    this.onTeamChange = this.onTeamChange.bind(this)
    this.unassignAgent = this.unassignAgent.bind(this)
    this.toggleAssignAgent = this.toggleAssignAgent.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.assignToAgent = this.assignToAgent.bind(this)
    this.showAddTag = this.showAddTag.bind(this)
    this.hideAddTag = this.hideAddTag.bind(this)
    this.removeTags = this.removeTags.bind(this)
    this.toggleAdd = this.toggleAdd.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleCreateTag = this.handleCreateTag.bind(this)
    this.addTags = this.addTags.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
    this.hoverOn = this.hoverOn.bind(this)
    this.hoverOff = this.hoverOff.bind(this)
    this.saveCustomField = this.saveCustomField.bind(this)
    this.handleSetCustomField = this.handleSetCustomField.bind(this)
    this.showToggle = this.showToggle.bind(this)
    this.unSubscribe = this.unSubscribe.bind(this)
    this.toggleSetFieldPopover = this.toggleSetFieldPopover.bind(this)
  }

  unSubscribe() {
    this.props.changeActiveSession('none')
    if (this.props.module === 'WHATSAPP') {
      this.props.unSubscribe(this.props.activeSession._id, { isSubscribed: false, unSubscribedBy: 'agent' }, this.props.msg)
    } else {
      this.props.unSubscribe({ subscriber_id: this.props.activeSession._id, page_id: this.props.activeSession.pageId._id })
    }
  }

  showToggle() {
    this.setState({ show: !this.state.show })
  }

  saveCustomField() {
    let subscriberIds = this.props.activeSession._id
    let temp = {
      customFieldId: this.state.selectedField._id,
      subscriberIds: [subscriberIds],
      value: this.state.selectedField.value
    }
    this.props.setCustomFieldValue(temp)
    this.setState({ setFieldIndex: !this.state.setFieldIndex })
  }

  handleSetCustomField(event) {
    var temp = {
      _id: this.state.selectedField._id,
      name: this.state.selectedField.label,
      type: this.state.selectedField.type,
      value: event.target.value
    }
    if (this.state.oldSelectedFieldValue === event.target.value) {
      this.setState({ selectedField: temp, saveFieldValueButton: true })
    } else {
      this.setState({ selectedField: temp, saveFieldValueButton: false })
    }
  }

  toggleSetFieldPopover(field) {
    console.log('field', field)
    this.setState({ setFieldIndex: !this.state.setFieldIndex, selectedField: field, oldSelectedFieldValue: field.value })
  }

  hoverOn(id) {
    this.setState({ hoverId: id })
  }
  hoverOff() {
    this.setState({ hoverId: '' })
  }

  unassignTeam() {
    this.setState({ isAssigned: false, assignedTeam: '' })
    let data = {
      teamId: this.props.activeSession.assigned_to.id,
      teamName: this.props.activeSession.assigned_to.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: false
    }
    this.props.fetchTeamAgents(this.props.activeSession.assigned_to.id)
    this.props.assignToTeam(data)
  }

  assignToTeam() {
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

  toggleAssignTeam() {
    this.setState({ showAssignTeam: !this.state.showAssignTeam })
  }

  onTeamChange(e) {
    let team = {}
    for (let i = 0; i < this.props.teams.length; i++) {
      if (this.props.teams[i]._id === e.target.value) {
        team = this.props.teams[i]
        break
      }
    }
    this.setState({ teamValue: e.target.value, teamObject: team, assignedTeam: team.name })
  }

  unassignAgent() {
    this.setState({ isAssigned: false, assignedAgent: '' })
    let data = {
      agentId: this.props.activeSession.assigned_to.id,
      agentName: this.props.activeSession.assigned_to.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: false
    }
    this.props.assignToAgent(data)
    if (this.state.agentObject._id !== this.props.user._id) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been unassigned from you.`,
        category: { type: 'chat_session', id: this.props.activeSession._id },
        agentIds: [this.state.agentObject._id],
        companyId: this.props.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  toggleAssignAgent() {
    this.setState({ showAssignAgent: !this.state.showAssignAgent })
  }

  hideAddTag() {
    this.setState({ popoverAddTagOpen: false })
  }

  onAgentChange(e) {
    let agent = {}
    for (let i = 0; i < this.props.agents.length; i++) {
      if (this.props.agents[i]._id === e.target.value) {
        agent = this.props.agents[i]
        break
      }
    }
    this.setState({ agentValue: e.target.value, agentObject: agent, assignedAgent: agent.name })
  }

  assignToAgent() {
    this.setState({ showAssignAgent: !this.state.showAssignAgent, role: 'agent', assignAgent: false, isAssigned: true })
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
        category: { type: 'chat_session', id: this.props.activeSession._id },
        agentIds: [this.state.agentObject._id],
        companyId: this.props.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  showAddTag() {
    this.setState({
      addTag: null,
      popoverAddTagOpen: true
    })
  }

  removeTags(value) {
    var payload = {}
    var selectedIds = []
    selectedIds.push(this.props.activeSession._id)
    payload.subscribers = selectedIds
    this.setState({
      removeTag: value
    })
    payload.tag = value
    this.props.unassignTags(payload, this.props.msg)
  }

  toggleAdd() {
    this.setState({
      popoverAddTagOpen: !this.state.popoverAddTagOpen
    })
  }

  handleAdd(value) {
    var index = 0
    if (value) {
      for (var i = 0; i < this.props.tags.length; i++) {
        if (this.props.tags[i].tag !== value.label) {
          index++
        }
      }
      if (index === this.props.tags.length) {
        this.props.createTag(value.label, this.handleCreateTag, this.props.msg)
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

  handleCreateTag() {
    this.setState({
      saveEnable: false
    })
  }

  addTags() {
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
      this.props.msg.error('Tag is already assigned')
      return
    }
    payload.subscribers = selectedIds
    payload.tag = this.state.addTag.label
    this.props.assignTags(payload, this.props.msg)
    this.hideAddTag()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps profileArea.js', nextProps)
    if (nextProps.activeSession.is_assigned) {
      if (nextProps.activeSession.assigned_to.type === 'agent') {
        this.setState({
          assignedAgent: nextProps.activeSession.assigned_to.name,
          role: nextProps.activeSession.assigned_to.type,
          isAssigned: nextProps.activeSession.is_assigned
        })
      } else {
        this.setState({
          assignedTeam: nextProps.activeSession.assigned_to.name,
          role: nextProps.activeSession.assigned_to.type,
          isAssigned: nextProps.activeSession.is_assigned
        })
      }
    } else {
      this.setState({
        assignedAgent: '',
        assignedTeam: '',
        role: '',
        isAssigned: ''
      })
    }
  }

  render() {
    console.log('state in profile', this.state)
    let setFieldInput = <div style={{ padding: '15px', maxHeight: '120px' }}>No Type Found</div>
    if (this.state.selectedField.type === 'text') {
      setFieldInput = <input
        className='form-control m-input'
        placeholder='value'
        onChange={this.handleSetCustomField}
        value={this.state.selectedField.value}
      />
    } else if (this.state.selectedField.type === 'number') {
      setFieldInput = <input
        type='text'
        className='form-control m-input'
        placeholder='value'
        onChange={this.handleSetCustomField}
        value={this.state.selectedField.value}
      />
    } else if (this.state.selectedField.type === 'date') {
      setFieldInput = <input className='form-control m-input'
        value={this.state.selectedField.value}
        onChange={this.handleSetCustomField}
        type='date' />
    } else if (this.state.selectedField.type === 'datetime') {
      setFieldInput = setFieldInput = <input className='form-control m-input'
        value={this.state.selectedField.value}
        onChange={this.handleSetCustomField}
        type='datetime-local' />
    } else if (this.state.selectedField.type === 'true/false') {
      setFieldInput = <select className='custom-select' id='type' value={this.state.selectedField.value} style={{ width: '250px' }} tabIndex='-98' onChange={this.handleSetCustomField}>
        <option key='' value='' disabled>...Select...</option>
        <option key='true' value='true'>True</option>
        <option key='false' value='false'>False</option>
      </select>
    }
    var hoverOn = {
      cursor: 'pointer',
      border: '1px solid #3c3c7b',
      borderRadius: '30px',
      marginBottom: '7px',
      background: 'rgb(60, 60, 123, 0.5)'
    }
    var hoverOff = {
      cursor: 'pointer',
      border: '1px solid rgb(220, 220, 220)',
      borderRadius: '30px',
      marginBottom: '7px',
      background: 'white'
    }
    console.log('props in profile Area:', this.props)
    return (
      <div className='col-xl-3'>
        <div className='m-portlet m-portlet--full-height'>
          <div style={{ padding: '0rem 1.5rem' }} className='m-portlet__body'>
            <div className='m-card-profile'>
              <div className='m-card-profile__pic'>
                <div className='m-card-profile__pic-wrapper'>
                  <img style={{ width: '80px', height: '80px' }} src={this.props.activeSession.profilePic} alt='' />
                </div>
              </div>
              <div className='m-card-profile__details'>
                <span className='m-card-profile__name'>
                  {this.props.module === 'WHATSAPP'
                    ? this.props.activeSession.name
                    : this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName}
                </span>
                {
                  this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
                  <a href='#/' className='m-card-profile__email m-link' data-toggle="modal" data-target="#unsubscribe" style={{ color: '#716aca', cursor: 'pointer' }}>
                    (Unsubscribe)
                  </a>
                }
                <br />
                <a href='#/' className='m-card-profile__email m-link'>
                  {this.props.module !== 'WHATSAPP' && this.props.activeSession.gender + ', ' + this.props.activeSession.locale}
                </a>
                <br />
                {
                  this.props.user.isSuperUser && this.props.activeSession.customerId &&
                  <a href='#/' style={{ color: 'white' }}
                    onClick={() => {
                      window.open(`http://demoapp.cloudkibo.com/${this.props.activeSession.customerId}`, '_blank', 'fullscreen=yes')
                    }}
                    className='btn m-btn--pill    btn-primary'
                  >
                    <i className='fa fa-external-link' /> View Customer Details
                  </a>
                }
                {
                  this.props.user.isSuperUser && this.props.module !== 'WHATSAPP' &&
                  <MAPCUSTOMER
                    currentSession={this.props.activeSession}
                    msg={this.props.msg}
                  />
                }
                {
                  (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
                  <div style={{ marginTop: '20px' }} className='m-accordion m-accordion--default'>
                    {
                      this.state.isAssigned &&
                      <div style={{ marginBottom: '20px' }}>
                        <span className='m--font-bolder'>Team:</span>
                        <span> {
                          this.state.role === 'team' ? this.state.assignedTeam : 'Not Assigned'}</span>
                        <br />
                        <span className='m--font-bolder'>Agent:</span>
                        <span> {this.state.role === 'agent' ? this.state.assignedAgent : 'Not Assigned'}</span>
                      </div>
                    }
                    {
                      this.state.isAssigned &&
                      (
                        this.state.role === 'team'
                          ? <div>
                            <button style={{ marginTop: '10px' }} className='btn btn-primary' onClick={this.unassignTeam}>Unassign Team</button>
                            <br />
                            <br />
                          </div>
                          : <div>
                            <button style={{ marginTop: '10px' }} className='btn btn-primary' onClick={this.unassignAgent}>Unassign Agent</button>
                            <br />
                            <br />
                          </div>
                      )
                    }
                    {
                      this.props.user && this.props.user.role !== 'agent' &&
                      (
                        this.state.showAssignTeam
                          ? <div className='m-accordion__item'>
                            <div className='m-accordion__item-head'>
                              <span className='m-accordion__item-icon'>
                                <i className='fa fa-users' />
                              </span>
                              <span className='m-accordion__item-title'>Assign to team</span>
                              <span style={{ cursor: 'pointer' }} onClick={this.toggleAssignTeam} className='m-accordion__item-icon'>
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
                                <button style={{ marginTop: '10px' }} className='btn btn-primary' onClick={this.assignToTeam}>Assign</button>
                              </div>
                            </div>
                          </div>
                          : <div className='m-accordion__item'>
                            <div className='m-accordion__item-head collapsed'>
                              <span className='m-accordion__item-icon'>
                                <i className='fa fa-users' />
                              </span>
                              <span className='m-accordion__item-title'>Assign to team</span>
                              <span style={{ cursor: 'pointer' }} onClick={this.toggleAssignTeam} className='m-accordion__item-icon'>
                                <i className='la la-plus' />
                              </span>
                            </div>
                          </div>
                      )
                    }
                    {
                      this.state.showAssignAgent
                        ? <div className='m-accordion__item'>
                          <div className='m-accordion__item-head'>
                            <span className='m-accordion__item-icon'>
                              <i className='fa fa-user' />
                            </span>
                            <span className='m-accordion__item-title'>Assign to agent</span>
                            <span style={{ cursor: 'pointer' }} onClick={this.toggleAssignAgent} className='m-accordion__item-icon'>
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
                              <button style={{ marginTop: '10px' }} className='btn btn-primary' onClick={this.assignToAgent}>Assign</button>
                            </div>
                          </div>
                        </div>
                        : <div className='m-accordion__item'>
                          <div className='m-accordion__item-head collapsed'>
                            <span className='m-accordion__item-icon'>
                              <i className='fa fa-user' />
                            </span>
                            <span className='m-accordion__item-title'>Assign to agent</span>
                            <span style={{ cursor: 'pointer' }} onClick={this.toggleAssignAgent} className='m-accordion__item-icon'>
                              <i className='la la-plus' />
                            </span>
                          </div>
                        </div>
                    }
                  </div>
                }
                {this.props.module !== 'WHATSAPP' &&
                  <div style={{ marginTop: '20px' }} className='m-accordion m-accordion--default'>
                    {
                      this.state.popoverAddTagOpen
                        ? <div className='m-accordion__item' style={{ overflow: 'visible' }}>
                          <div className='m-accordion__item-head'>
                            <span className='m-accordion__item-icon'>
                              <i className='fa fa-tags' />
                            </span>
                            <span className='m-accordion__item-title'>Assign Tags</span>
                            <span style={{ cursor: 'pointer' }} onClick={this.hideAddTag} className='m-accordion__item-icon'>
                              <i className='la la-minus' />
                            </span>
                          </div>
                          <div className='m-accordion__item-body'>
                            <div className='m-accordion__item-content'>
                              <Select.Creatable
                                options={this.state.tagOptions}
                                onChange={this.handleAdd}
                                value={this.state.addTag}
                                placeholder='Add User Tags'
                                menuShouldScrollIntoView={true}
                              />
                              {this.state.saveEnable
                                ? <div className='col-12'>
                                  <button style={{ marginTop: '10px' }}
                                    className='btn btn-primary btn-sm'
                                    onClick={() => { this.addTags() }}>Save
                            </button>
                                </div>
                                : <div className='col-12'>
                                  <button style={{ marginTop: '10px' }}
                                    className='btn btn-primary btn-sm'
                                    disabled>
                                    Save
                            </button>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                        : <div className='m-accordion__item' style={{ overflow: 'visible' }}>
                          <div className='m-accordion__item-head collapsed'>
                            <span className='m-accordion__item-icon'>
                              <i className='fa fa-tags' />
                            </span>
                            <span className='m-accordion__item-title'>Assign Tags</span>
                            <span style={{ cursor: 'pointer' }} onClick={this.showAddTag} className='m-accordion__item-icon'>
                              <i className='la la-plus' />
                            </span>
                          </div>
                        </div>
                    }
                  </div>
                }
              </div>
              {this.props.subscriberTags && this.props.subscriberTags.length > 0 &&
                <div className='row' style={{ minWidth: '150px', padding: '10px' }}>
                  {
                    this.props.subscriberTags.map((tag, i) => (
                      <span key={i} style={{ display: 'flex' }} className='tagLabel'>
                        <label className='tagName'>{tag.tag}</label>
                        <div className='deleteTag' style={{ marginLeft: '10px' }}>
                          <i className='fa fa-times fa-stack' style={{ marginRight: '-8px', cursor: 'pointer' }} onClick={() => this.removeTags(tag.tag)} />
                        </div>
                      </span>
                    ))
                  }
                </div>
              }
              <div className='row'>
                <div className='col-12'>
                  <span style={{ fontWeight: 500, marginLeft: '10px', fontSize: '12px' }}>
                    {this.props.customFieldOptions && this.props.customFieldOptions.length > 0
                      ? <span>
                        <a href='#/' data-toggle='collapse' data-target='#customFields' style={{ color: '#716aca', cursor: 'pointer' }}
                          onClick={this.showToggle}>
                          Custom Fields
                      {this.state.show
                            ? <i style={{ fontSize: '12px' }} className='la la-angle-up ' />
                            : <i style={{ fontSize: '12px' }} className='la la-angle-down ' />
                          }
                        </a>
                      </span>
                      : null
                    }
                    <Link to='/customFields'>
                      <span id='customfieldid' style={{ color: '#716aca', cursor: 'pointer', float: 'right', fontSize: '12px' }}><i className='la la-gear' style={{ fontSize: '13px' }} /> Manage Fields</span>
                    </Link>
                  </span>
                </div>
              </div>

              {this.props.customFieldOptions && this.props.customFieldOptions.length > 0
                ? <div id='customFields' style={{ paddingTop: '15px' }} className='collapse'>
                  {
                    this.props.customFieldOptions.map((field, i) => (
                      <div key={i} className='row'>
                        <div className='col-sm-12'>
                          <div id='target' onClick={() => { this.toggleSetFieldPopover(field) }}
                            onMouseEnter={() => { this.hoverOn(field._id) }}
                            onMouseLeave={this.hoverOff}
                            style={field._id === this.state.hoverId ? hoverOn : hoverOff}>
                            <span style={{ marginLeft: '10px' }}>
                              <span style={{ fontWeight: '100' }}>{field.label} : </span>
                              <span style={{ color: '#3c3c7b' }}>{field.value === "" ? 'Not Set' : field.value}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  <Popover placement='left' className='subscriberPopover' isOpen={this.state.setFieldIndex} target='target' toggle={this.toggleSetFieldPopover}>
                    <PopoverHeader>Set {this.state.selectedField.name} Value</PopoverHeader>
                    <PopoverBody>
                      <div className='row' style={{ minWidth: '250px' }}>
                        <div className='col-12'>
                          <label>Set Value</label>
                          {setFieldInput}
                        </div>
                        <button style={{ float: 'right', margin: '15px' }}
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            this.saveCustomField()
                          }}
                          disabled={this.state.saveFieldValueButton}>
                          Save
                                        </button>
                      </div>
                    </PopoverBody>
                  </Popover>
                </div>
                : <div style={{ padding: '15px', maxHeight: '120px' }}>
                  <span>No Custom Field Found</span>
                </div>}

            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="unsubscribe" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Unsubscribe
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to Unsubscribe this Subscriber?</p>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' onClick={this.unSubscribe} data-dismiss='modal'>
                      Yes
                    </button>
                  </div>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' data-dismiss='modal'>
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ProfileArea.propTypes = {
  'teams': PropTypes.array.isRequired,
  'agents': PropTypes.array.isRequired,
  'subscriberTags': PropTypes.array,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'unSubscribe': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'fetchTeamAgents': PropTypes.func.isRequired,
  'assignToTeam': PropTypes.func.isRequired,
  'assignToAgent': PropTypes.func.isRequired,
  'sendNotifications': PropTypes.func.isRequired,
  'unassignTags': PropTypes.func,
  'tags': PropTypes.array,
  'createTag': PropTypes.func,
  'assignTags': PropTypes.func,
  'tagOptions': PropTypes.array,
  'members': PropTypes.array.isRequired,
  'setCustomFieldValue': PropTypes.func.isRequired
}

export default ProfileArea
