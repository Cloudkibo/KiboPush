/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadAllSubscribersListNew, allLocales, subscribe, unSubscribe, updatePicture } from '../../redux/actions/subscribers.actions'
import { assignTags, unassignTags, loadTags, createTag } from '../../redux/actions/tags.actions'
import { setCustomFieldValue, loadCustomFields } from '../../redux/actions/customFields.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { fetchAllSequence, subscribeToSequence, unsubscribeToSequence, getSubscriberSequences } from '../../redux/actions/sequence.action'
import fileDownload from 'js-file-download'
import { Popover, PopoverHeader, PopoverBody, UncontrolledTooltip } from 'reactstrap'
import Select from 'react-select'
import AlertContainer from 'react-alert'
import EditTags from './editTags'
import AlertMessage from '../../components/alertMessages/alertMessage'
import moment from 'moment'
import YouTube from 'react-youtube'
import {localeCodeToEnglish} from '../../utility/utils'
var json2csv = require('json2csv')

class Subscriber extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      subscribersData: [],
      subscribersDataAll: [],
      totalLength: 0,
      filterByGender: '',
      filterByLocale: '',
      filterByPage: '',
      filteredData: '',
      filterByTag: '',
      filterBySource: '',
      searchValue: '',
      statusValue: '',
      tagValue: '',
      filterPage: '',
      filterGender: '',
      filterLocale: '',
      filterSource: '',
      selectedSubscribers: [],
      dropdownActionOpen: false,
      popoverAddTagOpen: false,
      popoverAddTagOpenIndividual: false,
      popoverRemoveTagOpen: false,
      openSubscribeToSequence: false,
      openUnsubscribeToSequence: false,
      popoverAddSeqInd: false,
      seqValueInd: '',
      addTag: '',
      addTagIndividual: '',
      removeTag: '',
      sequenceValue: '',
      options: [],
      sequenceOptions: [],
      selectAllChecked: null,
      saveEnable: false,
      pageSelected: 0,
      subscriber: {},
      filter: false,
      status_value: '',
      saveEnableIndividual: false,
      saveEnableSeq: false,
      saveEnableSeqInd: false,
      setFieldIndex: false,
      show: false,
      selectedField: {},
      hoverId: '',
      saveFieldValueButton: true,
      oldSelectedFieldValue: '',
      popoverSetCustomField: false,
      customFieldOptions: [],
      selectedBulkField: null,
      saveBulkFieldDisable: true,
      createCustomField: false,
      selectedTagValue: '',
      subscribersLoaded: false
    }
    props.allLocales()
    props.fetchAllSequence()
    props.loadMyPagesList()
    // if (!this.props.location.state) {
    //   props.loadAllSubscribersListNew({ last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: { search_value: '', gender_value: '', page_value: '', locale_value: '', tag_value: '', status_value: '' } })
    // }
    props.loadTags()
    props.loadCustomFields()
    this.handleAdd = this.handleAdd.bind(this)
    this.handleAddIndividual = this.handleAddIndividual.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.toggleTag = this.toggleTag.bind(this)
    this.toggleAdd = this.toggleAdd.bind(this)
    this.toggleAddIndividual = this.toggleAddIndividual.bind(this)
    this.toggleRemove = this.toggleRemove.bind(this)
    this.toggleSubscribe = this.toggleSubscribe.bind(this)
    this.toggleUnSubscribe = this.toggleUnSubscribe.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handleFilterByGender = this.handleFilterByGender.bind(this)
    this.handleFilterByLocale = this.handleFilterByLocale.bind(this)
    this.handleFilterByPage = this.handleFilterByPage.bind(this)
    this.handleFilterByTag = this.handleFilterByTag.bind(this)
    this.stackGenderFilter = this.stackGenderFilter.bind(this)
    this.stackPageFilter = this.stackPageFilter.bind(this)
    this.stackLocaleFilter = this.stackLocaleFilter.bind(this)
    this.exportRecords = this.exportRecords.bind(this)
    this.prepareExportData = this.prepareExportData.bind(this)
    this.handleSubscriberClick = this.handleSubscriberClick.bind(this)
    this.showAddTag = this.showAddTag.bind(this)
    this.showAddTagIndiviual = this.showAddTagIndiviual.bind(this)
    this.showRemoveTag = this.showRemoveTag.bind(this)
    this.addTags = this.addTags.bind(this)
    this.handleSaveTags = this.handleSaveTags.bind(this)
    this.createAssignPayload = this.createAssignPayload.bind(this)
    this.createUnassignPayload = this.createUnassignPayload.bind(this)
    this.removeTags = this.removeTags.bind(this)
    this.handleCreateTag = this.handleCreateTag.bind(this)
    this.showSubscribeToSequence = this.showSubscribeToSequence.bind(this)
    this.showUnsubscribeToSequence = this.showUnsubscribeToSequence.bind(this)
    this.handleSequence = this.handleSequence.bind(this)
    this.subscribeToSequence = this.subscribeToSequence.bind(this)
    this.unsubscribeToSequence = this.unsubscribeToSequence.bind(this)
    this.handleFilterByStatus = this.handleFilterByStatus.bind(this)
    this.stackStatusFilter = this.stackStatusFilter.bind(this)
    this.setSubscriber = this.setSubscriber.bind(this)
    this.getDate = this.getDate.bind(this)
    this.removeSequence = this.removeSequence.bind(this)
    this.removeTagIndividual = this.removeTagIndividual.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unSubscribe = this.unSubscribe.bind(this)
    this.handleSubscription = this.handleSubscription.bind(this)
    this.toggleSeqInd = this.toggleSeqInd.bind(this)
    this.addSeqInd = this.addSeqInd.bind(this)
    this.handleSequenceInd = this.handleSequenceInd.bind(this)
    this.handleSeqResponse = this.handleSeqResponse.bind(this)
    this.handleFilterByPageInitial = this.handleFilterByPageInitial.bind(this)
    this.profilePicError = this.profilePicError.bind(this)
    this.toggleSetFieldPopover = this.toggleSetFieldPopover.bind(this)
    this.hoverOn = this.hoverOn.bind(this)
    this.hoverOff = this.hoverOff.bind(this)
    this.handleSetCustomField = this.handleSetCustomField.bind(this)
    this.showToggle = this.showToggle.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.saveCustomField = this.saveCustomField.bind(this)
    this.toggleSetCustomField = this.toggleSetCustomField.bind(this)
    this.handleSelectBulkCustomField = this.handleSelectBulkCustomField.bind(this)
    this.handleBulkSetCustomField = this.handleBulkSetCustomField.bind(this)
    this.selectedSubscribers = this.selectedSubscribers.bind(this)
    this.createSetCustomFieldPayload = this.createSetCustomFieldPayload.bind(this)
    this.saveSetCustomField = this.saveSetCustomField.bind(this)
    this.handleBulkResponse = this.handleBulkResponse.bind(this)
    this.updateOption = this.updateOption.bind(this)
    this.loadsubscriberData = this.loadsubscriberData.bind(this)
    this.setDefaultPicture = this.setDefaultPicture.bind(this)
    this.handleFilterBySource = this.handleFilterBySource.bind(this)
    this.loadSubscribers = this.loadSubscribers.bind(this)
    this.setSelectedField = this.setSelectedField.bind(this)
    this.handleSelectedFieldValue = this.handleSelectedFieldValue.bind(this)
  }

  saveSetCustomField() {
    var payload = this.createSetCustomFieldPayload()
    if (payload.subscriberIds.length > 0) {
      this.props.setCustomFieldValue(payload, this.handleBulkResponse)
    } else {
      if (this.msg) {
        this.msg.error('Select relevant subscribers')
      }
    }
  }
  handleBulkResponse(res) {
    //debugger;
    if (res.status === 'success') {
      this.msg.success('Value set successfully')
      let subscribersData = this.state.subscribersData
      this.setState({
        selectAllChecked: false,
        showBulkActions: false,
        subscribersData
      })
      let selectedSubscribers = this.selectedSubscribers()
      let temp = this.state.subscribersData
      selectedSubscribers.forEach((subscriberId, i) => {
        this.state.subscribersData.forEach((subscriber, j) => {
          subscribersData[i].selected = false
          if (subscriberId === subscriber._id) {
            subscriber.customFields.forEach((field, k) => {
              if (field._id === this.state.selectedBulkField._id) {
                temp[j].customFields[k].value = this.state.selectedBulkField.value
              }
            })
          }
        })
      })
      this.setState({ subscribersData: temp, popoverSetCustomField: !this.state.popoverSetCustomField, selectedBulkField: null })
    } else {
      if (res.status === 'failed') {
        this.msg.error(`Unable to set Custom field value. ${res.description}`)
      } else {
        this.msg.error('Unable to set Custom Field value')
      }
    }
  }

  createSetCustomFieldPayload() {
    var subscribersIds = this.selectedSubscribers()
    let temp = {
      customFieldId: this.state.selectedBulkField._id,
      subscriberIds: subscribersIds,
      value: this.state.selectedBulkField.value
    }
    return temp
  }

  selectedSubscribers() {
    var selectedIds = []
    var subscribers = this.state.subscribersDataAll
    for (var i = 0; i < subscribers.length; i++) {
      if (subscribers[i].selected) {
        selectedIds.push(subscribers[i]._id)
      }
    }
    return selectedIds
  }

  handleBulkSetCustomField(event) {
    var temp = {
      _id: this.state.selectedBulkField._id,
      label: this.state.selectedBulkField.label,
      type: this.state.selectedBulkField.type,
      value: event.target.value
    }
    this.setState({ selectedBulkField: temp })
  }

  handleSelectBulkCustomField(e) {
    let customField = this.state.customFieldOptions.find(cf => cf._id === e.target.value)
    console.log('handleSelectBulkCustomField', customField)
    if (customField) {
      this.setState({
        selectedBulkField: customField
      })
    }
    // console.log('findme', value)
    // var index = 0
    // if (value) {
    //   for (var i = 0; i < this.props.customFields.length; i++) {
    //     if (this.props.customFields[i].name !== value.label) {
    //       index++
    //     }
    //   }
    //   if (index === this.props.customFields.length) {
    //   } else {
    //     this.setState({
    //       saveBulkFieldDisable: false,
    //       selectedBulkField: value
    //     })
    //   }
    // } else {
    //   this.setState({
    //     saveBulkFieldDisable: true,
    //     selectedBulkField: value
    //   })
    // }
  }

  toggleSetCustomField() {
    this.setState({
      popoverSetCustomField: !this.state.popoverSetCustomField
    })
  }

  saveCustomField() {
    let subscriberIds = [this.state.subscriber._id]
    let temp = {
      customFieldId: this.state.selectedField._id,
      subscriberIds: subscriberIds,
      value: this.state.selectedField.value
    }
    let subscriber = this.state.subscriber
    let index = subscriber.customFields.findIndex(cf => cf._id === this.state.selectedField._id)
    subscriber.customFields[index].value = this.state.selectedField.value
    this.props.setCustomFieldValue(temp, this.handleResponse)
    this.setState({ setFieldIndex: false, selectedField: {}, subscriber })
  }

  handleResponse(res) {
    console.log(res)
    if (res.status === 'success') {
      this.msg.success('Value set successfully')
      let temp = this.state.subscriber
      this.state.subscriber.customFields.forEach((field, i) => {
        if (this.state.selectedField._id === field._id) {
          temp.customFields[i].value = this.state.selectedField.value
          this.setState({ subscriber: temp, setFieldIndex: false })
        }
      })
    } else {
      console.log('i m here')
      if (res.status === 'failed') {
        this.msg.error(`Unable to set Custom field value. ${res.description}`)
      } else {
        this.msg.error('Unable to set Custom Field value')
      }
    }
  }

  handleSetCustomField(event) {
    var temp = {
      _id: this.state.selectedField._id,
      name: this.state.selectedField.name,
      type: this.state.selectedField.type,
      value: event.target.value
    }
    if (this.state.oldSelectedFieldValue === event.target.value) {
      this.setState({ selectedField: temp, saveFieldValueButton: true })
    } else {
      this.setState({ selectedField: temp, saveFieldValueButton: false })
    }
  }

  handleSelectedFieldValue (e) {
    let selectedField = this.state.selectedField
    selectedField.value = e.target.value
    this.setState({selectedField})
  }

  setSelectedField(e) {
    console.log('setSelectedField', e.target.value)
    console.log('this.props.customFields', this.props.customFields)
    let field = this.state.customFieldOptions.find(cf => cf._id === e.target.value)
    console.log('field found', field)
    this.setState({selectedField: field})
  }

  toggleSetFieldPopover(field) {
    this.setState({ setFieldIndex: !this.state.setFieldIndex, selectedField: field, oldSelectedFieldValue: field.value })
  }

  showToggle() {
    this.setState({ show: !this.state.show })
  }

  hoverOn(id) {
    this.setState({ hoverId: id })
  }
  hoverOff() {
    this.setState({ hoverId: '' })
  }

  profilePicError(e, subscriber) {
    e.persist()
    console.log('profile picture error', subscriber)
    console.log('event object', e.target)
    this.setDefaultPicture(e, subscriber)
    this.props.updatePicture({ subscriber }, (newProfilePic) => {
      if (newProfilePic) {
        e.target.src = newProfilePic
      } else {
        this.setDefaultPicture(e, subscriber)
      }
    })
  }

  setDefaultPicture(e, subscriber) {
    if (subscriber.gender === 'female') {
      e.target.src = 'https://i.pinimg.com/236x/50/28/b5/5028b59b7c35b9ea1d12496c0cfe9e4d.jpg'
    } else {
      e.target.src = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    }
  }

  getDate(datetime) {
    let d = new Date(datetime)
    let dayofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
    let date = d.getDate()
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
    let year = d.getFullYear()

    return [dayofweek, date, month, year, d.toLocaleTimeString()].join(' ')
  }
  subscribe() {
    if (this.state.subscriber._id) {
      this.props.subscribe(this.state.subscriber._id, this.handleSubscription, this.msg)
    }
  }
  unSubscribe() {
    var payload = {}
    payload.page_id = this.state.subscriber.pageId ? this.state.subscriber.pageId._id : null
    payload.subscriber_id = this.state.subscriber._id
    if (payload.page_id && payload.subscriber_id) {
      this.props.unSubscribe(payload, this.handleSubscription, this.msg)
    }
  }
  handleSubscription(res, action) {
    if (res.status === 'success') {
      this.loadSubscribers()
      if (action === 'sub') {
        this.msg.success('Subscribed Successfully')
      }
      if (action === 'unsub') {
        this.msg.success('UnSubscribed Successfully')
      }
    } else {
      if (res.description) {
        this.msg.error(`Unable to apply subscription. ${res.description}`)
      } else {
        this.msg.error(`Unable to apply subscription.`)
      }
    }
  }
  setSubscriber(s) {
    this.setState({ subscriber: s, show: false }, () => {
      console.log('find me', this.state.subscriber)
    })
    this.props.getSubscriberSequences(s._id)
  }
  loadsubscriberData(data) {
    if (data.tag_value === false) {
      this.setState({ filterByTag: '' }, () => {
        this.loadSubscribers()
      })
    }
    else if (data.tag_value === true) {
      this.setState({ filterByTag: '' }, () => {
        this.loadSubscribers()
      })
    }
  }


  handleAddIndividual(value) {
    console.log('handleAddIndividual', value)
    var index = 0
    if (value) {
      var data = String(value.label).toLowerCase()
      value.label = data
      for (var i = 0; i < this.props.tags.length; i++) {
        if (this.props.tags[i].tag !== data) {
          index++
        }
      }
      if (index === this.props.tags.length) {
        this.props.createTag(data, this.handleCreateTag, this.msg)
      } else {
        if (value.className) {
          this.updateOption()
        }
        this.setState({
          saveEnableIndividual: true,
          addTagIndividual: value
        })
      }
    } else {
      this.setState({
        saveEnableIndividual: false,
        addTagIndividual: value
      })
    }
  }
  removeTagIndividual(e, tag) {
    var subscribers = []
    var tagId = ''
    var payload = {}
    subscribers.push(this.state.subscriber._id)
    for (let i = 0; i < this.state.options.length; i++) {
      if (this.state.options[i].label === tag) {
        tagId = this.state.options[i].value
        break
      }
    }
    if (tagId !== '' && subscribers.length > 0) {
      payload.subscribers = subscribers
      payload.tagId = tagId
      this.props.unassignTags(payload, this.handleSaveTags, this.msg)
    }
  }

  handleAdd(value) {
    console.log('this.state.saveEnable', value)
    var index = 0
    if (value) {
      var data = String(value.label).toLowerCase()
      value.label = data
      for (var i = 0; i < this.props.tags.length; i++) {
        if (this.props.tags[i].tag !== data) {
          index++
        }
      }
      if (index === this.props.tags.length) {
        this.props.createTag(data, this.handleCreateTag, this.msg)
      } else {
        if (value.className) {
          this.updateOption()
        }
        //
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
    console.log('this.state.saveEnable', this.state.saveEnable)
  }
  handleSequence(obj) {
    this.setState({ sequenceValue: obj.value, saveEnableSeq: true })
  }
  handleSequenceInd(obj) {
    this.setState({ seqValueInd: obj.value, saveEnableSeqInd: true })
  }
  handleCreateTag() {
    this.setState({
      saveEnable: false
    })
  }
  createUnassignPayload(tagId) {
    let tag = this.state.options.find(t => t.value === tagId)
    var payload = {}
    var selectedIds = []
    var subscribers = this.state.subscribersDataAll
    for (var i = 0; i < subscribers.length; i++) {
      var index = 0
      if (subscribers[i].selected && subscribers[i].tags) {
        for (var j = 0; j < subscribers[i].tags.length; j++) {
          if (subscribers[i].tags[j] !== tag.label) {
            index++
          }
        }
        if (index !== subscribers[i].tags.length) {
          selectedIds.push(subscribers[i]._id)
        }
      }
    }
    payload.subscribers = selectedIds
    payload.tagId = tag.value
    return payload
  }
  createAssignPayload(tagId) {
    let tag = this.state.options.find(t => t.value === tagId)
    console.log('createAssignPayload', tag)
    console.log('this.state.subscribersDataAll', this.state.subscribersDataAll)
    var payload = {}
    var selectedIds = []
    var subscribers = this.state.subscribersDataAll
    for (var i = 0; i < subscribers.length; i++) {
      var index = 0
      if (subscribers[i].selected && subscribers[i].tags) {
        for (var j = 0; j < subscribers[i].tags.length; j++) {
          if (subscribers[i].tags[j] !== tag.label) {
            index++
          }
        }
        if (index === subscribers[i].tags.length) {
          selectedIds.push(subscribers[i]._id)
        }
      }
    }
    payload.subscribers = selectedIds
    payload.tagId = tag.value
    return payload
  }

  addTags(e) {
    console.log('addTags', e.target.value)
    var payload = this.createAssignPayload(e.target.value)
    if (payload.subscribers.length > 0) {
      this.props.assignTags(payload, this.handleSaveTags, this.msg)
    } else {
      if (this.msg) {
        this.msg.error('Select relevant subscribers')
      }
    }
  }

  addTagsIndividual(subscriber) {
    var payload = {}
    var subscribers = []
    if (this.state.subscriber && this.state.subscriber.tags) {
      for (let i = 0; i < this.state.subscriber.tags.length; i++) {
        if (this.state.subscriber.tags[i] === this.state.addTagIndividual.label) {
          return this.msg.error('Tag is already assigned')
        }
      }
    }
    subscribers.push(subscriber._id)
    payload.subscribers = subscribers
    payload.tagId = this.state.addTagIndividual.value
    if (payload.subscribers.length > 0) {
      this.props.assignTags(payload, this.handleSaveTags, this.msg)
    } else {
      if (this.msg) {
        this.msg.error('Select relevant subscribers')
      }
    }
  }

  subscribeToSequence(e) {
    let sequenceId = e.target.value
    let subscribers = []
    for (let i = 0; i < this.state.subscribersDataAll.length; i++) {
      if (this.state.subscribersDataAll[i].selected) {
        subscribers.push(this.state.subscribersDataAll[i]._id)
      }
    }
    let data = {
      sequenceId,
      subscriberIds: subscribers,
      fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'
    }
    this.props.subscribeToSequence(data, this.msg)
    this.setState({ selectAllChecked: false, showBulkActions: false, sequenceValue: '' })
  }

  removeSequence(sequenceId) {
    let data = {
      sequenceId: sequenceId,
      subscriberIds: [this.state.subscriber._id]
    }
    console.log('removeSequence', data)
    this.props.unsubscribeToSequence(data, this.msg, this.handleSeqResponse)
  }

  unsubscribeToSequence(e) {
    let sequenceId = e.target.value
    let subscribers = []
    for (let i = 0; i < this.state.subscribersDataAll.length; i++) {
      if (this.state.subscribersDataAll[i].selected) {
        subscribers.push(this.state.subscribersDataAll[i]._id)
      }
    }
    let data = {
      sequenceId,
      subscriberIds: subscribers
    }
    this.props.unsubscribeToSequence(data, this.msg)
    this.setState({ selectAllChecked: false, showBulkActions: false, sequenceValue: '' })
  }

  handleSaveTags() {
    this.setState({
      selectAllChecked: false,
      showBulkActions: false
    }, () => {
      setTimeout(() => {
        this.loadSubscribers()
      }, 500)
    })
  }

  removeTags(e) {
    var payload = this.createUnassignPayload(e.target.value)
    if (payload.subscribers.length > 0) {
      this.props.unassignTags(payload, this.handleSaveTags, this.msg)
    } else {
      if (this.msg) {
        this.msg.error('Select relevant subscribers')
      }
    }
  }
  handleRemove(value) {
    this.setState({ removeTag: value })
  }
  componentDidMount() {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Subscribers`

    if (this.props.location.state && this.props.location.state.page) {
      let pageId = this.props.location.state.page._id
      this.setState({ filterPage: pageId })
      let statusValue
      if (this.props.location.state.filterStatus === 'subscribed') {
        statusValue = true
        this.setState({ statusValue: 'subscribed' })
      } else if (this.props.location.state.filterStatus === 'unsubscribed') {
        statusValue = false
        this.setState({ statusValue: 'unsubscribed' })
      } else {
        statusValue = ''
        this.setState({ statusValue: '' })
      }
      this.handleFilterByPageInitial(pageId, statusValue)
    }
  }
  componentDidUpdate() {
  }
  toggleSeqInd() {
    this.setState({
      popoverAddSeqInd: !this.state.popoverAddSeqInd,
      seqValueInd: '',
      saveEnableSeqInd: false
    })
  }
  addSeqInd(subscriber) {
    let subscribers = []
    if (this.props.subscriberSequences) {
      for (let i = 0; i < this.props.subscriberSequences.length; i++) {
        if (this.props.subscriberSequences[i].sequenceId._id === this.state.seqValueInd) {
          return this.msg.error('Sequence is already subscribed')
        }
      }
    }
    subscribers.push(subscriber._id)
    let data = {
      sequenceId: this.state.seqValueInd,
      subscriberIds: subscribers
    }
    this.props.subscribeToSequence(data, this.msg, this.handleSeqResponse)
    this.setState({ selectAllChecked: false, seqValueInd: '' })
  }
  handleSeqResponse(res) {
    if (res.status === 'success') {
      if (this.state.subscriber && this.state.subscriber._id) {
        this.props.getSubscriberSequences(this.state.subscriber._id)
      }
    }
  }
  toggleTag() {
    this.setState({
      dropdownActionOpen: !this.state.dropdownActionOpen
    })
    if (this.state.popoverAddTagOpen) {
      this.setState({
        popoverAddTagOpen: false
      })
    }
    if (this.state.popoverRemoveTagOpen) {
      this.setState({
        popoverRemoveTagOpen: false
      })
    }
  }
  toggleAdd() {
    this.setState({
      popoverAddTagOpen: !this.state.popoverAddTagOpen
    })
  }
  toggleAddIndividual() {
    this.setState({
      popoverAddTagOpenIndividual: !this.state.popoverAddTagOpenIndividual,
      saveEnableIndividual: false
    })
  }
  toggleRemove() {
    this.setState({
      popoverRemoveTagOpen: !this.state.popoverRemoveTagOpen
    })
  }
  toggleSubscribe() {
    this.setState({
      openSubscribeToSequence: !this.state.openSubscribeToSequence
    })
  }
  toggleUnSubscribe() {
    this.setState({
      openUnsubscribeToSequence: !this.state.openUnsubscribeToSequence
    })
  }
  showAddTag() {
    console.log('showAddTag')
    this.setState({
      addTag: null,
      popoverAddTagOpen: true
    })
  }
  showAddTagIndiviual() {
    this.setState({
      addTagIndividual: null,
      popoverAddTagOpenIndividual: true
    })
  }
  showRemoveTag() {
    this.setState({
      removeTag: null,
      popoverRemoveTagOpen: true
    })
  }

  showSubscribeToSequence() {
    this.setState({
      sequenceValue: '',
      openSubscribeToSequence: true
    })
  }
  showUnsubscribeToSequence() {
    this.setState({
      sequenceValue: '',
      openUnsubscribeToSequence: true
    })
  }

  searchSubscriber(event) {
    this.setState({ searchValue: event.target.value, pageSelected: 0 })
    if (event.target.value !== '') {
    this.setState({ searchValue: event.target.value, pageSelected: 0, filter: true }, () => {
      this.loadSubscribers()
    })
    } else {
      this.setState({ searchValue: event.target.value, pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    }

  }

  displayData(n, subscribers) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > subscribers.length) {
      limit = subscribers.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = subscribers[i]
      index++
    }
    this.setState({ subscribersData: data, subscribersDataAll: subscribers })
  }
  handleSubscriberClick(e) {
    console.log('handleSubscriberClick', this.props.subscribers)
    var subscribers = JSON.parse(JSON.stringify(this.state.subscribersData))
    var subscribersAll = JSON.parse(JSON.stringify(this.state.subscribersDataAll))
    if (e.target.value === 'All') {
      if (e.target.checked) {
        this.setState({
          selectAllChecked: true,
          showBulkActions: true
        })
        for (var i = 0; i < this.state.subscribersDataAll.length; i++) {
          subscribersAll[i].selected = true
        }
        for (var j = 0; j < this.state.subscribersData.length; j++) {
          subscribers[j].selected = true
        }
      } else {
        this.setState({
          selectAllChecked: false,
          showBulkActions: false
        })
        for (var k = 0; k < this.state.subscribersDataAll.length; k++) {
          subscribersAll[k].selected = false
        }
        for (var m = 0; m < this.state.subscribersData.length; m++) {
          subscribers[m].selected = false
        }
      }
      this.setState({ subscribersData: subscribers })
      this.setState({ subscribersDataAll: subscribersAll })
      return
    }
    if (e.target.value !== '') {
      if (e.target.checked) {
        this.setState({
          showBulkActions: true
        })
        for (var p = 0; p < this.state.subscribersDataAll.length; p++) {
          if (subscribersAll[p]._id === subscribers[e.target.value]._id) {
            subscribersAll[p].selected = true
          }
        }
        subscribers[e.target.value].selected = true
        this.setState({ subscribersData: subscribers })
        this.setState({ subscribersDataAll: subscribersAll })
      } else {
        let anySelected = false
        for (var q = 0; q < this.state.subscribersDataAll.length; q++) {
          if (subscribersAll[q]._id === subscribers[e.target.value]._id) {
            subscribersAll[q].selected = false
          }
          if (subscribersAll[q].selected) {
            anySelected = true
          }
        }
        if (!anySelected) {
          this.setState({
            showBulkActions: false
          })
        }
        subscribers[e.target.value].selected = false
        this.setState({ subscribersData: subscribers })
        this.setState({ subscribersDataAll: subscribersAll })
      }
    }
  }
  prepareExportData() {
    var data = []
    var subscriberObj = {}
    for (var i = 0; i < this.state.subscribersData.length; i++) {
      var subscriber = this.state.subscribersData[i]
      subscriberObj = {
        'Profile Picture': subscriber.profilePic,
        'Name': `${subscriber.firstName} ${subscriber.lastName}`,
        'Page': subscriber.pageId.pageName,
        'PhoneNumber': subscriber.phoneNumber ? subscriber.phoneNumber : '',
        'Email': subscriber.email,
        'Source': subscriber.source === 'customer_matching' ? 'PhoneNumber' : subscriber.source === 'direct_message' ? 'Direct Message' : 'Chat Plugin',
        'Locale': subscriber.locale,
        'Gender': subscriber.gender,
        'tags': subscriber.tags,
        'SubscriberId': subscriber._id
      }
      data.push(subscriberObj)
    }
    return data
  }
  exportRecords() {
    var data = this.prepareExportData()
    var info = data
    var keys = []
    var val = info[0]

    for (var j in val) {
      var subKey = j
      keys.push(subKey)
    }
    json2csv({ data: info, fields: keys }, function (err, csv) {
      if (err) {
      } else {
        fileDownload(csv, 'SubscriberList.csv')
      }
    })
  }
  handlePageClick(data) {
    if (data.selected === 0) {
      this.loadSubscribers()
    } else if (this.state.pageSelected < data.selected) {
      this.loadSubscribers(this.state.pageSelected, data.selected)
    } else {
      this.loadSubscribers(this.state.pageSelected, data.selected)
    }
    this.setState({ pageSelected: data.selected })
    this.displayData(data.selected, this.state.subscribersDataAll)
  }
  updateOption() {
    this.msg.error('Tag is already created with this name. Please choose another name')
    var tagOptions = []
    if (this.props.tags) {
      for (var i = 0; i < this.props.tags.length; i++) {
        tagOptions.push({ 'value': this.props.tags[i]._id, 'label': this.props.tags[i].tag })
      }
      this.setState({
        options: tagOptions
      })
    }
  }

  loadSubscribers (currentPage, requestedPage) {
    this.props.loadAllSubscribersListNew({
      current_page: currentPage,
      requested_page: requestedPage,
      last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none',
      number_of_records: 10,
      first_page: currentPage < requestedPage ? 'next' : currentPage > requestedPage ? 'previous' : 'first',
      filter: true,
      filter_criteria: {
        search_value: this.state.searchValue,
        gender_value: this.state.filterByGender === 'all' ? '' : this.state.filterByGender,
        page_value: this.state.filterByPage === 'all' ? '' : this.state.filterByPage,
        locale_value: this.state.filterByLocale === 'all' ? '' : this.state.filterByLocale,
        tag_value: this.state.filterByTag === 'all' ? '' : this.state.filterByTag,
        status_value: this.state.status_value === 'all' ? '' : this.state.status_value,
        source_value: this.state.filterSource === 'all' ? '' : this.state.filterBySource
      }
    })
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    //debugger;
    console.log('next Props in subscribers', nextProps)
    console.log('nextProps in subscribers', nextProps)
    if (nextProps.pages && !this.state.filterByPage) {
      this.setState({ filterByPage: nextProps.pages[0]._id, filterPage: nextProps.pages[0].pageName }, () => {
        this.loadSubscribers()
      })
    }
    if (nextProps.subscribers && nextProps.count) {
      console.log('subscribers got', nextProps.subscribers)
      this.displayData(0, nextProps.subscribers)
      this.setState({ totalLength: nextProps.count, subscribersLoaded: true })
      if (this.state.subscriber && this.state.subscriber._id) {
        for (let i = 0; i < nextProps.subscribers.length; i++) {
          if (nextProps.subscribers[i]._id === this.state.subscriber._id) {
            this.setState({
              subscriber: nextProps.subscribers[i]
            })
          }
        }
      }
    } else {
      this.setState({subscribersData: [], subscribersDataAll: [], totalLength: 0 })
    }
    if (nextProps.tags) {
      var tagOptions = []
      for (var i = 0; i < nextProps.tags.length; i++) {
        tagOptions.push({ 'value': nextProps.tags[i]._id, 'label': nextProps.tags[i].tag })
      }
      this.setState({
        options: tagOptions
      })
    }
    if (nextProps.customFields) {
      var fieldOptions = []
      for (let a = 0; a < nextProps.customFields.length; a++) {
        fieldOptions.push({ '_id': nextProps.customFields[a]._id, 'label': nextProps.customFields[a].name, 'type': nextProps.customFields[a].type, 'value': '', 'default':  nextProps.customFields[a].default})
      }
      this.setState({
        customFieldOptions: fieldOptions
      })
    }
    if (nextProps.sequences) {
      let sequenceOptions = []
      let unsubSequenceOptions = []
      for (let a = 0; a < nextProps.sequences.length; a++) {
        if (nextProps.sequences[a].sequence.trigger.event === 'subscribes_to_sequence') {
          sequenceOptions.push({ 'value': nextProps.sequences[a].sequence._id, 'label': nextProps.sequences[a].sequence.name })
        }
        if (nextProps.sequences[a].sequence.trigger.event === 'subscribes_to_sequence' && nextProps.sequences[a].subscribers.length > 0) {
          unsubSequenceOptions.push({ 'value': nextProps.sequences[a].sequence._id, 'label': nextProps.sequences[a].sequence.name })
        }
      }
      this.setState({ sequenceOptions: sequenceOptions, unsubSequenceOptions })
    }
  }
  stackGenderFilter(filteredData) {
    if (this.state.filterByGender !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].gender === this.state.filterByGender) {
          filtered.push(this.props.subscribers[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }

  stackLocaleFilter(filteredData) {
    if (this.state.filterByLocale !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].locale === this.state.filterByLocale) {
          filtered.push(this.props.subscribers[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }
  stackStatusFilter(filteredData) {
    if (this.state.statusValue !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (this.state.statusValue === 'subscribed' && filteredData[i].isSubscribed) {
          filtered.push(this.props.subscribers[i])
        } else if (this.state.statusValue === 'unsubscribed' && !filteredData[i].isSubscribed) {
          filtered.push(this.props.subscribers[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }
  stackPageFilter(filteredData) {
    if (this.state.filterByPage !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].pageId && (filteredData[i].pageId.pageId === this.state.filterByPage)) {
          filtered.push(this.props.subscribers[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }
  stackTagFilter(filteredData) {
    if (this.state.filterByTag !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].tags) {
          for (var j = 0; j < filteredData[i].tags.length; j++) {
            if (filteredData[i].tags[j] === this.state.filterByTag) {
              filtered.push(filteredData[i])
              break
            }
          }
        }
      }
      filteredData = filtered
    }
    return filteredData
  }

  handleFilterByTag(e) {
    this.setState({ tagValue: e.target.value })
    console.log('e.target.value', e.target.value)
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({ filter: true, filterByTag: e.target.value, pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    } else {
      this.setState({ filterByTag: '', pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    }
  }

  handleFilterByPage(e) {
    this.setState({ filterPage: e.target.value })
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({ filter: true, filterByPage: e.target.value, pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    } else {
      this.setState({ filterByPage: '', pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    }
  }

  handleFilterByPageInitial(pageId, isSubscribed) {
    this.setState({ filterByPage: pageId })
    if (pageId !== '' && pageId !== 'all') {
      this.setState({ filter: true }, () => {
        this.loadSubscribers()
      })
    } else {
      this.loadSubscribers()
    }
  }
  handleFilterByGender(e) {
    this.setState({ filterGender: e.target.value })
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({
        filter: true,
        filterByGender: e.target.value,
        pageSelected: 0
      }, () => {
        this.loadSubscribers()
      })
    } else {
      this.setState({ filterByGender: '', pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    }
  }

  handleFilterByLocale(e) {
    this.setState({ filterLocale: e.target.value })
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({ filter: true, filterByLocale: e.target.value, pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    } else {
      this.setState({ filterByLocale: '', pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    }
  }

  handleFilterBySource(e) {
    this.setState({filterSource: e.target.value})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({ filter: true, filterBySource: e.target.value, pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    } else {
      this.setState({ filterBySource: '', pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    }
  }

  handleFilterByStatus(e) {
    // var filteredData = this.props.subscribers
    // filteredData = this.stackPageFilter(filteredData)
    // filteredData = this.stackGenderFilter(filteredData)
    // filteredData = this.stackTagFilter(filteredData)
    // filteredData = this.stackLocaleFilter(filteredData)
    // var filtered = []
    this.setState({ statusValue: e.target.value })
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({ filter: true, pageSelected: 0 })
      if (e.target.value === 'subscribed') {
        this.setState({ status_value: true }, () => {
          this.loadSubscribers()
        })
      } else {
        this.setState({ status_value: false }, () => {
          this.loadSubscribers()
        })
      }
      // for (var k = 0; k < filteredData.length; k++) {
      //   if (e.target.value === 'subscribed' && filteredData[k].isSubscribed) {
      //     filtered.push(filteredData[k])
      //   } else if (e.target.value === 'unsubscribed' && !filteredData[k].isSubscribed) {
      //     filtered.push(filteredData[k])
      //   }
      // }
      // filteredData = filtered
    } else {
      this.setState({ status_value: '', pageSelected: 0 }, () => {
        this.loadSubscribers()
      })
    }
    // this.setState({filteredData: filteredData})
    // this.displayData(0, filteredData)
    // this.setState({pageSelected: 0})
    // this.setState({ totalLength: filteredData.length })
  }

  render() {
    console.log('subscriber state', this.state)
    console.log('sequence options in subscriberss,', this.state.sequenceOptions)
    console.log('subscriber props', this.props)
    var hostname = window.location.hostname
    var hoverOn = {
      cursor: 'pointer',
      border: '1px solid #3c3c7b',
      width: '421px',
      borderRadius: '30px',
      marginBottom: '7px',
      background: 'rgb(60, 60, 123, 0.5)'
    }
    var hoverOff = {
      cursor: 'pointer',
      border: '1px solid rgb(220, 220, 220)',
      width: '421px',
      borderRadius: '30px',
      marginBottom: '7px',
      background: 'white'
    }
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    var subscribedStyle = {
      width: '100px',
      overflow: 'inherit'
    }
    var unsubscribedStyle = {
      width: '100px',
      overflow: 'inherit',
      color: '#818a91'
    }
    console.log('this.state.subscribersData', this.state.subscribersData)
    console.log('this.props.subscribers', this.props.subscribers)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <EditTags currentTags={this.props.tags} msg={this.msg} loadsubscriberData={this.loadsubscriberData} />
        <div>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />

          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Subscriber Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{ color: 'black' }} className="modal-body">
                  <YouTube
                    videoId='lFosatdcCCE'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: { // https://developers.google.com/youtube/player_parameters
                        autoplay: 0
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='m-subheader '>
            <div className='d-flex align-items-center'>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>Manage Subscribers</h3>
              </div>
            </div>
          </div>
          <div className='m-content'>
            {
              this.props.pages && this.props.pages.length === 0 &&
              <AlertMessage type='page' />
            }
            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-technology m--font-accent' />
              </div>
              <div className='m-alert__text'>
                Need help in understanding subscribers? Here is the <a href='https://kibopush.com/subscribers/' target='_blank' rel='noopener noreferrer'>documentation</a>.
                Or check out this <a href='#/' data-toggle="modal" data-target="#video">video tutorial</a>
              </div>
            </div>
            <div className='row'>
              <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                <div className='m-portlet m-portlet--mobile'>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <div className='row'>
                          <div className='col-7' style={{marginTop: '20px'}}>
                            <div className='m-form__control'>
                              <select className='custom-select' id='m_form_type' style={{ width: '200px' }} tabIndex='-98' value={this.state.filterPage} onChange={this.handleFilterByPage}>
                                <option key='' value='' disabled>Select a Page</option>
                                {
                                  this.props.pages && this.props.pages.map((page, i) => (
                                    <option key={i} value={page._id}>{page.pageName}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                          <div className='col-5' style={{marginLeft: '-20px', marginTop: '30px'}}>
                            <h3 className='m-portlet__head-text'>
                              Subscribers
                            </h3>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      {
                        this.props.pages && this.props.pages.length > 0
                          ? <Link to='/invitesubscribers' disabled>
                            <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                              <span>
                                <i className='la la-user-plus' />
                                <span>
                                  Invite Subscribers
                              </span>
                              </span>
                            </button>
                          </Link>
                          : <Link disabled>
                            <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled>
                              <span>
                                <i className='la la-user-plus' />
                                <span>
                                  Invite Subscribers
                              </span>
                              </span>
                            </button>
                          </Link>
                      }
                    </div>
                  </div>
                  {this.state.filterPage ?
                    <div className='m-portlet__body'>
                      <div style={{ marginTop: '-50px' }}>
                        <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                          <div className='row align-items-center'>
                            {
                              !this.state.showBulkActions ?
                                <div className='col-xl-12 order-2 order-xl-1'>
                                <h5 style={{marginTop: '20px', marginBottom: '-10px'}}>Filters:</h5>
                                <div className='row filters' style={{ marginTop: '25px', display: 'flex' }}>
                                  <div className='col-md-3'>
                                    <div className='m-form__group m-form__group--inline'>
                                      <div className='m-form__control'>
                                        <select className='custom-select' id='m_form_status' style={{ width: '200px' }} tabIndex='-98' value={this.state.filterGender} onChange={this.handleFilterByGender}>
                                          <option key='' value='' disabled>Filter by Gender...</option>
                                          <option key='ALL' value='all'>All</option>
                                          <option key='male' value='male'>Male</option>
                                          <option key='female' value='female'>Female</option>
                                          <option key='other' value='other'>Other</option>
                                        </select>
                                      </div>
                                  </div>
                                  <div className='d-md-none m--margin-bottom-10' />
                                </div>
                                <div className='col-md-3'>
                                  <div className='m-form__group m-form__group--inline'>
                                    <div className='m-form__control'>
                                      <select className='custom-select' style={{ width: '200px' }} id='m_form_type' tabIndex='-98' value={this.state.filterLocale} onChange={this.handleFilterByLocale}>
                                        <option key='' value='' disabled>Filter by Locale...</option>
                                        <option key='ALL' value='all'>All</option>
                                        {
                                          this.props.locales && this.props.locales.length > 0 && this.props.locales[0] &&
                                          this.props.locales.map((locale, i) => (
                                            <option key={i} value={locale.value}>{locale.text}</option>
                                          ))
                                        }
                                      </select>{/* </div> */}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-3'>
                                  <div className='m-form__group m-form__group--inline'>
                                    <div className='m-form__control'>
                                      <select className='custom-select' style={{ width: '200px' }} id='m_form_type' tabIndex='-98' value={this.state.tagValue} onChange={this.handleFilterByTag}>
                                        <option key='' value='' disabled>Filter by Tags...</option>
                                        <option key='ALL' value='all'>All</option>
                                        {
                                          this.state.options.map((tag, i) => (
                                            <option key={i} value={tag.label}>{tag.label}</option>
                                          ))
                                        }
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-3'>
                                  <div className='m-form__group m-form__group--inline'>
                                    <div className='m-form__control'>
                                      <select className='custom-select' style={{ width: '200px' }} id='m_form_type' tabIndex='-98' value={this.state.statusValue} onChange={this.handleFilterByStatus}>
                                        <option key='' value='' disabled>Filter by Status...</option>
                                        <option key='ALL' value='all'>All</option>
                                        <option key='subscribed' value='subscribed'>Subscribed</option>
                                        <option key='unsubscribed' value='unsubscribed'>Unsubscribed</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div style={{marginTop: '20px'}} className='col-md-3'>
                                    <div className='m-form__group m-form__group--inline'>
                                      <div className='m-form__control'>
                                        <select className='custom-select' id='m_form_status' style={{ width: '200px' }} tabIndex='-98' value={this.state.filterSource} onChange={this.handleFilterBySource}>
                                          <option value='' disabled>Filter by Source...</option>
                                          <option value='all'>All</option>
                                          <option value='direct_message'>Direct Message</option>
                                          <option value='customer_matching'>Phone Number</option>
                                          <option value='chat_plugin'>Chat Plugin</option>
                                          <option value='shopify'>Shopify</option>
                                        </select>
                                      </div>
                                  </div>
                                  <div className='d-md-none m--margin-bottom-10' />
                                </div>
                              </div>
                              <div style={{ marginTop: '15px' }} className='form-group m-form__group row align-items-center'>
                                <div className='col-6'>
                                  <div className='m-input-icon m-input-icon--left'>
                                    <input type='text' className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                                    <span className='m-input-icon__icon m-input-icon__icon--left'>
                                      <span><i className='la la-search' /></span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div> :
                            <div className='col-xl-12 order-2 order-xl-1'>
                            <h5 style={{marginTop: '20px', marginBottom: '-10px'}}>Bulk Actions:</h5>
                            <div className='row filters' style={{ marginTop: '25px', display: 'flex' }}>
                              <div className='col-md-3'>
                                <div className='m-form__group m-form__group--inline'>
                                  <div className='m-form__control'>
                                    <select className='custom-select' id='m_form_status' style={{ width: '200px' }} tabIndex='-98' onChange={this.addTags} value=''>
                                      <option key='' value='' disabled>Assign Tag</option>
                                      {
                                        this.state.options.map((option, i) => {
                                          return (
                                            <option key={i} value={option.value}>{option.label}</option>
                                          )
                                        })
                                      }
                                    </select>
                                  </div>
                              </div>
                              <div className='d-md-none m--margin-bottom-10' />
                            </div>
                            <div className='col-md-3'>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='m-form__control'>
                                  <select className='custom-select' style={{ width: '200px' }} id='m_form_type' tabIndex='-98' value='' onChange={this.removeTags}>
                                    <option key='' value='' disabled>Unassign Tag</option>
                                    {
                                      this.state.options.map((option, i) => {
                                        return (
                                          <option key={i} value={option.value}>{option.label}</option>
                                        )
                                      })
                                    }
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='m-form__control'>
                                  <select className='custom-select' style={{ width: '200px' }} id='m_form_type' tabIndex='-98' value='' onChange={this.subscribeToSequence}>
                                    <option key='' value='' disabled>Subscribe to Sequence</option>
                                    {
                                      this.state.sequenceOptions.map((seq, i) => (
                                        <option key={i} value={seq.value}>{seq.label}</option>
                                      ))
                                    }
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='m-form__control'>
                                  <select className='custom-select' style={{ width: '200px' }} id='m_form_type' tabIndex='-98' value='' onChange={this.unsubscribeToSequence}>
                                    <option key='' value='' disabled>Unsubscribe from Sequence</option>
                                    {
                                      this.state.sequenceOptions.map((seq, i) => (
                                        <option key={i} value={seq.value}>{seq.label}</option>
                                      ))
                                    }
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div style={{ marginTop: '15px' }} className='form-group m-form__group row align-items-center'>
                            <div className='col-3'>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='m-form__control'>
                                  <select className='custom-select' value={this.state.selectedBulkField ? this.state.selectedBulkField._id : ''} style={{ width: '200px' }} id='m_form_type' tabIndex='-98' onChange={this.handleSelectBulkCustomField}>
                                    <option key='' value='' disabled>Set Custom Field</option>
                                    <optgroup label='Default Custom Fields'>
                                      {
                                        this.state.customFieldOptions.filter(cf => !!cf.default).map((cf, i) => (
                                          <option key={i} value={cf._id}>{cf.label}</option>
                                        ))
                                      }
                                    </optgroup>
                                    {
                                    this.state.customFieldOptions.filter(cf => !cf.default).length > 0 &&
                                    <optgroup label='User Defined Custom Fields'>
                                      {
                                        this.state.customFieldOptions.filter(cf => !cf.default).map((cf, i) => (
                                          <option key={i} value={cf._id}>{cf.label}</option>
                                        ))
                                      }
                                    </optgroup>
                                    }
                                  </select>
                                </div>
                              </div>
                            </div>
                            {
                              (this.state.selectedBulkField && this.state.selectedBulkField._id) &&
                                <div className='col-3'>
                                  <input placeholder={'Enter custom field value...'} value={this.state.selectedBulkField ? this.state.selectedBulkField.value : ''} onChange={this.handleBulkSetCustomField} className='form-control' />
                                </div>
                            }
                            {
                              (this.state.selectedBulkField && this.state.selectedBulkField._id) &&
                              <div className='col-3'>
                                <button disabled={!this.state.selectedBulkField.value ? true : false} onClick={() => this.saveSetCustomField()} className='btn btn-primary'>
                                  Save
                                </button>
                              </div>
                            }
                          </div>
                        </div>
                            }
                          </div>
                        </div>
                        {this.state.subscribersData && this.state.subscribersData.length > 0
                          ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                            <table className='m-datatable__table'
                              id='m-datatable--27866229129' style={{
                                display: 'block',
                                height: 'auto',
                                overflowX: 'auto'
                              }}>
                              <thead className='m-datatable__head'>
                                <tr className='m-datatable__row'
                                  style={{ height: '53px' }}>
                                  <th data-field='Select All'
                                    className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '30px', overflow: 'inherit' }}>
                                      <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllChecked} onChange={this.handleSubscriberClick} /></span></th>
                                  <th data-field='Profile Picture'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{ width: '100px', overflow: 'inherit' }}>Profile Picture</span>
                                  </th>
                                  <th data-field='Name'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{ width: '100px', overflow: 'inherit' }}>Name</span>
                                  </th>
                                  <th data-field='Page'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{ width: '100px', overflow: 'inherit' }}>Page</span>
                                  </th>
                                  <th data-field='Status'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{ width: '100px', overflow: 'inherit' }}>Status</span>
                                  </th>
                                  <th data-field='Gender'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{ width: '50px', overflow: 'inherit' }}>Gender</span>
                                  </th>
                                  <th data-field='Subscribed'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{ width: '100px', overflow: 'inherit' }}>Subscribed</span>
                                  </th>
                                  <th data-field='Tag'
                                    className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '50px', overflow: 'inherit' }}>Tags</span>
                                  </th>
                                </tr>
                              </thead>

                              <tbody className='m-datatable__body' style={{ textAlign: 'center' }}>
                                {
                                  this.state.subscribersData.map((subscriber, i) => (
                                    <tr data-row={i}
                                      className='m-datatable__row m-datatable__row--even subscriberRow'
                                      style={{ height: '55px', cursor: 'pointer' }} key={i}>
                                      <td data-field='Select All'
                                        className='m-datatable__cell'>
                                        <span style={{ width: '30px', overflow: 'inherit' }}>
                                          <input type='checkbox' name={subscriber._id} value={i} onChange={this.handleSubscriberClick} checked={subscriber.selected} />
                                        </span></td>
                                      <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Profile Picture'
                                        className='m-datatable__cell'>
                                        <span
                                          style={{ width: '100px', overflow: 'inherit' }}>
                                          <img alt='pic'
                                            src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                            onError={(e) => this.profilePicError(e, subscriber)}
                                            className='m--img-rounded m--marginless m--img-centered' width='60' height='60'
                                          />
                                        </span>
                                      </td>

                                      <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Name'
                                        className='m-datatable__cell'>
                                        <span
                                          style={subscriber.isSubscribed ? subscribedStyle : unsubscribedStyle}>{subscriber.firstName} {subscriber.lastName}</span>
                                      </td>

                                      <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Page'
                                        className='m-datatable__cell'>
                                        <span
                                          style={subscriber.isSubscribed ? subscribedStyle : unsubscribedStyle}>
                                          {subscriber.pageId.pageName}
                                        </span>
                                      </td>
                                      <td onClick={() => { this.setSubscriber(subscriber) }} data-field='Status'
                                        className='m-datatable__cell'>
                                        <span
                                          style={subscriber.isSubscribed ? subscribedStyle : unsubscribedStyle}>
                                          {subscriber.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                                        </span>
                                      </td>
                                      <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Gender' className='m-datatable__cell'>
                                        <span style={{ width: '50px' }}>
                                          {subscriber.gender}
                                        </span>
                                      </td>
                                      <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Subscribed' className='m-datatable__cell'>
                                        <span style={{ width: '100px' }}>{moment(subscriber.datetime).fromNow()}</span>
                                      </td>
                                      <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Tag' id={'tag-' + i} className='m-datatable__cell'>
                                        <span style={{ width: '50px', color: 'white', overflow: 'inherit' }}>
                                          {
                                            subscriber.tags && subscriber.tags.length > 0 ? (<i className='la la-tags' style={{ color: subscriber.isSubscribed ? '#716aca' : '#818a91' }} />) : ('No Tags Assigned')
                                          }
                                        </span>
                                        {subscriber.tags && subscriber.tags.length > 0 &&
                                          <UncontrolledTooltip style={{ minWidth: '100px', opacity: '1.0' }} placement='left' target={'tag-' + i}>
                                            {
                                              subscriber.tags.map((tag, i) => (
                                                <span key={i} style={{ display: 'block' }}>{tag}</span>
                                              ))
                                            }
                                          </UncontrolledTooltip>
                                        }
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                            <div className='row'>
                              <div className='col-sm-9'>
                                <ReactPaginate previousLabel={'previous'}
                                  nextLabel={'next'}
                                  breakLabel={<a href='#/'>...</a>}
                                  breakClassName={'break-me'}
                                  pageCount={Math.ceil(this.state.totalLength / 10)}
                                  marginPagesDisplayed={1}
                                  pageRangeDisplayed={3}
                                  onPageChange={this.handlePageClick}
                                  containerClassName={'pagination'}
                                  subContainerClassName={'pages pagination'}
                                  activeClassName={'active'}
                                  forcePage={this.state.pageSelected}
                                />
                              </div>
                              <div className='col-sm-3' style={{ float: 'right' }}>
                                <span class="m-datatable__pager-detail" style={{ float: 'right', marginTop: '30px' }}>
                                  Displaying {(this.state.pageSelected * 10) + 1} - {this.props.subscribers.length < 10 ? this.props.count : (this.props.subscribers.length) * (this.state.pageSelected + 1)} of {this.props.count} records
                                </span>
                              </div>
                            </div>
                            <div className='m-form m-form--label-align-right m--margin-bottom-30'>
                              <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportRecords}>
                                <span>
                                  <i className='fa fa-download' />
                                  <span>
                                    Export Records in CSV File
                                  </span>
                                </span>
                              </button>
                            </div>
                          </div>
                          : <div className='table-responsive'>
                            {
                              this.state.subscribersLoaded ?
                              <h6> No subscribers found that match the criteria </h6>
                              : <h6> Loading subscribers... </h6>
                            }
                          </div>
                        }
                      </div>
                    </div> :
                    <div className='m-portlet__body'>
                      <div className='table-responsive'>
                        {
                          this.props.pages && this.props.pages.length === 0 ?
                          <h6> No pages connected. Please first connect a page. </h6>
                          :
                          <h6> Loading... </h6>
                        }
                      </div>
                    </div>
                  }
                  <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className='modal fade' id='m_modal_1_2' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
                    <div style={{ transform: 'translate(0, 0)' }} className='modal-dialog' role='document'>
                      <div className='modal-content'>
                        <div style={{ display: 'block' }} className='modal-header'>
                          <h5 className='modal-title' id='exampleModalLabel'>
                            {this.state.subscriber.firstName ? (this.state.subscriber.firstName + ' ' + this.state.subscriber.lastName) : ''}
                          </h5>
                          <button style={{ marginTop: '-10px', opacity: '0.5' }} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                            <span aria-hidden='true'>
                              &times;
                            </span>
                          </button>
                        </div>
                        <div className='modal-body'>
                          <div style={{ maxHeight: '350px', overflowX: 'hidden', overflowY: 'scroll' }} className='m-scrollable' data-scrollbar-shown='true' data-scrollable='true' data-max-height='200'>
                            <div className='row'>
                              <div className='col-md-3'>
                                <img style={{ width: '120px' }} alt='pic' src={(this.state.subscriber.profilePic) ? this.state.subscriber.profilePic : ''} />
                              </div>
                              <div style={{ paddingLeft: '30px' }} className='col-md-9'>
                                {
                                  this.state.subscriber.isSubscribed
                                    ? <div style={{ display: 'block', marginTop: '5px' }}>
                                      <i style={{ fontWeight: 'bold' }} className='la la-check-circle' />
                                      subscribed
                                    <a href='#/' onClick={this.unSubscribe} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}> {'(Unsubscribe)'}</a>
                                    </div>
                                    : <div style={{ display: 'block', marginTop: '5px' }}>
                                      <i style={{ fontWeight: 'bold' }} className='la la-times-circle' />
                                      unsubscribed
                                    {this.state.subscriber.unSubscribedBy !== 'subscriber' &&
                                        <a href='#/' onClick={this.subscribe} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}> {'(Subscribe)'}</a>
                                      }
                                    </div>
                                }
                                {
                                  this.state.subscriber.gender && this.state.subscriber.gender === 'male'
                                    ? <span style={{ display: 'block', marginTop: '5px' }}><i style={{ fontWeight: 'bold' }} className='la la-male' /> male</span>
                                    : <span style={{ display: 'block', marginTop: '5px' }}><i style={{ fontWeight: 'bold' }} className='la la-female' /> female</span>
                                }
                                {
                                  this.state.subscriber.locale
                                    ? <span style={{ display: 'block', marginTop: '5px' }}><i style={{ fontWeight: 'bold' }} className='la la-globe' /> {localeCodeToEnglish(this.state.subscriber.locale)}</span>
                                    : <span style={{ display: 'block', marginTop: '5px' }}><i style={{ fontWeight: 'bold' }} className='la la-globe' /></span>
                                }
                                {
                                  this.state.subscriber.email &&
                                  <span style={{ display: 'block', marginTop: '5px' }}><i style={{ fontWeight: 'bold' }} className='la la-envelope' /> {this.state.subscriber.email}</span>
                                }
                                {
                                  this.state.subscriber.phoneNumber &&
                                  <span style={{ display: 'block', marginTop: '5px' }}><i style={{ fontWeight: 'bold' }} className='la la-phone' /> {this.state.subscriber.phoneNumber}</span>
                                }
                              </div>
                            </div>
                            <br />
                            <div className='row'>
                              <div className='col-md-4'>
                                {
                                  this.state.subscriber.isSubscribed
                                    ? <div>
                                      <span style={{ fontWeight: 600 }}>Subscribed At:</span>
                                      <br />
                                      <span>{this.getDate(this.state.subscriber.datetime)}</span>
                                    </div>
                                    : <div>
                                      <span style={{ fontWeight: 600 }}>Unsubscribed At:</span>
                                      <br />
                                      <span>{this.getDate(this.state.subscriber.datetime)}</span>
                                    </div>
                                }
                              </div>
                              <div className='col-md-4'>
                                {
                                  this.state.subscriber.pageId &&
                                  <div>
                                    <span style={{ fontWeight: 600 }}>Facebook Page:</span>
                                    <br />
                                    <span>{this.state.subscriber.pageId.pageName}</span>
                                  </div>
                                }
                              </div>
                              <div className='col-md-4'>
                                <div>
                                  <span style={{ fontWeight: 600 }}>Source:</span>
                                  <br />
                                  <span>{this.state.subscriber.source === 'customer_matching' ? 'Phone Number' : this.state.subscriber.source === 'direct_message' ? 'Direct Message' : 'Chat Plugin'}</span>
                                </div>
                              </div>
                            </div>
                            <br />
                            <div className='row'>
                              <span style={{ fontWeight: 600, marginLeft: '15px' }}>User Tags:</span>
                              <a href='#/' id='assignIndividualTag' style={{ cursor: 'pointer', float: 'right', color: 'blue', marginLeft: '260px' }} onClick={this.showAddTagIndiviual}><i className='la la-plus' />Assign Tags</a>
                            </div>
                            {
                              this.props.tags && this.props.tags.length > 0 && this.state.subscriber.tags && this.state.subscriber.tags.length > 0
                                ? <div style={{ padding: '15px', maxHeight: '120px' }} className='row'>
                                  {
                                    this.state.subscriber.tags.map((tag, i) => (
                                      <button key={i} style={{ marginRight: '5px', marginBottom: '15px' }} className='btn m-btn--pill btn-success btn-sm'>{tag} <i style={{ cursor: 'pointer' }} onClick={(e) => { this.removeTagIndividual(e, tag) }} className='la la-close' /></button>
                                    ))
                                  }
                                </div>
                                : <div style={{ padding: '15px', maxHeight: '120px' }} className='row'>
                                  <span> No Tags Assigned</span>
                                </div>
                            }
                            <Popover placement='left' className='subscriberPopover' isOpen={this.state.popoverAddTagOpenIndividual} target='assignIndividualTag' toggle={this.toggleAddIndividual}>
                              <PopoverHeader>Add Tags</PopoverHeader>
                              <PopoverBody>
                                <div className='row' style={{ minWidth: '250px' }}>
                                  <div className='col-12'>
                                    <label>Select Tags</label>
                                    <Select.Creatable
                                      options={this.state.options}
                                      onChange={this.handleAddIndividual}
                                      value={this.state.addTagIndividual}
                                      placeholder='Add User Tags'
                                    />
                                  </div>
                                  {this.state.saveEnableIndividual
                                    ? <div className='col-12'>
                                      <button style={{ float: 'right', margin: '15px' }}
                                        className='btn btn-primary btn-sm'
                                        onClick={() => {
                                          this.addTagsIndividual(this.state.subscriber)
                                          this.toggleAddIndividual()
                                        }}>Save
                                    </button>
                                    </div>
                                    : <div className='col-12'>
                                      <button style={{ float: 'right', margin: '15px' }}
                                        className='btn btn-primary btn-sm'
                                        disabled>
                                        Save
                                    </button>
                                    </div>
                                  }
                                </div>
                              </PopoverBody>
                            </Popover>
                            <div className='row' style={{ display: 'inline-block' }}>
                              <span style={{ fontWeight: 600, marginLeft: '15px' }}>Custom Fields: </span>
                              {this.state.subscriber.customFields && this.state.subscriber.customFields.filter(cf => !!cf.value).length > 0
                                ? <span>
                                  <a href='#/' data-toggle='collapse' data-target='#customFields' style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={this.showToggle}>
                                    {this.state.show
                                      ? <span>Hide <i style={{ fontSize: '12px' }} className='la la-angle-up ' /></span>
                                      : <span>Show <i style={{ fontSize: '12px' }} className='la la-angle-down ' /></span>
                                    }
                                  </a>
                                  <span onClick={() => this.props.history.push('/customFields')} data-dismiss='modal' id='customfieldid' style={{ cursor: 'pointer', float: 'right', color: 'blue', marginLeft: '145px' }}><i className='la la-gear' /> Manage Fields</span>
                                </span>
                                :
                                <span onClick={() => this.props.history.push('/customFields')} data-dismiss='modal' id='customfieldid' style={{ cursor: 'pointer', float: 'right', color: 'blue', marginLeft: '210px' }}><i className='la la-gear' /> Manage Fields</span>
                              }
                            </div>
                            <div className='row'>
                              {this.state.subscriber.customFields && this.state.subscriber.customFields.filter(cf => !!cf.value).length > 0
                                ? <div id='customFields' style={{ padding: '15px' }} className='collapse'>
                                  {
                                    this.state.subscriber.customFields.filter(cf => !!cf.value).map((field, i) => {
                                        return (
                                          <div className='row'>
                                            <div className='col-sm-12'>
                                              <div onClick={() => { this.toggleSetFieldPopover(field) }} id='target'
                                                onMouseEnter={() => { this.hoverOn(field._id) }}
                                                onMouseLeave={this.hoverOff}
                                                style={field._id === this.state.hoverId ? hoverOn : hoverOff}>
                                                <span style={{ marginLeft: '10px' }}>
                                                  <span style={{ fontWeight: '100' }}>{field.name} : </span>
                                                  <span style={{ color: '#3c3c7b' }}>{field.value}</span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                    })
                                  }
                                  {/* <Popover placement='left' className='subscriberPopover' isOpen={this.state.setFieldIndex} target='target' toggle={this.toggleSetFieldPopover}>
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
                                            // this.toggleSetFieldPopover()
                                          }}
                                          disabled={this.state.saveFieldValueButton}>
                                          Save
                                        </button>
                                      </div>
                                    </PopoverBody>
                                  </Popover> */}
                                </div>
                                : <div style={{ padding: '15px', maxHeight: '120px' }}>
                                  <span>No Custom Fields Set</span>
                                </div>
                              }
                            </div>

                            <div className="row" style={{ marginTop: '15px', marginLeft: '1px' }}>
                              <div className='col-6'>
                                <div className='form-group m-form__group row align-items-center'>
                                  <div className='m-form__group m-form__group--inline'>
                                    <div className='m-form__control'>
                                      <select className='custom-select' value={(this.state.selectedField && this.state.selectedField._id) ? this.state.selectedField._id : ''} id='m_form_type' onChange={this.setSelectedField}>
                                        <option key='' value='' disabled>Set Custom Field</option>
                                        <optgroup label='Default Custom Fields'>
                                          {
                                            this.state.customFieldOptions.filter(cf => !!cf.default).map((cf, i) => (
                                              <option key={i} value={cf._id}>{cf.label}</option>
                                            ))
                                          }
                                        </optgroup>
                                        {
                                        this.state.customFieldOptions.filter(cf => !cf.default).length > 0 &&
                                        <optgroup label='User Defined Custom Fields'>
                                          {
                                            this.state.customFieldOptions.filter(cf => !cf.default).map((cf, i) => (
                                              <option key={i} value={cf._id}>{cf.label}</option>
                                            ))
                                          }
                                        </optgroup>
                                        }
                                      </select>
                                    </div>
                                  </div>
                              </div>
                            </div>
                          {
                              (this.state.selectedField && this.state.selectedField._id) &&
                                <div style={{marginLeft: '-75px'}} className='col-5'>
                                  <input placeholder={'Enter field value...'} value={this.state.selectedField ? this.state.selectedField.value : ''} onChange={this.handleSelectedFieldValue} className='form-control' />
                                </div>
                            }
                            {
                              (this.state.selectedField && this.state.selectedField._id) &&
                              <div style={{marginLeft: '-15px'}}  className='col-1'>
                                <button disabled={!this.state.selectedField.value ? true : false} onClick={() => this.saveCustomField()} className='btn btn-primary'>
                                  Save
                                </button>
                              </div>
                            }
                        </div>

                            {hostname.includes('kiboengage.cloudkibo.com') &&
                              <div className='row'>
                                <span style={{ fontWeight: 600, marginLeft: '15px' }}>Subscribed to Sequences:</span>
                                <a href='#/' id='subSeqInd' onClick={this.toggleSeqInd} style={{ cursor: 'pointer', float: 'right', color: 'blue', marginLeft: '175px' }}> Subscribe</a>
                              </div>
                            }
                            {hostname.includes('kiboengage.cloudkibo.com') &&
                              (this.props.sequences && this.props.sequences.length > 0 && this.props.subscriberSequences && this.props.subscriberSequences.length > 0
                                ? <div style={{ padding: '15px', maxHeight: '120px' }} className='row'>
                                  {
                                    this.props.subscriberSequences.map((seq, i) => (
                                      <button key={i} style={{ marginRight: '5px', marginBottom: '15px' }} className='btn m-btn--pill btn-success btn-sm'>{seq.sequenceId.name} <i style={{ cursor: 'pointer' }} onClick={() => { this.removeSequence(seq.sequenceId._id) }} className='la la-close' /></button>
                                    ))
                                  }
                                </div>
                                : <div style={{ padding: '15px', maxHeight: '120px' }} className='row'>
                                  <span> No Sequences Subcribed</span>
                                </div>
                              )
                            }
                            {hostname.includes('kiboengage.cloudkibo.com') &&
                              <Popover placement='left' className='subscriberPopover' isOpen={this.state.popoverAddSeqInd} target='subSeqInd' toggle={this.toggleSeqInd}>
                                <PopoverHeader>Subscribe Sequence</PopoverHeader>
                                <PopoverBody>
                                  <div className='row' style={{ minWidth: '250px' }}>
                                    <div className='col-12'>
                                      <label>Select Sequences</label>
                                      <Select
                                        options={this.state.sequenceOptions}
                                        onChange={this.handleSequenceInd}
                                        value={this.state.seqValueInd}
                                        placeholder='Select Sequence'
                                      />
                                    </div>
                                    {this.state.saveEnableSeqInd
                                      ? <div className='col-12'>
                                        <button style={{ float: 'right', margin: '15px' }}
                                          className='btn btn-primary btn-sm'
                                          onClick={() => {
                                            this.addSeqInd(this.state.subscriber)
                                            this.toggleSeqInd()
                                          }}>Save
                                    </button>
                                      </div>
                                      : <div className='col-12'>
                                        <button style={{ float: 'right', margin: '15px' }}
                                          className='btn btn-primary btn-sm'
                                          disabled>
                                          Save
                                    </button>
                                      </div>
                                    }
                                  </div>
                                </PopoverBody>
                              </Popover>
                            }


                            {
                              <div>
                                <div className='row'>
                                  <span style={{ fontWeight: 600, marginLeft: '15px', marginTop: '15px' }}>Web Chat Plugin Information:</span>

                                </div>
                                {
                                  this.state.subscriber.siteInfo ?
                                  <div>
                                    <span>This is the information captured when a customer sends a message from the chat plugin installed on your website</span>
                                    <div style={{ marginTop: '10px', marginLeft: '10px' }} className='row'>
                                      <span><strong>Page Title</strong>: {this.state.subscriber.siteInfo.pageTitle}</span>
                                    </div>

                                    <div style={{ marginTop: '10px', marginLeft: '10px' }} className='row'>
                                      <span><strong>Page URL</strong>: {this.state.subscriber.siteInfo.fullUrl}</span>
                                    </div>

                                    <div style={{ marginTop: '10px', marginLeft: '10px' }} className='row'>
                                      <span><strong>IP Address</strong>: {this.state.subscriber.siteInfo.location && this.state.subscriber.siteInfo.location.ip ? this.state.subscriber.siteInfo.location.ip : 'Unavailable'} </span>
                                    </div>

                                    <div style={{ marginTop: '10px', marginLeft: '10px' }} className='row'>
                                      <span><strong>Country</strong>: {this.state.subscriber.siteInfo.location && this.state.subscriber.siteInfo.location.country ? this.state.subscriber.siteInfo.location.country : 'Unavailable'}</span>
                                    </div>


                                    <div style={{ marginTop: '10px', marginLeft: '10px' }} className='row'>
                                      <span><strong>Browser</strong>: {this.state.subscriber.siteInfo.browser.browserName + ' ' + this.state.subscriber.siteInfo.browser.browserFullVersion}</span>
                                    </div>

                                    <div style={{ marginTop: '10px', marginLeft: '10px' }} className='row'>
                                      <span><strong>Platform</strong>: {this.state.subscriber.siteInfo.platform}</span>
                                    </div>
                                  </div> :
                                  <span>This subscriber did not come from any website, so there is no web chat plugin information available</span>
                                }
                              </div>
                            }
                          </div>
                        </div>
                        <div className='modal-footer' />
                      </div>
                    </div>
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

function mapStateToProps(state) {
  return {
    subscribers: (state.subscribersInfo.subscribers),
    count: (state.subscribersInfo.count),
    locales: (state.subscribersInfo.locales),
    pages: (state.pagesInfo.pages),
    tags: (state.tagsInfo.tags),
    customFields: (state.customFieldInfo.customFields),
    sequences: (state.sequenceInfo.sequences),
    subscriberSequences: (state.sequenceInfo.subscriberSequences),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadAllSubscribersListNew: loadAllSubscribersListNew,
    loadMyPagesList: loadMyPagesList,
    allLocales: allLocales,
    assignTags: assignTags,
    unassignTags: unassignTags,
    loadTags: loadTags,
    createTag: createTag,
    fetchAllSequence: fetchAllSequence,
    subscribeToSequence: subscribeToSequence,
    unsubscribeToSequence: unsubscribeToSequence,
    getSubscriberSequences: getSubscriberSequences,
    subscribe: subscribe,
    unSubscribe: unSubscribe,
    updatePicture: updatePicture,
    setCustomFieldValue: setCustomFieldValue,
    loadCustomFields: loadCustomFields

  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Subscriber)
