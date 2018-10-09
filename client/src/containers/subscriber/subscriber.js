/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loadAllSubscribersListNew, allLocales, subscribe, unSubscribe } from '../../redux/actions/subscribers.actions'
import { assignTags, unassignTags, loadTags, createTag } from '../../redux/actions/tags.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { fetchAllSequence, subscribeToSequence, unsubscribeToSequence, getSubscriberSequences } from '../../redux/actions/sequence.action'
import fileDownload from 'js-file-download'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Popover, PopoverHeader, PopoverBody, UncontrolledTooltip } from 'reactstrap'
import Select from 'react-select'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import EditTags from './editTags'
import AlertMessage from '../../components/alertMessages/alertMessage'
var json2csv = require('json2csv')

class Subscriber extends React.Component {
  constructor (props, context) {
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
      searchValue: '',
      statusValue: '',
      tagValue: '',
      filterPage: '',
      filterGender: '',
      filterLocale: '',
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
      showEditModal: false,
      subscriber: {},
      filter: false,
      status_value: '',
      saveEnableIndividual: false,
      saveEnableSeq: false,
      saveEnableSeqInd: false
    }
    props.allLocales()
    props.fetchAllSequence()
    props.loadMyPagesList()
    if (!this.props.location.state) {
      props.loadAllSubscribersListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', gender_value: '', page_value: '', locale_value: '', tag_value: '', status_value: ''}})
    }
    props.loadTags()
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
    this.openEditModal = this.openEditModal.bind(this)
    this.closeEditModal = this.closeEditModal.bind(this)
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
  }

  getDate (datetime) {
    let d = new Date(datetime)
    let dayofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
    let date = d.getDate()
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
    let year = d.getFullYear()

    return [dayofweek, date, month, year, d.toLocaleTimeString()].join(' ')
  }
  subscribe () {
    if (this.state.subscriber._id) {
      this.props.subscribe(this.state.subscriber._id, this.handleSubscription, this.msg)
    }
  }
  unSubscribe () {
    var payload = {}
    payload.page_id = this.state.subscriber.pageId ? this.state.subscriber.pageId._id : null
    payload.subscriber_id = this.state.subscriber._id
    if (payload.page_id && payload.subscriber_id) {
      this.props.unSubscribe(payload, this.handleSubscription, this.msg)
    }
  }
  handleSubscription (res, action) {
    if (res.status === 'success') {
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
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
  openEditModal () {
    this.setState({showEditModal: true})
  }
  setSubscriber (s) {
    this.setState({subscriber: s})
    this.props.getSubscriberSequences(s._id)
  }
  closeEditModal () {
    this.setState({showEditModal: false})
    this.props.loadAllSubscribersListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
  }
  handleAddIndividual (value) {
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
  removeTagIndividual (e, tag) {
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
  handleSequence (obj) {
    this.setState({sequenceValue: obj.value, saveEnableSeq: true})
  }
  handleSequenceInd (obj) {
    this.setState({seqValueInd: obj.value, saveEnableSeqInd: true})
  }
  handleCreateTag () {
    this.setState({
      saveEnable: false
    })
  }
  createUnassignPayload () {
    var payload = {}
    var selectedIds = []
    var subscribers = this.state.subscribersDataAll
    for (var i = 0; i < subscribers.length; i++) {
      var index = 0
      if (subscribers[i].selected && subscribers[i].tags) {
        for (var j = 0; j < subscribers[i].tags.length; j++) {
          if (subscribers[i].tags[j] !== this.state.removeTag.label) {
            index++
          }
        }
        if (index !== subscribers[i].tags.length) {
          selectedIds.push(subscribers[i]._id)
        }
      }
    }
    payload.subscribers = selectedIds
    payload.tagId = this.state.removeTag.value
    return payload
  }
  createAssignPayload () {
    var payload = {}
    var selectedIds = []
    var subscribers = this.state.subscribersDataAll
    for (var i = 0; i < subscribers.length; i++) {
      var index = 0
      if (subscribers[i].selected && subscribers[i].tags) {
        for (var j = 0; j < subscribers[i].tags.length; j++) {
          if (subscribers[i].tags[j] !== this.state.addTag.label) {
            index++
          }
        }
        if (index === subscribers[i].tags.length) {
          selectedIds.push(subscribers[i]._id)
        }
      }
    }
    payload.subscribers = selectedIds
    payload.tagId = this.state.addTag.value
    return payload
  }
  addTags () {
    var payload = this.createAssignPayload()
    if (payload.subscribers.length > 0) {
      this.props.assignTags(payload, this.handleSaveTags, this.msg)
    } else {
      if (this.msg) {
        this.msg.error('Select relevant subscribers')
      }
    }
  }
  addTagsIndividual (subscriber) {
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

  subscribeToSequence () {
    let subscribers = []
    for (let i = 0; i < this.state.subscribersDataAll.length; i++) {
      if (this.state.subscribersDataAll[i].selected) {
        subscribers.push(this.state.subscribersDataAll[i]._id)
      }
    }
    let data = {
      sequenceId: this.state.sequenceValue,
      subscriberIds: subscribers,
      fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'
    }
    this.props.subscribeToSequence(data, this.msg)
    this.setState({selectAllChecked: false, sequenceValue: ''})
  }

  removeSequence (sequenceId) {
    let data = {
      sequenceId: sequenceId,
      subscriberIds: [this.state.subscriber._id]
    }
    console.log('removeSequence', data)
    this.props.unsubscribeToSequence(data, this.msg, this.handleSeqResponse)
  }

  unsubscribeToSequence () {
    let subscribers = []
    for (let i = 0; i < this.state.subscribersDataAll.length; i++) {
      if (this.state.subscribersDataAll[i].selected) {
        subscribers.push(this.state.subscribersDataAll[i]._id)
      }
    }
    let data = {
      sequenceId: this.state.sequenceValue,
      subscriberIds: subscribers
    }
    this.props.unsubscribeToSequence(data, this.msg)
    this.setState({selectAllChecked: false, sequenceValue: ''})
  }

  handleSaveTags () {
    this.props.loadAllSubscribersListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
    this.setState({
      selectAllChecked: false
    })
  }

  removeTags () {
    var payload = this.createUnassignPayload()
    if (payload.subscribers.length > 0) {
      this.props.unassignTags(payload, this.handleSaveTags, this.msg)
    } else {
      if (this.msg) {
        this.msg.error('Select relevant subscribers')
      }
    }
  }
  handleRemove (value) {
    this.setState({ removeTag: value })
  }
  componentDidMount () {
    document.title = 'KiboPush | Subscribers'
    let filterStatusValue = ''
    if (this.props.location.state) {
      let pageId = this.props.location.state.page._id
      this.setState({filterPage: pageId})
      if (this.props.location.state.filterStatus === 'subscribed') {
        filterStatusValue = true
        this.setState({statusValue: 'subscribed'})
      } else {
        filterStatusValue = false
        this.setState({statusValue: 'unsubscribed'})
      }
      this.handleFilterByPageInitial(pageId, filterStatusValue)
    }
  }
  componentDidUpdate () {
  }
  toggleSeqInd () {
    this.setState({
      popoverAddSeqInd: !this.state.popoverAddSeqInd,
      seqValueInd: '',
      saveEnableSeqInd: false
    })
  }
  addSeqInd (subscriber) {
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
    this.setState({selectAllChecked: false, seqValueInd: ''})
  }
  handleSeqResponse (res) {
    if (res.status === 'success') {
      if (this.state.subscriber && this.state.subscriber._id) {
        this.props.getSubscriberSequences(this.state.subscriber._id)
      }
    }
  }
  toggleTag () {
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
  toggleAdd () {
    this.setState({
      popoverAddTagOpen: !this.state.popoverAddTagOpen
    })
  }
  toggleAddIndividual () {
    this.setState({
      popoverAddTagOpenIndividual: !this.state.popoverAddTagOpenIndividual,
      saveEnableIndividual: false
    })
  }
  toggleRemove () {
    this.setState({
      popoverRemoveTagOpen: !this.state.popoverRemoveTagOpen
    })
  }
  toggleSubscribe () {
    this.setState({
      openSubscribeToSequence: !this.state.openSubscribeToSequence
    })
  }
  toggleUnSubscribe () {
    this.setState({
      openUnsubscribeToSequence: !this.state.openUnsubscribeToSequence
    })
  }
  showAddTag () {
    this.setState({
      addTag: null,
      popoverAddTagOpen: true
    })
  }
  showAddTagIndiviual () {
    this.setState({
      addTagIndividual: null,
      popoverAddTagOpenIndividual: true
    })
  }
  showRemoveTag () {
    this.setState({
      removeTag: null,
      popoverRemoveTagOpen: true
    })
  }

  showSubscribeToSequence () {
    this.setState({
      sequenceValue: '',
      openSubscribeToSequence: true
    })
  }
  showUnsubscribeToSequence () {
    this.setState({
      sequenceValue: '',
      openUnsubscribeToSequence: true
    })
  }

  searchSubscriber (event) {
    this.setState({searchValue: event.target.value})
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: event.target.value, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})

      // var filtered = []
      // var data = this.props.subscribers
      // if (this.state.filteredData !== '') {
      //   data = this.state.filteredData
      // }
      // for (let i = 0; i < data.length; i++) {
      //   var fullName = data[i].firstName + ' ' + data[i].lastName
      //   if (data[i].firstName.toLowerCase().includes((event.target.value).toLowerCase()) || data[i].lastName.toLowerCase().includes((event.target.value).toLowerCase()) || fullName.toLowerCase().includes((event.target.value).toLowerCase())) {
      //     filtered.push(data[i])
      //   }
      // }
      // this.displayData(0, filtered)
      // this.setState({ totalLength: filtered.length })
    } else {
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: '', gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
    }
  }

  displayData (n, subscribers) {
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
    this.setState({subscribersData: data, subscribersDataAll: subscribers})
  }
  handleSubscriberClick (e) {
    var subscribers = this.state.subscribersData
    var subscribersAll = this.state.subscribersDataAll
    if (e.target.value === 'All') {
      if (e.target.checked) {
        this.setState({
          selectAllChecked: true
        })
        for (var i = 0; i < this.state.subscribersDataAll.length; i++) {
          subscribersAll[i].selected = true
        }
        for (var j = 0; j < this.state.subscribersData.length; j++) {
          subscribers[j].selected = true
        }
      } else {
        this.setState({
          selectAllChecked: false
        })
        for (var k = 0; k < this.state.subscribersDataAll.length; k++) {
          subscribersAll[k].selected = false
        }
        for (var m = 0; m < this.state.subscribersData.length; m++) {
          subscribers[m].selected = false
        }
      }
      this.setState({subscribersData: subscribers})
      this.setState({subscribersDataAll: subscribersAll})
      return
    }
    if (e.target.value !== '') {
      if (e.target.checked) {
        for (var p = 0; p < this.state.subscribersDataAll.length; p++) {
          if (subscribersAll[p]._id === subscribers[e.target.value]._id) {
            subscribersAll[p].selected = true
          }
        }
        subscribers[e.target.value].selected = true
        this.setState({subscribersData: subscribers})
        this.setState({subscribersDataAll: subscribersAll})
      } else {
        for (var q = 0; q < this.state.subscribersDataAll.length; q++) {
          if (subscribersAll[q]._id === subscribers[e.target.value]._id) {
            subscribersAll[q].selected = false
          }
        }
        subscribers[e.target.value].selected = false
        this.setState({subscribersData: subscribers})
        this.setState({subscribersDataAll: subscribersAll})
      }
    }
  }
  prepareExportData () {
    var data = []
    var subscriberObj = {}
    for (var i = 0; i < this.state.subscribersData.length; i++) {
      var subscriber = this.state.subscribersData[i]
      subscriberObj = {
        'Profile Picture': subscriber.profilePic,
        'Name': `${subscriber.firstName} ${subscriber.lastName}`,
        'Page': subscriber.pageId.pageName,
        'PhoneNumber': subscriber.phoneNumber,
        'Email': subscriber.email,
        'Source': subscriber.source === 'customer_matching' ? 'PhoneNumber' : subscriber.source === 'direct_message' ? 'Direct Message' : 'Chat Plugin',
        'Locale': subscriber.locale,
        'Gender': subscriber.gender,
        'tags': subscriber.tags
      }
      data.push(subscriberObj)
    }
    return data
  }
  exportRecords () {
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
  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadAllSubscribersListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
    } else if (this.state.pageSelected < data.selected) {
      this.props.loadAllSubscribersListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
    } else {
      this.props.loadAllSubscribersListNew({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.subscribers.length > 0 ? this.props.subscribers[0]._id : 'none', number_of_records: 10, first_page: 'previous', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
    }
    this.setState({pageSelected: data.selected})
    this.displayData(data.selected, this.state.subscribersDataAll)
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextProps in subscribers', nextProps)
    if (nextProps.subscribers && nextProps.count) {
      this.displayData(0, nextProps.subscribers)
      this.setState({ totalLength: nextProps.count })
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
      this.setState({subscribersData: [], subscribersDataAll: [], totalLength: 0})
    }
    if (nextProps.tags) {
      var tagOptions = []
      for (var i = 0; i < nextProps.tags.length; i++) {
        tagOptions.push({'value': nextProps.tags[i]._id, 'label': nextProps.tags[i].tag})
      }
      this.setState({
        options: tagOptions
      })
    }
    if (nextProps.sequences) {
      let sequenceOptions = []
      for (let a = 0; a < nextProps.sequences.length; a++) {
        if (nextProps.sequences[a].sequence.trigger.event === 'subscribes_to_sequence') {
          sequenceOptions.push({'value': nextProps.sequences[a].sequence._id, 'label': nextProps.sequences[a].sequence.name})
        }
      }
      this.setState({sequenceOptions: sequenceOptions})
    }
  }
  stackGenderFilter (filteredData) {
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

  stackLocaleFilter (filteredData) {
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
  stackStatusFilter (filteredData) {
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
  stackPageFilter (filteredData) {
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
  stackTagFilter (filteredData) {
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

  handleFilterByTag (e) {
    this.setState({tagValue: e.target.value})
    //  this.setState({searchValue: ''})
    // var filteredData = this.props.subscribers
    // filteredData = this.stackGenderFilter(filteredData)
    // filteredData = this.stackLocaleFilter(filteredData)
    // filteredData = this.stackPageFilter(filteredData)
    // filteredData = this.stackStatusFilter(filteredData)
    //  var filtered = []
    console.log('e.target.value', e.target.value)
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true, filterByTag: e.target.value})
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: e.target.value, status_value: this.state.status_value}})
      // for (var k = 0; k < filteredData.length; k++) {
      //   if (filteredData[k].tags) {
      //     for (var i = 0; i < filteredData[k].tags.length; i++) {
      //       if (filteredData[k].tags[i] === e.target.value) {
      //         filtered.push(filteredData[k])
      //         break
      //       }
      //     }
      //   }
      // }
      // filteredData = filtered
    } else {
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: '', status_value: this.state.status_value}})
    }
    // this.setState({filteredData: filteredData})
    // this.displayData(0, filteredData)
    // this.setState({pageSelected: 0})
    // this.setState({ totalLength: filteredData.length })
  }
  handleFilterByPage (e) {
    this.setState({filterPage: e.target.value})
    // var filteredData = this.props.subscribers
    // filteredData = this.stackGenderFilter(filteredData)
    // filteredData = this.stackLocaleFilter(filteredData)
    // filteredData = this.stackTagFilter(filteredData)
    // filteredData = this.stackStatusFilter(filteredData)
    // var filtered = []
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true, filterByPage: e.target.value})
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: e.target.value, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
      // for (var k = 0; k < filteredData.length; k++) {
      //   if (filteredData[k].pageId && (filteredData[k].pageId.pageId === e.target.value)) {
      //     filtered.push(filteredData[k])
      //   }
      // }
      // filteredData = filtered
    } else {
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: '', locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
    }
    // this.setState({filteredData: filteredData})
    // this.displayData(0, filteredData)
    // this.setState({pageSelected: 0})
    // this.setState({ totalLength: filteredData.length })
  }

  handleFilterByPageInitial (pageId, isSubscribed) {
    this.setState({filterByPage: pageId, status_value: isSubscribed})
    if (pageId !== '' && pageId !== 'all') {
      this.setState({filter: true})
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: pageId, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: isSubscribed}})
    } else {
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: '', locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: isSubscribed}})
    }
  }
  handleFilterByGender (e) {
    this.setState({filterGender: e.target.value})
    // var filteredData = this.props.subscribers
    // filteredData = this.stackPageFilter(filteredData)
    // filteredData = this.stackLocaleFilter(filteredData)
    // filteredData = this.stackTagFilter(filteredData)
    // filteredData = this.stackStatusFilter(filteredData)
    // var filtered = []
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true, filterByGender: e.target.value})
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: e.target.value, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
      // for (var k = 0; k < filteredData.length; k++) {
      //   if (filteredData[k].gender && (filteredData[k].gender === e.target.value)) {
      //     filtered.push(filteredData[k])
      //   }
      // }
      // filteredData = filtered
    } else {
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: '', page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
    }
    // this.setState({filteredData: filteredData})
    // this.displayData(0, filteredData)
    // this.setState({pageSelected: 0})
    // this.setState({ totalLength: filteredData.length })
  }

  handleFilterByLocale (e) {
    this.setState({filterLocale: e.target.value})
    // var filteredData = this.props.subscribers
    // filteredData = this.stackPageFilter(filteredData)
    // filteredData = this.stackGenderFilter(filteredData)
    // filteredData = this.stackTagFilter(filteredData)
    // filteredData = this.stackStatusFilter(filteredData)
    // var filtered = []
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true, filterByLocale: e.target.value})
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: e.target.value, tag_value: this.state.filterByTag, status_value: this.state.status_value}})
      // for (var k = 0; k < filteredData.length; k++) {
      //   if (filteredData[k].locale && (filteredData[k].locale === e.target.value)) {
      //     filtered.push(filteredData[k])
      //   }
      // }
      // filteredData = filtered
    } else {
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: '', tag_value: this.state.filterByTag, status_value: this.state.status_value}})
    }
    // this.setState({filteredData: filteredData})
    // this.displayData(0, filteredData)
    // this.setState({pageSelected: 0})
    // this.setState({ totalLength: filteredData.length })
  }

  handleFilterByStatus (e) {
    // var filteredData = this.props.subscribers
    // filteredData = this.stackPageFilter(filteredData)
    // filteredData = this.stackGenderFilter(filteredData)
    // filteredData = this.stackTagFilter(filteredData)
    // filteredData = this.stackLocaleFilter(filteredData)
    // var filtered = []
    this.setState({statusValue: e.target.value})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true})
      if (e.target.value === 'subscribed') {
        this.setState({status_value: true})
        this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: true}})
      } else {
        this.setState({status_value: false})
        this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: false}})
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
      this.setState({status_value: ''})
      this.props.loadAllSubscribersListNew({last_id: this.props.subscribers.length > 0 ? this.props.subscribers[this.props.subscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.filterByGender, page_value: this.state.filterByPage, locale_value: this.state.filterByLocale, tag_value: this.state.filterByTag, status_value: ''}})
    }
    // this.setState({filteredData: filteredData})
    // this.displayData(0, filteredData)
    // this.setState({pageSelected: 0})
    // this.setState({ totalLength: filteredData.length })
  }

  render () {
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

    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
              <a href='http://kibopush.com/subscribers/' target='_blank'>Click Here </a> to learn how you can get more subscribers.
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Page Subscribers
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    {this.props.pages && this.props.pages.length > 0
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

                <div className='m-portlet__body'>
                  <div style={{marginTop: '-50px'}}>
                    <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                      <div className='row align-items-center'>
                        <div className='col-xl-12 order-2 order-xl-1'>
                          <div className='row filters' style={{marginTop: '25px', display: 'flex'}}>
                            <div className='col-md-4'>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='' style={{marginTop: '10px'}}>
                                  <label style={{width: '60px'}}>Gender:</label>
                                </div>
                                {/* <div className='m-form__control'>
                              <div className='btn-group bootstrap-select form-control m-bootstrap-select m-bootstrap-select--solid dropup'><button type='button' className='btn dropdown-toggle bs-placeholder btn-default' data-toggle='dropdown' role='button' data-id='m_form_status' title='All' aria-expanded='false'><span className='filter-option pull-left'>All</span>&nbsp;<span className='bs-caret'><span className='caret' /></span></button><div className='dropdown-menu open' role='combobox'><ul className='dropdown-menu inner' role='listbox' aria-expanded='false'><li data-original-index='0' className='selected'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='true'><span className='text'>All</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='1'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Male</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='2'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Female</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='3'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Other</span><span className='glyphicon glyphicon-ok check-mark' /></a></li></ul>
                              </div> */}
                                <div className='m-form__control'>
                                  <select className='custom-select' id='m_form_status' style={{width: '250px'}} tabIndex='-98' value={this.state.filterGender} onChange={this.handleFilterByGender}>
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
                            <div className='col-md-4'>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='' style={{marginTop: '10px'}}>
                                  <label style={{width: '60px'}}>Page:</label>
                                </div>
                                <div className='m-form__control'>
                                  <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.filterPage} onChange={this.handleFilterByPage}>
                                    <option key='' value='' disabled>Filter by Page...</option>
                                    <option key='ALL' value='all'>ALL</option>
                                    {
                                      this.props.pages && this.props.pages.map((page, i) => (
                                        <option key={i} value={page._id}>{page.pageName}</option>
                                      ))
                                    }
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-4'>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='' style={{marginTop: '10px'}}>
                                  <label style={{width: '60px'}}>Locale:</label>
                                </div>
                                <div className='m-form__control'>
                                  {/* <div className='btn-group bootstrap-select form-control m-bootstrap-select m-bootstrap-select--solid'>
                                <button type='button' className='btn dropdown-toggle bs-placeholder btn-default' data-toggle='dropdown' role='button' data-id='m_form_type' title='All'><span className='filter-option pull-left'>All</span>&nbsp;<span className='bs-caret'><span className='caret' /></span></button>
                                <div className='dropdown-menu open' role='combobox'>
                                  <ul className='dropdown-menu inner' role='listbox' aria-expanded='false'><li data-original-index='0' className='selected'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='true'><span className='text'>All</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='1'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_US</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='2'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_GB</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='3'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_AZ</span><span className='glyphicon glyphicon-ok check-mark' /></a></li></ul></div>
                                */}<select className='custom-select' style={{width: '250px'}} id='m_form_type' tabIndex='-98' value={this.state.filterLocale} onChange={this.handleFilterByLocale}>
                                  <option key='' value='' disabled>Filter by Locale...</option>
                                  <option key='ALL' value='all'>ALL</option>
                                  {
                                    this.props.locales && this.props.locales.map((locale, i) => (
                                      <option key={i} value={locale}>{locale}</option>
                                    ))
                                  }
                                </select>{/* </div> */}
                                </div>
                              </div>
                            </div>
                            <div className='col-md-4' style={{marginTop: '20px'}}>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='' style={{marginTop: '10px'}}>
                                  <label style={{width: '60px'}}>Tags:</label>
                                </div>
                                <div className='m-form__control'>
                                  <select className='custom-select'style={{width: '250px'}} id='m_form_type' tabIndex='-98' value={this.state.tagValue} onChange={this.handleFilterByTag}>
                                    <option key='' value='' disabled>Filter by Tags...</option>
                                    <option key='ALL' value='all'>ALL</option>
                                    {
                                      this.state.options.map((tag, i) => (
                                        <option key={i} value={tag.value}>{tag.label}</option>
                                      ))
                                    }
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-4' style={{marginTop: '20px'}}>
                              <div className='m-form__group m-form__group--inline'>
                                <div className='' style={{marginTop: '10px'}}>
                                  <label style={{width: '60px'}}>Status:</label>
                                </div>
                                <div className='m-form__control'>
                                  <select className='custom-select'style={{width: '250px'}} id='m_form_type' tabIndex='-98' value={this.state.statusValue} onChange={this.handleFilterByStatus}>
                                    <option key='' value='' disabled>Filter by Status...</option>
                                    <option key='ALL' value='all'>ALL</option>
                                    <option key='subscribed' value='subscribed'>Subscribed</option>
                                    <option key='unsubscribed' value='unsubscribed'>Unsubscribed</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div style={{marginTop: '15px'}} className='form-group m-form__group row align-items-center'>
                            <div className='col-md-8'>
                              <div className='m-input-icon m-input-icon--left'>
                                <input type='text' className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                                <span className='m-input-icon__icon m-input-icon__icon--left'>
                                  <span><i className='la la-search' /></span>
                                </span>
                              </div>
                            </div>
                            <div className='col-md-4'>
                              <div className='pull-right' style={{display: 'flex'}}>
                                <div style={{display: 'block'}}>
                                  <Dropdown id='assignTag' isOpen={this.state.dropdownActionOpen} toggle={this.toggleTag}>
                                    <DropdownToggle caret>
                                       Assign Tags in bulk
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem onClick={this.showAddTag}>Assign Tags</DropdownItem>
                                      <DropdownItem onClick={this.showRemoveTag}>UnAssign Tags</DropdownItem>
                                      <DropdownItem onClick={this.showSubscribeToSequence}>Subscribe to Sequence</DropdownItem>
                                      <DropdownItem onClick={this.showUnsubscribeToSequence}>Unsubscribe to Sequence</DropdownItem>
                                    </DropdownMenu>
                                  </Dropdown>
                                  {/* <span style={{fontSize: '0.8rem', color: '#5cb85c'}}>Tag limit for each subscriber is 10</span> */}
                                </div>
                                { this.props.tags && this.props.tags.length > 0 &&
                                  <div style={{marginLeft: '10px', marginTop: '5px'}}><Link style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}} onClick={this.openEditModal}>Edit Tags</Link></div>
                                }
                                {
                                  this.state.showEditModal &&
                                  <ModalContainer style={{width: '800px'}}
                                    onClose={this.closeEditModal}>
                                    <ModalDialog style={{width: '800px'}}
                                      onClose={this.closeEditModal}>
                                      <EditTags currentTags={this.props.tags} />
                                    </ModalDialog>
                                  </ModalContainer>
                                }
                                <Popover placement='left' className='subscriberPopover' isOpen={this.state.popoverAddTagOpen} target='assignTag' toggle={this.toggleAdd}>
                                  <PopoverHeader>Add Tags</PopoverHeader>
                                  <PopoverBody>
                                    <div className='row' style={{minWidth: '250px'}}>
                                      <div className='col-12'>
                                        <label>Select Tags</label>
                                        <Select.Creatable
                                          options={this.state.options}
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
                                <Popover placement='left' className='subscriberPopover' isOpen={this.state.popoverRemoveTagOpen} target='assignTag' toggle={this.toggleRemove}>
                                  <PopoverHeader>Remove Tags</PopoverHeader>
                                  <PopoverBody>
                                    <div className='row' style={{minWidth: '250px'}}>
                                      <div className='col-12'>
                                        <label>Select Tags</label>
                                        <Select
                                          options={this.state.options}
                                          onChange={this.handleRemove}
                                          value={this.state.removeTag}
                                          placeholder='Remove User Tags'
                                        />
                                      </div>
                                      <div className='col-12'>
                                        <button style={{float: 'right', margin: '15px'}}
                                          className='btn btn-primary btn-sm'
                                          onClick={() => {
                                            this.removeTags()
                                            this.toggleRemove()
                                          }}>Save
                                        </button>
                                      </div>
                                    </div>
                                  </PopoverBody>
                                </Popover>
                                <Popover placement='left' className='subscriberPopover' isOpen={this.state.openSubscribeToSequence} target='assignTag' toggle={this.toggleSubscribe}>
                                  <PopoverHeader>Subscribe to Sequence</PopoverHeader>
                                  <PopoverBody>
                                    <div className='row' style={{minWidth: '250px'}}>
                                      <div className='col-12'>
                                        <label>Select Sequence</label>
                                        <Select
                                          options={this.state.sequenceOptions}
                                          onChange={this.handleSequence}
                                          value={this.state.sequenceValue}
                                          placeholder='Select Sequence...'
                                        />
                                      </div>
                                      {this.state.saveEnableSeq
                                      ? <div className='col-12'>
                                        <button style={{float: 'right', margin: '15px'}}
                                          className='btn btn-primary btn-sm'
                                          onClick={() => {
                                            this.subscribeToSequence()
                                            this.toggleSubscribe()
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
                                <Popover placement='left' className='subscriberPopover' isOpen={this.state.openUnsubscribeToSequence} target='assignTag' toggle={this.toggleUnSubscribe}>
                                  <PopoverHeader>Unsubscribe from Sequence</PopoverHeader>
                                  <PopoverBody>
                                    <div className='row' style={{minWidth: '250px'}}>
                                      <div className='col-12'>
                                        <label>Select Sequence</label>
                                        <Select
                                          options={this.state.sequenceOptions}
                                          onChange={this.handleSequence}
                                          value={this.state.sequenceValue}
                                          placeholder='Remove User Tags'
                                        />
                                      </div>
                                      <div className='col-12'>
                                        <button style={{float: 'right', margin: '15px'}}
                                          className='btn btn-primary btn-sm'
                                          onClick={() => {
                                            this.unsubscribeToSequence()
                                            this.toggleUnSubscribe()
                                          }}>Save
                                        </button>
                                      </div>
                                    </div>
                                  </PopoverBody>
                                </Popover>
                              </div>
                            </div>
                          </div>
                        </div>
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
                            style={{height: '53px'}}>
                            <th data-field='Select All'
                              className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '30px', overflow: 'inherit'}}>
                                <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllChecked} onChange={this.handleSubscriberClick} /></span></th>
                            <th data-field='Profile Picture'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Profile Picture</span>
                            </th>
                            <th data-field='Name'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Name</span>
                            </th>
                            <th data-field='Page'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Page</span>
                            </th>
                            <th data-field='Status'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Status</span>
                            </th>
                            <th data-field='Gender'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '50px', overflow: 'inherit'}}>Gender</span>
                            </th>
                            <th data-field='Locale'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Locale</span>
                            </th>
                            <th data-field='Tag'
                              className='m-datatable__cell--center m-datatable__cell'>
                              <span style={{width: '50px', overflow: 'inherit'}}>Tags</span>
                            </th>
                          </tr>
                        </thead>

                        <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                          {
                        this.state.subscribersData.map((subscriber, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even subscriberRow'
                            style={{height: '55px', cursor: 'pointer'}} key={i}>
                            <td data-field='Select All'
                              className='m-datatable__cell'>
                              <span style={{width: '30px', overflow: 'inherit'}}>
                                <input type='checkbox' name={subscriber._id} value={i} onChange={this.handleSubscriberClick} checked={subscriber.selected} />
                              </span></td>
                            <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Profile Picture'
                              className='m-datatable__cell'>
                              <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                <img alt='pic'
                                  src={(subscriber.profilePic) ? subscriber.profilePic : ''}
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
                              <span style={{width: '50px'}}>
                                {
                                  subscriber.gender === 'male' ? (<i className='la la-male' style={{color: subscriber.isSubscribed ? '#716aca' : '#818a91'}} />) : (<i className='la la-female' style={{color: subscriber.isSubscribed ? '#716aca' : '#818a91'}} />)
                                }
                              </span>
                            </td>
                            <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Locale' className='m-datatable__cell'><span style={{width: '100px', color: 'white', backgroundColor: !subscriber.isSubscribed && '#818a91'}} className='m-badge m-badge--brand'>{subscriber.locale}</span></td>
                            <td data-toggle='modal' data-target='#m_modal_1_2' onClick={() => { this.setSubscriber(subscriber) }} data-field='Tag' id={'tag-' + i} className='m-datatable__cell'>
                              <span style={{width: '50px', color: 'white', overflow: 'inherit'}}>
                                {
                                  subscriber.tags && subscriber.tags.length > 0 ? (<i className='la la-tags' style={{color: subscriber.isSubscribed ? '#716aca' : '#818a91'}} />) : ('No Tags Assigned')
                                }
                              </span>
                              {subscriber.tags && subscriber.tags.length > 0 &&
                                <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} placement='left' target={'tag-' + i}>
                                    {
                                        subscriber.tags.map((tag, i) => (
                                          <span key={i} style={{display: 'block'}}>{tag}</span>
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
                      <ReactPaginate previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.state.pageSelected} />

                    </div>
                    : <div className='table-responsive'>
                      <p> No data to display </p>
                    </div>
                  }
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
                </div>
                <div style={{background: 'rgba(33, 37, 41, 0.6)'}} className='modal fade' id='m_modal_1_2' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
                  <div style={{transform: 'translate(0, 0)'}} className='modal-dialog' role='document'>
                    <div className='modal-content'>
                      <div style={{display: 'block'}} className='modal-header'>
                        <h5 className='modal-title' id='exampleModalLabel'>
                          {this.state.subscriber.firstName ? (this.state.subscriber.firstName + ' ' + this.state.subscriber.lastName) : ''}
                        </h5>
                        <button style={{marginTop: '-10px', opacity: '0.5'}} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                          <span aria-hidden='true'>
                            &times;
                          </span>
                        </button>
                      </div>
                      <div className='modal-body'>
                        <div style={{maxHeight: '350px', overflowX: 'hidden', overflowY: 'scroll'}} className='m-scrollable' data-scrollbar-shown='true' data-scrollable='true' data-max-height='200'>
                          <div className='row'>
                            <div className='col-md-3'>
                              <img style={{width: '120px'}} alt='pic' src={(this.state.subscriber.profilePic) ? this.state.subscriber.profilePic : ''} />
                            </div>
                            <div style={{paddingLeft: '30px'}} className='col-md-9'>
                              {
                                this.state.subscriber.isSubscribed
                                ? <div style={{display: 'block', marginTop: '5px'}}>
                                  <i style={{fontWeight: 'bold'}} className='la la-check-circle' />
                                    subscribed
                                  <a onClick={this.unSubscribe} style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}> {'(Unsubscribe)'}</a>
                                </div>
                                : <div style={{display: 'block', marginTop: '5px'}}>
                                  <i style={{fontWeight: 'bold'}} className='la la-times-circle' />
                                  unsubscribed
                                  { this.state.subscriber.unSubscribedBy !== 'subscriber' &&
                                    <a onClick={this.subscribe} style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}> {'(Subscribe)'}</a>
                                  }
                                </div>
                              }
                              {
                                this.state.subscriber.gender && this.state.subscriber.gender === 'male'
                                ? <span style={{display: 'block', marginTop: '5px'}}><i style={{fontWeight: 'bold'}} className='la la-male' /> male</span>
                                : <span style={{display: 'block', marginTop: '5px'}}><i style={{fontWeight: 'bold'}} className='la la-female' /> female</span>
                              }
                              {
                                this.state.subscriber.locale
                                ? <span style={{display: 'block', marginTop: '5px'}}><i style={{fontWeight: 'bold'}} className='la la-globe' /> {this.state.subscriber.locale}</span>
                                : <span style={{display: 'block', marginTop: '5px'}}><i style={{fontWeight: 'bold'}} className='la la-globe' /></span>
                              }
                              {
                                this.state.subscriber.email &&
                                <span style={{display: 'block', marginTop: '5px'}}><i style={{fontWeight: 'bold'}} className='la la-envelope' /> {this.state.subscriber.email}</span>
                              }
                              {
                                this.state.subscriber.phoneNumber &&
                                <span style={{display: 'block', marginTop: '5px'}}><i style={{fontWeight: 'bold'}} className='la la-phone' /> {this.state.subscriber.phoneNumber}</span>
                              }
                            </div>
                          </div>
                          <br />
                          <div className='row'>
                            <div className='col-md-4'>
                              {
                                this.state.subscriber.isSubscribed
                                ? <div>
                                  <span style={{fontWeight: 600}}>Subscribed At:</span>
                                  <br />
                                  <span>{this.getDate(this.state.subscriber.datetime)}</span>
                                </div>
                                : <div>
                                  <span style={{fontWeight: 600}}>Unsubscribed At:</span>
                                  <br />
                                  <span>{this.getDate(this.state.subscriber.datetime)}</span>
                                </div>
                              }
                            </div>
                            <div className='col-md-4'>
                              {
                                this.state.subscriber.pageId &&
                                <div>
                                  <span style={{fontWeight: 600}}>Facebook Page:</span>
                                  <br />
                                  <span>{this.state.subscriber.pageId.pageName}</span>
                                </div>
                              }
                            </div>
                            <div className='col-md-4'>
                              {
                                this.state.subscriber.source === 'customer_matching'
                                ? <div>
                                  <span style={{fontWeight: 600}}>Source:</span>
                                  <br />
                                  <span>Phone Number</span>
                                </div>
                                : <div>
                                  <span style={{fontWeight: 600}}>Source:</span>
                                  <br />
                                  <span>Direct Message</span>
                                </div>
                              }
                            </div>
                          </div>
                          <br />
                          <div className='row'>
                            <span style={{fontWeight: 600, marginLeft: '15px'}}>User Tags:</span>
                            <a id='assignIndividualTag' style={{cursor: 'pointer', float: 'right', color: 'blue', marginLeft: '260px'}} onClick={this.showAddTagIndiviual}><i className='la la-plus' />Assign Tags</a>
                          </div>
                          {
                            this.props.tags && this.props.tags.length > 0 && this.state.subscriber.tags && this.state.subscriber.tags.length > 0
                            ? <div style={{padding: '15px', maxHeight: '120px'}} className='row'>
                              {
                                this.state.subscriber.tags.map((tag, i) => (
                                  <button key={i} style={{marginRight: '5px', marginBottom: '15px'}} className='btn m-btn--pill btn-success btn-sm'>{tag} <i style={{cursor: 'pointer'}} onClick={(e) => { this.removeTagIndividual(e, tag) }} className='la la-close' /></button>
                                ))
                              }
                            </div>
                            : <div style={{padding: '15px', maxHeight: '120px'}} className='row'>
                              <span> No Tags Assigned</span>
                            </div>
                          }
                          <Popover placement='left' className='subscriberPopover' isOpen={this.state.popoverAddTagOpenIndividual} target='assignIndividualTag' toggle={this.toggleAddIndividual}>
                            <PopoverHeader>Add Tags</PopoverHeader>
                            <PopoverBody>
                              <div className='row' style={{minWidth: '250px'}}>
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
                                  <button style={{float: 'right', margin: '15px'}}
                                    className='btn btn-primary btn-sm'
                                    onClick={() => {
                                      this.addTagsIndividual(this.state.subscriber)
                                      this.toggleAddIndividual()
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
                          <div className='row'>
                            <span style={{fontWeight: 600, marginLeft: '15px'}}>Subscribed to Sequences:</span>
                            <a id='subSeqInd' onClick={this.toggleSeqInd} style={{cursor: 'pointer', float: 'right', color: 'blue', marginLeft: '175px'}}> Subscribe</a>
                          </div>
                          {
                            this.props.sequences && this.props.sequences.length > 0 && this.props.subscriberSequences && this.props.subscriberSequences.length > 0
                            ? <div style={{padding: '15px', maxHeight: '120px'}} className='row'>
                              {
                                this.props.subscriberSequences.map((seq, i) => (
                                  <button key={i} style={{marginRight: '5px', marginBottom: '15px'}} className='btn m-btn--pill btn-success btn-sm'>{seq.sequenceId.name} <i style={{cursor: 'pointer'}} onClick={() => { this.removeSequence(seq.sequenceId._id) }} className='la la-close' /></button>
                                ))
                              }
                            </div>
                            : <div style={{padding: '15px', maxHeight: '120px'}} className='row'>
                              <span> No Sequences Subcribed</span>
                            </div>
                          }
                          <Popover placement='left' className='subscriberPopover' isOpen={this.state.popoverAddSeqInd} target='subSeqInd' toggle={this.toggleSeqInd}>
                            <PopoverHeader>Subscribe Sequence</PopoverHeader>
                            <PopoverBody>
                              <div className='row' style={{minWidth: '250px'}}>
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
                                  <button style={{float: 'right', margin: '15px'}}
                                    className='btn btn-primary btn-sm'
                                    onClick={() => {
                                      this.addSeqInd(this.state.subscriber)
                                      this.toggleSeqInd()
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
                      <div className='modal-footer' />
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

function mapStateToProps (state) {
  return {
    subscribers: (state.subscribersInfo.subscribers),
    count: (state.subscribersInfo.count),
    locales: (state.subscribersInfo.locales),
    pages: (state.pagesInfo.pages),
    tags: (state.tagsInfo.tags),
    sequences: (state.sequenceInfo.sequences),
    subscriberSequences: (state.sequenceInfo.subscriberSequences)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadAllSubscribersListNew: loadAllSubscribersListNew,
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
    unSubscribe: unSubscribe
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Subscriber)
