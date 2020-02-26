import React from 'react'
import PropTypes from 'prop-types'
import HEADER from './header'
import MAPCUSTOMER from './mapCustomer'

class Profile extends React.Component {
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
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this)
    this.toggleSetFieldPopover = this.toggleSetFieldPopover.bind(this)
  }

  unSubscribe() {
    //this.props.changeActiveSession('none')
    if (this.props.module === 'WHATSAPP') {
      this.props.unSubscribe(this.props.activeSession._id, { isSubscribed: false, unSubscribedBy: 'agent' }, this.props.msg)
    } else {
      this.props.unSubscribe({ subscriber_id: this.props.activeSession._id, page_id: this.props.activeSession.pageId._id }, this.handleUnsubscribe)
    }
  }

  handleUnsubscribe (res) {
    if (res.status === 'success') {
      this.props.msg.success('Unsubscribed successfully')
      this.props.changeActiveSession('none')
    } else {
      this.props.msg.error('Unable to unsubscribe subscriber')
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

  removeTags(tag) {
    var payload = {}
    var selectedIds = []
    selectedIds.push(this.props.activeSession._id)
    payload.subscribers = selectedIds
    this.setState({
      removeTag: tag.tag
    })
    payload.tagId = tag._id
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
        if (this.props.tags[i].tag === value.label) {
          value.tag_id = this.props.tags[i]._id
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
    payload.tagId = this.state.addTag.tag_id
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
    return (
        <div style={{padding: '0px', border: '1px solid #F2F3F8'}} className='col-xl-3'>
            <div style={{overflow: 'hidden', marginBottom: '0px'}} className='m-portlet' >
                <div style={{ padding: '0rem 1.5rem' }} className='m-portlet__body'>
                    <div className='m-card-profile'>
                        <HEADER
                            activeSession={this.props.activeSession}
                            user={this.props.user}
                            profilePicError={this.props.profilePicError}
                            alertMsg={this.props.alertMsg}
                            changeActiveSession={this.props.changeActiveSession}
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
  'customers': PropTypes.array.isRequired,
  'appendSubscriber': PropTypes.func.isRequired,
  'getCustomers': PropTypes.func.isRequired
}

export default Profile
