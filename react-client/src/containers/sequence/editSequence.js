/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchAllSequence,
  createSequence,
  fetchAllMessages,
  deleteMessage,
  setSchedule,
  setStatus,
  updateSegmentation,
  deleteSequence,
  updateTrigger
} from '../../redux/actions/sequence.action'
import AlertContainer from 'react-alert'
import { Popover, PopoverBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadTags } from '../../redux/actions/tags.actions'
import { allLocales } from '../../redux/actions/subscribers.actions'
import { deleteFiles } from '../../utility/utils'

class CreateSequence extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.addMessageFlag = false
    this.state = {
      isShowingModalDelete: false,
      deleteid: '',
      error: false,
      openPopover: false,
      ShowTrigger: false,
      disabled: true,
      targetValue: '',
      selectedDays: '0',
      condition: 'minutes',
      sequenceId: '',
      isShowingModalSegmentation: false,
      conditions: [{condition: '', criteria: '', value: ''}],
      errorMessages: [],
      joiningCondition: 'AND',
      selectedSequenceId: '',
      selectedMessageId: '',
      validSegmentation: false,
      selectedMessage: '',
      selectedEvent: '',
      displayAction: false,
      selectedMessageClickId: '',
      selectedButton: '',
      buttonList: [],
      eventNameSelected: '',
      time: 'immediately',
      isShowModalSchedule: false,
      isDaysInputDisabled: true,
      isMinutesInputDisabled: true,
      triggerMessage: 'None',
      selectedTriggerMsgId: '',
      selectedTriggerBtnTitle: '',
      dropdownConditionOpen: false,
      genders: ['male', 'female', 'other'],
      segmentation: [],
      showBackWarning: false
    }
    if (props.location.state && (props.location.state.module === 'edit' || props.location.state.module === 'view')) {
      props.fetchAllMessages(this.props.location.state._id)
    }
    props.loadMyPagesList()
    props.loadTags()
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogSegmentation = this.showDialogSegmentation.bind(this)
    this.closeDialogSegmentation = this.closeDialogSegmentation.bind(this)
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.changeConditions = this.changeConditions.bind(this)
    this.createMessage = this.createMessage.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.saveSegmentation = this.saveSegmentation.bind(this)
    this.ShowDialogTrigger = this.ShowDialogTrigger.bind(this)
    this.CloseDialogTrigger = this.CloseDialogTrigger.bind(this)
    this.validateTrigger = this.validateTrigger.bind(this)
    this.saveTriggerMessage = this.saveTriggerMessage.bind(this)
    this.changeTime = this.changeTime.bind(this)
    this.showDialogSchedule = this.showDialogSchedule.bind(this)
    this.closeDialogSchedule = this.closeDialogSchedule.bind(this)
    this.updateMessageTitle = this.updateMessageTitle.bind(this)
    this.toggleCondition = this.toggleCondition.bind(this)
    this.changeConditionToAnd = this.changeConditionToAnd.bind(this)
    this.changeConditionToOr = this.changeConditionToOr.bind(this)
    this.addCondition = this.addCondition.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.changeCriteria = this.changeCriteria.bind(this)
    this.changeText = this.changeText.bind(this)
    this.removeCondition = this.removeCondition.bind(this)
    this.updateTextBox = this.updateTextBox.bind(this)
    this.goBack = this.goBack.bind(this)
    this.closeBackWarning = this.closeBackWarning.bind(this)
    this.removeSegmentation = this.removeSegmentation.bind(this)
    this.removeTrigger = this.removeTrigger.bind(this)
  }

  updateMessageTitle (message) {
    console.log('Trigger event is ', this.triggerEvent)
    let trigMsg = ''
    for(let a = 0; a < this.props.messages.length; a++) {
      let msg = this.props.messages[a]
      if (msg._id === message.trigger.value) {
        trigMsg = msg.title
      }
    }
   // this.setState({triggerMessage: 'When subscriber ' + message.trigger[0].event + ' this ' + trigMsg})
    return 'When subscriber ' + message.trigger.event + ' this ' + trigMsg
  }

  saveSegmentation () {
    if (this.validateSegmentation()) {
      let data = {
        messageId: this.state.selectedMessageId,
        sequenceId: this.state.selectedSequenceId,
        segmentation: this.state.conditions,
        segmentationCondition: this.state.joiningCondition
      }
      console.log('segmentation data', data)
      this.props.updateSegmentation(data)
      this.closeDialogSegmentation()
    }
  }

  removeSegmentation () {
    if (this.validateSegmentation()) {
      let data = {
        messageId: this.state.selectedMessageId,
        sequenceId: this.state.selectedSequenceId,
        segmentation: [],
        segmentationCondition: 'or'
      }
      console.log('segmentation data', data)
      this.props.updateSegmentation(data)
      this.closeDialogSegmentation()
    }
  }

  changeConditionToAnd () {
    this.setState({
      joiningCondition: 'AND'
    })
  }
  changeConditionToOr () {
    this.setState({
      joiningCondition: 'OR'
    })
  }

  removeCondition (e, index) {
    var tempConditions = this.state.conditions
    for (var i = 0; i < tempConditions.length; i++) {
      if (i === index) {
        tempConditions.splice(i, 1)
      }
    }
    this.setState({
      conditions: tempConditions
    })
  }

  changeConditions (e, index) {
    var conditions = this.state.conditions
    for (var i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].condition = e.target.value
      }
    }
    this.setState({conditions: conditions})
  }
  changeCondition (e, index) {
    this.setState({condition: e.target.value})
  }
  changeCriteria (e, index) {
    var conditions = this.state.conditions
    for (var i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].criteria = e.target.value
      }
    }
    this.setState({conditions: conditions})
  }
  changeText (e, index) {
    var conditions = this.state.conditions
    for (var i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].value = (e.target.value).trim()
        console.log('value: ' + conditions[i].value)
      }
    }
    this.setState({conditions: conditions})
  }
  addCondition () {
    this.setState({errorMessages: []})
    var conditions = this.state.conditions
    conditions.push({condition: '', criteria: '', value: ''})
    this.setState({
      conditions: conditions
    })
  }

  validateSegmentation () {
    let errors = false
    let errorMessages = []
    let conditionErrors = []
    let conditionError = {}
    let isErrorInCondition = false
    for (let i = 0; i < this.state.conditions.length; i++) {
      if (this.state.conditions[i].condition === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'condition', index: i, message: 'Please choose a valid condition'}
        conditionErrors.push(conditionError)
      }
      if (this.state.conditions[i].criteria === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'criteria', index: i, message: 'Please choose a valid criteria'}
        conditionErrors.push(conditionError)
      }
      if (this.state.conditions[i].value === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'text', index: i, message: 'Please choose a valid value'}
        conditionErrors.push(conditionError)
      }
    }
    if (isErrorInCondition) {
      errorMessages.push({error: 'conditions', message: conditionErrors})
      this.setState({errorMessages: errorMessages})
    }
    return !errors
  }

  goBack () {
    if (this.props.messages.length === 0) {
      this.setState({showBackWarning: true})
      this.refs.backWarning.click()
    } else {
      this.props.history.push({
        pathname: `/sequenceMessaging`
      })
    }
  }

  componentWillUnmount () {
    console.log('componentWillUnmount called', this.addMessageFlag)
    if (this.props.messages.length === 0 && !this.addMessageFlag){
      this.props.deleteSequence(this.state.sequenceId)
    }
  }

  closeBackWarning () {
    this.setState({showBackWarning: false})
  }

  gotoView (message) {
    //  this.props.createSequence({name: this.state.name})
    if (message.payload && message.payload.length > 0) {
      this.props.history.push({
        pathname: `/viewMessage`,
        state: {title: message.title, name: this.props.location.state.name, payload: message.payload, id: this.state.sequenceId, messageId: message._id}
      })
    } else {
      this.props.history.push({
        pathname: `/createMessageSeq`,
        state: {title: message.title, payload: message.payload, id: this.state.sequenceId, messageId: message._id}
      })
    }
  }
  saveTriggerMessage () {
    this.props.updateTrigger({
      trigger: {
        event: this.state.eventNameSelected,
        value: this.state.selectedMessageClickId,
        buttonId: this.state.selectedButton },
      type: 'message',
      messageId: this.state.selectedMessageId
    }, this.msg)

    this.props.fetchAllMessages(this.state.sequenceId)
    this.setState({ShowTrigger: false})
  }
  removeTrigger () {
    this.props.updateTrigger({
      trigger: {
        event: 'none',
        value: null
      },
      type: 'message',
      messageId: this.state.selectedMessageId
    }, this.msg)

    this.props.fetchAllMessages(this.state.sequenceId)
    this.setState({ShowTrigger: false})
  }
  validateTrigger () {
    console.log('validating TRIGGER')
    if (this.state.eventNameSelected === 'clicks') {
      if (this.state.selectedMessageClickId === '') {
        return false
      } else {
        if (this.state.selectedButton === '') {
          return false
        } else {
          return true
        }
      }
    } else if (this.state.eventNameSelected !== '') {
      if (this.state.selectedMessageClickId === '') {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }
  ShowDialogTrigger (message) {
    console.log('the  is', message._id)
    if (message.trigger.event === 'none') {
      this.setState({ShowTrigger: true, selectedSequenceId: message.sequenceId, selectedMessageId: message._id, triggerEvent: message.trigger.event})
      this.refs.triggerIsNone.click()
    } else {
      this.setState({ShowTrigger: true, selectedSequenceId: message.sequenceId, selectedMessageId: message._id, triggerEvent: message.trigger.event, eventNameSelected: message.trigger.event, selectedTriggerMsgId: message.trigger.value, selectedMessageClickId: message.trigger.value, selectedTriggerBtnTitle: message.trigger.buttonTitle, selectedButton: message.trigger.buttonId})
      this.refs.triggerIsNotNone.click()
    }
    if (message.trigger.event !== 'none' && message.trigger.event === 'clicks') {
      console.log('Display action set true')
      this.setState({displayAction: true})
    } else if (message.trigger.event !== 'none' && message.trigger.event !== 'clicks') {
      console.log('Display action set false')
      this.setState({displayAction: false})
    }
  }
  onSelectedDropDownButton (buttonTitle) {
    console.log('Button title name is ', buttonTitle)
    this.setState({selectedButton: buttonTitle})
  }
  onSelectedMessage (Message) {
    console.log('Selected Message id is:', Message)
    let buttonList = []
    for(let a = 0; a < this.props.messages.length; a++) {
      let message = this.props.messages[a]
      if (message._id === Message) {
        console.log('Selected Message name is:', message.title)
        for(let b = 0; b < message.payload.length; b++) {
          let payload = message.payload[b]
          if (payload.buttons) {
            for(let c = 0; c < payload.buttons.length; c++) {
              let button = payload.buttons[c]
              if (button.type === 'postback')
              buttonList.push(button)
            }
          }
        }
      }
    }
    console.log('The buttonList is  ', buttonList)
    this.setState({buttonList: buttonList, selectedMessageClickId: Message})
  }
  onSelectedOption (menu) {
    console.log('Menu is ', menu)
    if (menu === 'clicks') {
      this.setState({displayAction: true, eventNameSelected: menu})
      console.log('Display action set true')
      let buttonList = []
      for(let a = 0; a < this.props.messages.length; a++) {
        let message = this.props.messages[a]
        if (message._id === this.state.selectedMessageClickId) {
          console.log('Selected Message name is:', message.title)
          for(let b = 0; b < message.payload.length; b++) {
            let payload = message.payload[b]
            if (payload.buttons) {
              for(let c = 0; c < payload.buttons.length; c++) {
                let button = payload.buttons[c]
                buttonList.push(button)
              }
            }
          }
        }
      }
      console.log('The buttonList is  ', buttonList)
      this.setState({buttonList: buttonList})
    } else {
      this.setState({displayAction: false, eventNameSelected: menu, selectedButton: ''})
      console.log('Display action set false')
    }
  }

  changeStatus (e, id) {
    this.props.setStatus({ messageId: id, isActive: e.target.checked }, this.state.sequenceId)
  }

  onDaysChange (e) {
    this.setState({selectedDays: e.target.value})
  }

  handleClick (value, i) {
    console.log('value', value)
    console.log('this.props.messages[i]', this.props.messages[i])
    this.setState({condition: this.props.messages[i].schedule.condition, selectedDays: this.props.messages[i].schedule.days, messageId: value})
    var val = 'buttonTarget-' + value
    this.setState({disabled: true, targetValue: val})
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false, title: '', url: ''})
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }

  handleDone () {
    this.setState({openPopover: !this.state.openPopover})
    if (this.state.time === 'immediately') {
      this.props.setSchedule({condition: 'immediately', days: '0', date: 'immediately', messageId: this.state.selectedMessageId, sequenceId: this.state.sequenceId})
      this.closeDialogSchedule()
      this.props.fetchAllMessages(this.state.sequenceId)
    } else {
      var d1 = new Date()
      if (this.state.condition === 'hours') {
        d1.setHours(d1.getHours() + Number(this.state.selectedDays))
      } else if (this.state.condition === 'minutes') {
        d1.setMinutes(d1.getMinutes() + Number(this.state.selectedDays))
      } else if (this.state.condition === 'day(s)') {
        d1.setDate(d1.getDate() + Number(this.state.selectedDays))
      }
      let utcDate = new Date(d1)   // We can keep the date for queue schedule purposes == don't remvoe it
      this.props.setSchedule({condition: this.state.condition, days: this.state.selectedDays, date: utcDate, messageId: this.state.selectedMessageId, sequenceId: this.state.sequenceId})
      this.closeDialogSchedule()
      this.props.fetchAllMessages(this.state.sequenceId)
    }
  }

  createMessage () {
    this.addMessageFlag = true
    var d1 = new Date()
    d1.setDate(d1.getDate() + 1)
    var utcDate = new Date(d1).toISOString()
    let payload = {
      schedule: {condition: 'day(s)', days: '1', date: utcDate},
      title: 'New Message',
      payload: []
    }
    this.props.history.push({
      pathname: `/createMessageSeq`,
      state: {
        data: payload,
        payload: [],
        title: 'New Message',
        action: 'create',
        name: this.props.location.state.name,
        sequenceId: this.state.sequenceId
      }
    })
  }

  changeTime (event) {
    this.setState({time: event.target.value})
    if (event.target.value === 'immediately') {
      this.setState({isDaysInputDisabled: true, isMinutesInputDisabled: true, selectedDays: 0, condition: 'minutes'})
    } else {
      this.setState({isDaysInputDisabled: false, isMinutesInputDisabled: false, selectedDays: 0, condition: 'minutes'})
    }
  }

  toggleCondition () {
    this.setState({dropdownConditionOpen: !this.state.dropdownConditionOpen})
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  showDialogSegmentation (message) {
    console.log('show dialog segmentation', message)
    this.props.fetchAllMessages(this.state.sequenceId)
    this.setState({isShowingModalSegmentation: true, selectedSequenceId: message.sequenceId, selectedMessageId: message._id, conditions: message.segmentation.length > 0 ? message.segmentation : [{condition: '', criteria: '', value: ''}], joiningCondition: message.segmentationCondition})
  }
  closeDialogSegmentation () {
    console.log('closing segmentation dialog', this.props.messages)
    this.setState({isShowingModalSegmentation: false, errorMessages: []})
  }
  CloseDialogTrigger (message) {
    this.setState({ShowTrigger: false, displayAction: false, buttonList: [], selectedButton: '', selectedMessageClickId: ''})
  }

  showDialogSchedule (message) {
    this.setState({isShowModalSchedule: true,
      selectedSequenceId: message.sequenceId,
      selectedMessageId: message._id,
      selectedDays: message.schedule.days
    })
    if (message.schedule.condition !== 'immediately') {
      this.setState({time: 'after'})
      this.setState({condition: message.schedule.condition})
    } else {
      this.setState({condition: message.schedule.conditions})
    }
  }

  closeDialogSchedule () {
    this.setState({isShowModalSchedule: false})
  }

  componentDidMount () {
    this.scrollToTop()
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      this.setState({sequenceId: this.props.location.state._id})
    } else if (this.props.location.state && this.props.location.state.module === 'view') {
      this.setState({sequenceId: this.props.location.state._id})
    }
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Edit Sequence`;
  }
  updateName (e) {
    this.setState({name: e.target.value, error: false})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.location.state.module === 'create' && (nextProps.createdSequence && nextProps.createdSequence !== '')) {
      this.setState({sequenceId: nextProps.createdSequence._id})
      this.props.fetchAllMessages(nextProps.createdSequence._id)
    }
    if (nextProps.messages) {
      // this.setState({condition: nextProps.messages.schedule.condition, selectedDays: nextProps.messages.schedule.selectedDays})
    }
  }

  updateTextBox (i, condition) {
    console.log('textbox condition', condition)
    if (condition.condition === 'page') {
      return (
        <select className='form-control m-input' onChange={(e) => this.changeText(e, i)} value={condition.value}>
          <option disabled selected value>Select a Page</option>
          {
                this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                  <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                ))
            }
        </select>
      )
    } else if (condition.condition === 'gender') {
      return (
        <select className='form-control m-input' onChange={(e) => this.changeText(e, i)} value={condition.value} >
          <option disabled selected value>Select a Gender</option>
          {
                this.state.genders && this.state.genders.length > 0 && this.state.genders.map((gender, i) => (
                  <option key={i} value={gender}>{gender}</option>
                ))
            }
        </select>
      )
    } else if (condition.condition === 'tag') {
      return (
        <select className='form-control m-input' onChange={(e) => this.changeText(e, i)} value={condition.value}>
          <option disabled selected value>Select a Tag</option>
          {
            this.props.tags && this.props.tags.length > 0 && this.props.tags.map((tag, i) => (
              <option key={i} value={tag._id}>{tag.tag}</option>
            ))
        }
        </select>
      )
    } else if (condition.condition === 'locale') {
      return (
        <select className='form-control m-input' onChange={(e) => this.changeText(e, i)} value={condition.value}>
          <option disabled selected value>Select a Locale</option>
          {
            this.props.locales && this.props.locales.map((locale, i) => (
              <option key={i} value={locale}>{locale}</option>
            ))
          }
        </select>
      )
    } else {
      return (
        <input className='form-control m-input'
          onChange={(e) => this.changeText(e, i)}
          value={condition.value}
          id='text'
          placeholder='Value'
          type={condition.condition === 'subscription_date' ? 'date' : 'text'} />
      )
    }
  }

  initializeSwitch (state, id) {
    var self = this
    var temp = '#' + id
    /* eslint-disable */
    $(temp).bootstrapSwitch({
      /* eslint-enable */
      state: state
    })
    /* eslint-disable */
    $(temp).on('switchChange.bootstrapSwitch', function (event, state) {
      if (state === true) {
        self.props.setStatus({_id: event.target.attributes.id.nodeValue, isActive: true}, self.state.sequenceId)
      } else {
        self.props.setStatus({_id: event.target.attributes.id.nodeValue, isActive: false}, self.state.sequenceId)
      }
    })
  }
  render () {
    console.log('editSequence state', this.state)
    console.log('message props', this.props.messages)
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ float: 'left', clear: 'both' }}
          ref={(el) => { this.top = el }} />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Message
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to delete this Message?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    let message = this.props.messages.find(m => m._id === this.state.deleteid)
                    deleteFiles(message.payload)
                    this.props.deleteMessage(this.state.deleteid, this.msg, this.state.sequenceId)
                    this.closeDialogDelete()
                  }} data-dismiss='modal'>Delete
                  </button>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='backWarning' data-toggle="modal" data-target="#backWarning">backWarning</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="backWarning" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Warning!
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>You have not added any messages in the sequence. Your changes will be discarded. Do you want to continue?</p>
                <button
                  className='btn btn-primary btn-sm pull-right'
                  onClick={() => {
                    this.props.deleteSequence(this.state.sequenceId)
                    this.props.history.push({ pathname: '/sequenceMessaging' })
                  }} data-dismiss='modal'>Yes
                  </button>
                <button
                  style={{ marginRight: '5px' }}
                  className='btn btn-secondary btn-sm pull-right'
                  onClick={() => { this.closeBackWarning() }}
                  data-dismiss='modal'
                >No
                  </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="segmentation" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Segmentation
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div className='form-group m-form__group col-12' style={{ marginBottom: '20px', color: '#337ab7', display: 'flex' }}>
                  <Dropdown id='switchCondition' style={{ marginLeft: '10px' }} isOpen={this.state.dropdownConditionOpen} toggle={this.toggleCondition}>
                    <DropdownToggle caret>
                      Change Joining Condition
                          </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={this.changeConditionToAnd}>all of the following conditions</DropdownItem>
                      <DropdownItem onClick={this.changeConditionToOr}>any of the following conditions</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                  <div style={{ marginBottom: '10px' }}>Segment subscribers based on<span id='switchCondition' style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{this.state.joiningCondition === 'OR' ? ' any of the following conditions' : ' all of the following conditions'}:</span></div>
                  <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table'
                      id='m-datatable--27866229129' style={{
                        display: 'block',
                        height: 'auto',
                        overflowX: 'auto'
                      }}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{ height: '53px' }}>
                          <th data-field='title'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{ width: '25%' }}>
                            <span>Condition</span>
                          </th>
                          <th data-field='title'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{ width: '25%' }}>
                            <span>Criteria</span>
                          </th>
                          <th data-field='text'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{ width: '25%' }}>
                            <span>Value</span>
                          </th>
                          <th data-field='remove'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort' style={{ width: '25%' }}>
                            <span />
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{ textAlign: 'center' }}>
                        {
                          this.state.conditions.map((condition, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{ height: '55px' }} key={i}>
                              <td data-field='title'
                                className='m-datatable__cell' style={{ width: '25%' }}>
                                <select className='form-control m-input' onChange={(e) => this.changeConditions(e, i)}
                                  value={condition.condition} >
                                  <option value=''>Select Condition</option>
                                  <option value='first_name'>First Name</option>
                                  <option value='last_name'>Last Name</option>
                                  <option value='page'>Page</option>
                                  <option value='gender'>Gender</option>
                                  <option value='locale'>Locale</option>
                                  <option value='tag'>Tag</option>
                                  <option value='subscription_date'>Subscribed</option>
                                </select>
                                <span className='m-form__help'>
                                  {
                                    this.state.errorMessages.map((m) => (
                                      m.error === 'conditions' && m.message.map((msg) => {
                                        return (msg.field === 'condition' && msg.index === i &&
                                          <span style={{ color: 'red' }}>{msg.message}</span>
                                        )
                                      })
                                    ))
                                  }
                                </span>
                              </td>
                              <td data-field='title'
                                className='m-datatable__cell' style={{ width: '25%' }}>
                                {this.state.conditions[i].condition === 'subscription_date' || this.state.conditions[i].condition === 'reply'
                                  ? <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                    value={condition.criteria}>
                                    <option value=''>Select Criteria</option>
                                    <option value='on'>on</option>
                                    <option value='before'>Before</option>
                                    <option value='after'>After</option>
                                  </select>
                                  :
                                  <div>
                                    {
                                      this.state.conditions[i].condition === 'first_name' || this.state.conditions[i].condition === 'last_name' ?
                                        <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                          value={condition.criteria}>
                                          <option value=''>Select Criteria</option>
                                          <option value='is'>is</option>
                                          <option value='contains'>contains</option>
                                          <option value='begins_with'>begins with</option>
                                        </select>
                                        :
                                        <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                          value={condition.criteria}>
                                          <option value=''>Select Criteria</option>
                                          <option value='is'>is</option>
                                        </select>
                                    }
                                  </div>
                                }

                                <span className='m-form__help'>
                                  {
                                    this.state.errorMessages.map((m) => (
                                      m.error === 'conditions' && m.message.map((msg) => {
                                        return (msg.field === 'criteria' && msg.index === i &&
                                          <span style={{ color: 'red' }}>{msg.message}</span>
                                        )
                                      })
                                    ))
                                  }
                                </span>
                              </td>
                              <td data-field='title'
                                className='m-datatable__cell' style={{ width: '25%' }}>
                                {
                                  this.updateTextBox(i, this.state.conditions[i])
                                }

                                <span className='m-form__help'>
                                  {
                                    this.state.errorMessages.map((m) => (
                                      m.error === 'conditions' && m.message.map((msg) => {
                                        return (msg.field === 'text' && msg.index === i &&
                                          <span style={{ color: 'red' }}>{msg.message}</span>
                                        )
                                      })
                                    ))
                                  }
                                </span>
                              </td>
                              <td data-field='title'
                                className='m-datatable__cell' style={{ width: '25%' }}>
                                {(this.state.conditions.length > 1)
                                  ? <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={(e) => this.removeCondition(e, i)} >
                                    Remove
                                      </button>
                                  : <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' disabled >
                                    Remove
                                     </button>
                                }
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    <button style={{ margin: '15px' }} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={this.addCondition}>
                      + Add Condition
                         </button>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button onClick={() => this.saveSegmentation()} data-dismiss='modal' className='btn btn-primary btn-md' style={{ marginLeft: '20px', marginTop: '20px' }}> Save </button>
                  <button onClick={() => this.closeDialogSegmentation()} data-dismiss='modal' style={{ color: '#333', backgroundColor: '#fff', borderColor: '#ccc', marginLeft: '20px', marginTop: '20px' }} className='btn'> Cancel </button>
                  {
                    this.state.conditions.length > 0 && this.state.conditions[0].value !== '' &&
                    <button onClick={() => this.removeSegmentation()} style={{ color: '#333', backgroundColor: '#fff', borderColor: '#ccc', marginLeft: '20px', marginTop: '20px' }} data-dismiss='modal' className='btn'> Remove Segmentation </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='triggerIsNone' data-toggle="modal" data-target="#triggerIsNone">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="triggerIsNone" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Trigger Message
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div style={{ marginBottom: '20px' }}>  <p>This message will be triggerred when: </p>
                  <div className='row'><p style={{ marginLeft: '13px', marginTop: '7px' }}>Subscriber</p>
                    <select className='form-control m-input' onChange={(e) => this.onSelectedOption(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px', minWidth: '110px', width: '150px' }}>
                      <option disabled selected value>Select Event </option>
                      <option value='sees'>sees</option>
                      <option value='clicks'>clicks</option>
                      <option value='receives'>receives</option>
                    </select>
                    <select className='form-control m-input' onChange={(e) => this.onSelectedMessage(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px', minWidth: '110px', width: '150px' }}>
                      <option disabled selected value>Select Message </option>
                      {
                        this.props.messages && this.props.messages.map((message, i) => {
                          if (this.state.selectedMessageId != message._id) {
                            return <option value={message._id}>{message.title}</option>
                          }
                        })}
                    </select>
                    {
                      this.state.displayAction &&
                      <select className='form-control m-input' onChange={(e) => this.onSelectedDropDownButton(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px', minWidth: '110px', width: '150px' }}>
                        <option disabled selected value>Select Button </option>
                        {
                          this.state.buttonList.map((button, i) => {
                            return <option value={button.buttonId}>{button.title}</option>
                          })}
                      </select>
                    }
                  </div>
                </div>
                <button onClick={() => this.saveTriggerMessage()} data-dismiss='modal' className='btn btn-primary btn-md pull-right' style={{ marginLeft: '20px' }} disabled={!this.validateTrigger()}> Save </button>
                <button onClick={() => this.CloseDialogTrigger()} data-dismiss='modal' style={{ color: '#333', backgroundColor: '#fff', borderColor: '#ccc' }} className='btn pull-right'> Cancel </button>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='triggerIsNotNone' data-toggle="modal" data-target="#triggerIsNotNone">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="triggerIsNotNone" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Trigger Message
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div style={{ marginBottom: '20px' }}>  <p>This message will be triggerred when: </p>
                  <div className='row'>
                    <p style={{ marginTop: '7px', marginLeft: '13px' }}>Subscriber</p>
                    <select className='form-control m-input' onChange={(e) => this.onSelectedOption(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px', minWidth: '110px', width: '150px' }}>
                      <option selected={this.state.triggerEvent === 'clicks' ? true : null} value='clicks'>clicks</option>
                      <option selected={this.state.triggerEvent === 'sees' ? true : null} value='sees'>sees</option>
                      <option selected={this.state.triggerEvent === 'receives' ? true : null} value='receives'>receives</option>
                    </select>
                    <select className='form-control m-input' onChange={(e) => this.onSelectedMessage(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px', minWidth: '110px', width: '150px' }}>
                      {
                        this.props.messages && this.props.messages.map((message, i) => {
                          if (this.state.selectedTriggerMsgId == message._id) {
                            return <option selected value>{message.title} </option>
                          }
                        })
                      }
                      {
                        this.props.messages && this.props.messages.map((message, i) => {
                          if (this.state.selectedMessageId != message._id && this.state.selectedTriggerMsgId != message._id) {
                            return <option value={message._id}>{message.title}</option>
                          }
                        })}

                    </select>
                    {
                      this.state.displayAction &&
                      <select className='form-control m-input' onChange={(e) => this.onSelectedDropDownButton(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px', minWidth: '110px', width: '150px' }}>
                        {this.state.selectedTriggerBtnTitle !== '' ?
                          <option selected value>{this.state.selectedTriggerBtnTitle} </option>
                          :
                          <option disabled selected value>Select Button </option>
                        }
                        {
                          this.state.buttonList.map((button, i) => {
                            if (button.title != this.state.selectedTriggerBtnTitle) {
                              return <option value={button.title}>{button.title}</option>
                            }
                          })}
                      </select>
                    }
                  </div>
                </div>

                <button onClick={() => this.saveTriggerMessage()} data-dismiss='modal' className='btn btn-primary btn-md pull-right' style={{ marginLeft: '20px' }} disabled={!this.validateTrigger()}> Save </button>
                <button onClick={() => this.CloseDialogTrigger()} data-dismiss='modal' style={{ color: '#333', backgroundColor: '#fff', borderColor: '#ccc', marginLeft: '20px' }} className='btn pull-right'> Cancel </button>
                <button onClick={() => this.removeTrigger()} style={{ color: '#333', backgroundColor: '#fff', borderColor: '#ccc' }} className='btn pull-right'> Remove Trigger </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="schedule" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Schedule Message
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-sm-12'>
                    <p>Send this message:</p>
                  </div>
                </div>
                <div className='row'>
                  {console.log('this.state.condition', this.state.condition)}
                  <div className='col-lg-5 col-md-5 col-sm-5' style={{ marginBottom: '10px' }}>
                    <select className='form-control m-input' onChange={(e, i) => this.changeTime(e, i)}
                      value={this.state.time}>
                      <option value='after'>After</option>
                      <option value='immediately'>Immediately</option>
                    </select>
                  </div>
                  <div className='col-lg-3 col-md-3 col-sm-3'>
                    <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange}
                      disabled={this.state.time === 'immediately'} />
                  </div>
                  <div className='col-lg-4 col-md-4 col-sm-4'>
                    <select className='form-control m-input' disabled={this.state.time === 'immediately'}
                      value={this.state.condition} onChange={(e, i) => this.changeCondition(e, i)} >
                      <option value='minutes'>Minutes</option>
                      <option value='hours'>Hours</option>
                      <option value='day(s)'>Day(s)</option>
                    </select>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-sm-12'><br></br>
                    <p>after the user is subscribed to this sequence</p>
                  </div>
                </div>
                <button onClick={this.handleDone} data-dismiss='modal' className='btn btn-primary btn-md pull-right' style={{ marginLeft: '20px' }} > Save </button>
                <button onClick={() => this.closeDialogSchedule()} data-dismiss='modal' style={{ color: '#333', backgroundColor: '#fff', borderColor: '#ccc' }} className='btn pull-right'> Cancel </button>
              </div>
            </div>
          </div>
        </div>
            <div className='m-content'>
              <div className='m-portlet  m-portlet--full-height '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                         {this.props.location.state.name}
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                      <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.createMessage}>
                        <span>
                          <i className='la la-plus' />
                          <span>
                              Add Message
                            </span>
                        </span>
                      </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  {this.props.messages && this.props.messages.length > 0
                  ? <div className='row'>
                    <div className='col-12'>
                      <p style={{marginTop: '10px'}}> <b>Note:</b> Subscribers who are engaged in live chat with an agent, will receive messages from this sequence after 30 mins of ending the conversation.</p>
                    </div>
                    <div className='col-12'>
                      <p style={{marginTop: '10px'}}> {this.props.location.state.trigger === 'subscriber_joins' ? 'Note: Messages of this sequence will be sent after welcome message' : '' }</p>
                    </div>

                    {this.state.targetValue &&
                    <Popover placement='right' isOpen={this.state.openPopover} style={{marginTop: '55px'}} target={this.state.targetValue} toggle={this.handleToggle}>
                      <PopoverBody style={{height: '230px'}}>
                        <div>
                          <label style={{fontWeight: 'normal'}}>This message will be sent</label>
                          <br /><br />
                            { this.state.condition !== 'immediately'
                              ? <div className='row'>
                              <div className='col-lg-6 col-md-6 col-sm-6'>
                               <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                               </div>
                               {console.log('this.state.condition', this.state.condition)}
                               <div className='col-lg-6 col-md-6 col-sm-6'>
                                 <select className='form-control m-input' onChange={(e, i) => this.changeCondition(e, i)}
                                   value={this.state.condition}>
                                   <option value='immediately'>Immediately</option>
                                   <option value='minutes'>Minutes</option>
                                   <option value='hours'>Hours</option>
                                   <option value='day(s)'>Day(s)</option>
                                 </select>
                               </div>
                             </div>
                             : <select className='form-control m-input' onChange={(e, i) => this.changeCondition(e, i)}
                              value={this.state.condition}>
                              <option value='immediately'>Immediately</option>
                              <option value='minutes'>Minutes</option>
                              <option value='hours'>Hours</option>
                              <option value='days'>Day(s)</option>
                            </select>
                          }
                          <br />
                            <label style={{fontWeight: 'normal'}}>after a user is subscribed to this sequence</label>
                            <br /><br />
                          <button onClick={this.handleDone} className='btn btn-primary btn-sm pull-right'> Done </button>
                          <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
                          <br />
                          <br />
                        </div>
                      </PopoverBody>
                    </Popover>
                  }
                      <div className='m-list-timeline'>
                        <div className='m-list-timeline__items'>
                          {
                          <div>
                            {this.props.messages.map((message, i) => (
                            <div key={i} className='m-list-timeline__item'>
                                    <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
                                    <div className='sequence-box' style={{paddingBottom: 0}}>
                                  <div className='sequence-close-icon' data-toggle="modal" data-target="#delete" onClick={() => this.showDialogDelete(message._id)}/>

                                  <span>
                                    <span className='sequence-link sequence-name' style={{display: 'block'}} onClick={() => this.gotoView(message)}>
                                      {message.title}
                                    </span>
                                    <br />

                                    <span style={{display: 'inline-block', marginBottom: '10px'}}>
                                      <span>Trigger</span>:
                                        <span className='sequence-trigger' style={{marginLeft: '10px'}}>
                                         {

                                           message.trigger.event === 'none' ? 'None' : this.updateMessageTitle(message)

                                         }
                                        </span>
                                        <span onClick={() => this.ShowDialogTrigger(message)} className='sequence-link'> -- Edit</span>
                                    </span>

                                    {/* <span style={{display: 'block'}}>
                                      <span>Schedule</span>:
                                        <span className='sequence-trigger' style={{marginLeft: '10px'}}>
                                          Immediately
                                        </span>
                                        <span className='sequence-link' id={'buttonTarget-' + message._id} ref={(b) => { this.target = b }} onClick={() => this.handleClick(message._id, i)}> -- Edit</span>
                                    </span> */}

                                    <span style={{display: 'block'}}>
                                      <span>Schedule</span>:
                                        <span className='sequence-trigger' style={{marginLeft: '10px'}}>
                                        {message.schedule.condition === 'immediately' ? 'Immediately' : 'After ' + message.schedule.days + ' ' + message.schedule.condition   }
                                        </span>
                                      <span data-toggle="modal" data-target="#schedule" onClick={() => this.showDialogSchedule(message)} className='sequence-link'> -- Edit</span>
                                    </span>

                                    <span style={{display: 'inlineblock'}}>
                                      <span>Segment</span>:
                                        <span className='sequence-trigger' style={{marginLeft: '10px'}}>
                                          {message.segmentation.length === 0 ? 'None' : 'Segmented'}
                                        </span>
                                        <span data-toggle="modal" data-target="#segmentation" onClick={() => this.showDialogSegmentation(message)} className='sequence-link'> -- Edit</span>
                                    </span>
                                  </span>

                                  <span style={{position: 'relative', bottom: '60px', left: '40%'}}>
                                    <span className='sequence-text sequence-centered-text' style={{marginLeft: '10%'}}>
                                      <span className='sequence-number'>{message.sent}</span>
                                      <br />
                                      <span>Sent</span>
                                    </span>

                                    <span className='sequence-text sequence-centered-text' style={{marginLeft: '4%'}}>
                                      <span className='sequence-number'>{message.seen}</span>
                                      <br />
                                      <span>Seen</span>
                                    </span>

                                    <span className='sequence-text sequence-centered-text' style={{marginLeft: '4%'}}>
                                      <span className='sequence-number'>{message.clicks}</span>
                                      <br />
                                      <span>Clicked</span>
                                    </span>
                                  </span>
                                </div>
                                </div>
                            ))
                            }

                              </div>
                            }
                  </div>
                </div>
            </div>
            : <div> No data to display</div>
          }

          </div>
          <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
            <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px', 'marginBottom': '25px'}}>
              <button
                onClick={this.goBack}
                className='btn btn-primary' style={{'marginLeft': '10px'}}>
                Back
              </button>
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
    sequences: (state.sequenceInfo.sequences),
    createdSequence: (state.sequenceInfo.createdSequence),
    messages: (state.sequenceInfo.messages),
    pages: (state.pagesInfo.pages),
    tags: (state.tagsInfo.tags),
    locales: (state.subscribersInfo.locales)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllSequence: fetchAllSequence,
    createSequence: createSequence,
    fetchAllMessages: fetchAllMessages,
    deleteMessage: deleteMessage,
    setSchedule: setSchedule,
    updateTrigger: updateTrigger,
    setStatus: setStatus,
    loadMyPagesList: loadMyPagesList,
    updateSegmentation: updateSegmentation,
    loadTags: loadTags,
    allLocales: allLocales,
    deleteSequence
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSequence)
