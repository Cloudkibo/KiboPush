/* eslint-disable no-useless-constructor */
import React from 'react'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {
  loadCustomerLists, createSubList, editList, loadListDetails, getParentList, getRepliedPollSubscribers, getRepliedSurveySubscribers
} from '../../redux/actions/customerLists.actions'
import { loadSubscribersList, allLocales } from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'
import { getSubList } from './subList'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { loadTags } from '../../redux/actions/tags.actions'
import { loadCustomFields, getCustomFieldSubscribers } from '../../redux/actions/customFields.actions'

class CreateSubList extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedRadio: '',
      listSelected: '',
      conditions: [{ condition: '', criteria: '', text: '' }],
      newListName: '',
      errorMessages: [],
      isSaveEnabled: true,
      isEdit: false,
      parentListName: '',
      parentListData: [],
      allSubscribers: [],
      lists: [],
      dropdownConditionOpen: false,
      joiningCondition: this.props.currentList ? this.props.currentList.joiningCondition : 'AND',
      genders: ['male', 'female', 'other']
    }
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.initializeListSelect = this.initializeListSelect.bind(this)
    this.handleNameText = this.handleNameText.bind(this)
    this.addCondition = this.addCondition.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.changeCriteria = this.changeCriteria.bind(this)
    this.changeText = this.changeText.bind(this)
    this.removeCondition = this.removeCondition.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.validateNewList = this.validateNewList.bind(this)
    this.handleCreateSubList = this.handleCreateSubList.bind(this)
    this.handleEditList = this.handleEditList.bind(this)
    this.resetPage = this.resetPage.bind(this)
    this.initializeList = this.initializeList.bind(this)
    this.handleGetParentList = this.handleGetParentList.bind(this)
    this.createSubList = this.createSubList.bind(this)
    this.editSubList = this.editSubList.bind(this)
    this.toggleCondition = this.toggleCondition.bind(this)
    this.changeConditionToAnd = this.changeConditionToAnd.bind(this)
    this.changeConditionToOr = this.changeConditionToOr.bind(this)
    this.updateTextBox = this.updateTextBox.bind(this)
    props.loadMyPagesList()
    props.loadCustomerLists()
    props.loadSubscribersList()
    props.getRepliedPollSubscribers()
    props.getRepliedSurveySubscribers()
    props.loadTags()
    props.loadCustomFields()
    props.getCustomFieldSubscribers()
  }
  componentDidMount() {
    if (this.props.customerLists) {
      let options = []
      for (let i = 0; i < this.props.customerLists.length; i++) {
        if (!(this.props.customerLists[i].initialList)) {
          options.push({ id: this.props.customerLists[i]._id, text: this.props.customerLists[i].listName })
        } else {
          if (this.props.customerLists[i].content && this.props.customerLists[i].content.length > 0) {
            options.push({ id: this.props.customerLists[i]._id, text: this.props.customerLists[i].listName })
          }
        }
      }
      this.setState({ lists: options })
      this.initializeListSelect(options)
      if (options.length === 0) {
        this.setState({selectedRadio: 'segmentAll'})
      }
    }
    if (this.props.currentList) {
      this.initializeList()
    }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Create Sublist`
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.subscribers) {
      this.setState({ allSubscribers: nextProps.subscribers })
    }
  }
  toggleCondition() {
    this.setState({ dropdownConditionOpen: !this.state.dropdownConditionOpen })
  }
  changeConditionToAnd() {
    this.setState({
      joiningCondition: 'AND'
    })
  }
  changeConditionToOr() {
    this.setState({
      joiningCondition: 'OR'
    })
  }
  initializeList() {
    let tempConditions = []
    if (this.props.currentList.conditions) {
      let editCondition = this.props.currentList.conditions
      for (let i = 0; i < editCondition.length; i++) {
        let obj = {}
        obj.condition = editCondition[i].condition
        obj.criteria = editCondition[i].criteria
        obj.text = editCondition[i].text
        tempConditions.push(obj)
      }
    }

    this.setState({
      parentListName: this.props.currentList.parentListName ? this.props.currentList.parentListName : '',
      isEdit: true,
      newListName: this.props.currentList.listName,
      conditions: tempConditions
    })
    // var id = this.props.currentList._id
  }
  onSave() {
    let isValid = this.validateNewList()
    if (isValid) {
      this.setState({ errorMessages: [], isSaveEnabled: false })
      let parentListId = ''
      if (this.state.listSelected !== '') {
        parentListId = this.state.listSelected._id
        this.props.getParentList(parentListId, this.handleGetParentList, this.msg)
      } else {
        this.setState({ parentListData: this.props.subscribers })
        let responses = this.props.pollSubscribers.concat(this.props.surveySubscribers)
        console.log('Responses: ', responses)
        let subSetIds = getSubList(this.props.subscribers, this.state.conditions, this.props.pages, this.state.joiningCondition,this.props.customFields, this.props.customFieldSubscribers, responses)
        console.log('subSetIds: ', subSetIds)
        if (subSetIds.length > 0) {
          this.createSubList(subSetIds)
        } else {
          this.msg.error('New list is empty. Try creating a list with a different condition')
          this.setState({ isSaveEnabled: true })
        }
      }
    }
  }
  handleGetParentList(response) {
    if (response.payload) {
      this.setState({ parentListData: response.payload })
      let subSetIds = getSubList(response.payload, this.state.conditions, this.props.pages, this.props.customFields, this.props.customFieldSubscribers, this.state.joiningCondition)
      if (subSetIds.length > 0) {
        if (this.state.isEdit) {
          this.editSubList(subSetIds)
        } else {
          this.createSubList(subSetIds)
        }
      } else {
        this.msg.error('New list is empty. Try creating a list with a different condition')
        this.setState({ isSaveEnabled: true })
      }
    } else {
      this.setState({
        errorMessages: [],
        isSaveEnabled: true
      })
    }
  }

  createSubList(content) {
    let listPayload = { 'content': content, 'conditions': this.state.conditions, 'listName': this.state.newListName, 'parentListId': this.state.listSelected._id, 'parentListName': this.state.listSelected.name, 'joiningCondition': this.state.joiningCondition }
    this.props.createSubList(listPayload, this.msg, this.handleCreateSubList)
  }

  editSubList(content) {
    let listPayload = { 'content': content, 'conditions': this.state.conditions, 'newListName': this.state.newListName, 'listName': this.props.currentList.listName, 'joiningCondition': this.state.joiningCondition }
    this.props.editList(listPayload, this.msg, this.handleEditList)
  }
  onUpdate() {
    let isValid = this.validateNewList()
    if (isValid) {
      this.setState({ errorMessages: [], isSaveEnabled: false })
      if (this.props.currentList.parentList && this.props.currentList.parentList !== '') {
        this.props.getParentList(this.props.currentList.parentList, this.handleGetParentList, this.msg)
      } else {
        this.setState({ parentListData: this.props.subscribers })
        let responses = this.props.pollSubscribers.concat(this.props.surveySubscribers)
        let subSetIds = getSubList(this.props.subscribers, this.state.conditions, this.props.pages, this.state.joiningCondition, this.props.customFields, this.props.customFieldSubscribers, responses)
        if (subSetIds.length > 0) {
          this.editSubList(subSetIds)
        } else {
          this.msg.error('New list is empty. Try creating a list with a different condition')
          this.setState({ isSaveEnabled: true })
        }
      }
    }
  }

  handleEditList(res) {
    this.setState({
      errorMessages: [],
      isSaveEnabled: true
    })
  }

  handleCreateSubList(res) {
    if (res.status === 'success') {
      this.resetPage()
      /* eslint-disable */
      $('#selectLists').val('').trigger('change')
      /* eslint-enable */
    } else {
      this.setState({
        errorMessages: [],
        isSaveEnabled: true
      })
    }
  }

  resetPage() {
    this.setState({
      selectedRadio: 'segmentAll',
      listSelected: '',
      conditions: [{ condition: '', criteria: '', text: '' }],
      newListName: '',
      errorMessages: [],
      isSaveEnabled: true
    })
  }
  validateNewList() {
    let errors = false
    let errorMessages = []
    let errorMessage
    if (!this.state.isEdit && this.state.selectedRadio === '') {
      errors = true
      errorMessage = { error: 'radio', message: 'Please select an option' }
      errorMessages.push(errorMessage)
      this.setState({ errorMessages: errorMessages })
    }
    if (!this.state.isEdit && this.state.selectedRadio === 'segmentList') {
      if (this.state.listSelected === '') {
        errors = true
        errorMessage = { error: 'selection', message: 'Please select an existing list' }
        errorMessages.push(errorMessage)
        this.setState({ errorMessages: errorMessages })
      }
    }
    if (this.state.newListName === '') {
      errors = true
      errorMessage = { error: 'listName', message: 'Please enter name for the new list' }
      errorMessages.push(errorMessage)
      this.setState({ errorMessages: errorMessages })
    }
    if (this.state.newListName && this.props.customerLists && this.props.customerLists.filter(e => e.listName.toLowerCase() === this.state.newListName.toLowerCase()).length > 0) {
      errors = true
      errorMessage = { error: 'listName', message: 'List with this name already exists' }
      errorMessages.push(errorMessage)
      this.setState({ errorMessages: errorMessages })
    }
    let conditionErrors = []
    let conditionError = {}
    let isErrorInCondition = false
    for (let i = 0; i < this.state.conditions.length; i++) {
      if (this.state.conditions[i].condition === '') {
        isErrorInCondition = true
        errors = true
        conditionError = { field: 'condition', index: i, message: 'Please choose a valid condition' }
        conditionErrors.push(conditionError)
      }
      if (this.state.conditions[i].criteria === '') {
        isErrorInCondition = true
        errors = true
        conditionError = { field: 'criteria', index: i, message: 'Please choose a valid criteria' }
        conditionErrors.push(conditionError)
      }
      if (this.state.conditions[i].text === '') {
        isErrorInCondition = true
        errors = true
        conditionError = { field: 'text', index: i, message: 'Please choose a valid value' }
        conditionErrors.push(conditionError)
      }
    }
    if (isErrorInCondition) {
      errorMessages.push({ error: 'conditions', message: conditionErrors })
      this.setState({ errorMessages: errorMessages })
    }
    return !errors
  }
  removeCondition(e, index) {
    let tempConditions = this.state.conditions
    for (let i = 0; i < tempConditions.length; i++) {
      if (i === index) {
        tempConditions.splice(i, 1)
      }
    }
    this.setState({
      conditions: tempConditions
    })
  }

  changeCondition(e, index) {
    let conditions = this.state.conditions
    for (let i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].condition = e.target.value
        conditions[i].text = ''
      }
    }
    this.setState({ conditions: conditions })
  }
  changeCriteria(e, index) {
    let conditions = this.state.conditions
    for (let i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].criteria = e.target.value
      }
    }
    this.setState({ conditions: conditions })
  }
  changeText(e, index) {
    let conditions = this.state.conditions
    for (let i = 0; i < this.state.conditions.length; i++) {
      if (index === i) {
        conditions[i].text = (e.target.value).trim()
      }
    }
    this.setState({ conditions: conditions })
  }
  addCondition() {
    this.setState({ errorMessages: [] })
    let conditions = this.state.conditions
    conditions.push({ condition: '', criteria: '', text: '' })
    this.setState({
      conditions: conditions
    })
  }
  handleRadioChange(e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'segmentList') {
      this.setState({ listSelected: '' })
    }
    if (e.currentTarget.value === 'segmentAll') {
      this.setState({ listSelected: '' })
      /* eslint-disable */
      $('#selectLists').val('').trigger('change')
      /* eslint-enable */
    }
  }

  handleNameText(e) {
    this.setState({
      newListName: e.target.value
    })
  }

  initializeListSelect(lists) {
    let self = this
    /* eslint-disable */
    $('#selectLists').select2({
      /* eslint-enable */
      data: lists,
      placeholder: 'Select Lists',
      allowClear: true,
      tags: true
    })
    /* eslint-disable */
    $('#selectLists').on('change', function (e) {
      /* eslint-enable */
      let selectedIndex = e.target.selectedIndex
      if (selectedIndex !== -1) {
        let selectedOptions = e.target.selectedOptions
        // var selected = []
        if (selectedOptions.length > 0) {
          self.setState({ listSelected: { '_id': selectedOptions[0].value, 'name': selectedOptions[0].label } })
        }
      } else {
        self.setState({ listSelected: '' })
      }
    })
    /* eslint-disable */
    $('#selectLists').val('').trigger('change')
    /* eslint-enable */
  }

  updateTextBox(i, condition) {
    console.log('textbox condition', condition)
    if (condition.condition === 'page') {
      return (
        <select className='form-control m-input' onChange={(e) => this.changeText(e, i)} value={condition.text}>
          <option disabled selected value=''>Select a Page</option>
          {
            this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
              <option key={page.pageId} value={page.pageName}>{page.pageName}</option>
            ))
          }
        </select>
      )
    } else if (condition.condition === 'gender') {
      return (
        <select className='form-control m-input' onChange={(e) => this.changeText(e, i)} value={condition.text} >
          <option disabled selected value=''>Select a Gender</option>
          {
            this.state.genders && this.state.genders.length > 0 && this.state.genders.map((gender, i) => (
              <option key={i} value={gender}>{gender}</option>
            ))
          }
        </select>
      )
    } else if (condition.condition === 'tag') {
      return (
        <select className='form-control m-input' onChange={(e) => this.changeText(e, i)} value={condition.text}>
          <option disabled selected value=''>Select a Tag</option>
          {
            this.props.tags && this.props.tags.length > 0 && this.props.tags.map((tag, i) => (
              <option key={i} value={tag.tag}>{tag.tag}</option>
            ))
          }
        </select>
      )
    } else if (condition.condition === 'locale') {
      return (
        <select className='form-control m-input' onChange={(e) => this.changeText(e, i)} value={condition.text}>
          <option disabled selected value=''>Select a Locale</option>
          {
            this.props.locales && this.props.locales.map((locale, i) => (
              <option key={i} value={locale}>{locale}</option>
            ))
          }
        </select>
      )
    } else {
      var temp = condition.condition.split("_")
      if (temp[0] === 'customfield' && temp[1] === 'text') {
        return (
          <input className='form-control m-input'
            onChange={(e) => this.changeText(e, i)}
            value={condition.text}
            id='text'
            placeholder='Value'
            type='text' />
        )
      }
      else if (temp[0] === 'customfield' && temp[1] === "number") {
        return (
          <input className='form-control m-input'
            onChange={(e) => this.changeText(e, i)}
            value={condition.text}
            id='number'
            placeholder='Value'
            type='number' />
        )
      } else if (temp[0] === 'customfield' && temp[1] === "date") {
        return (
          <input className='form-control m-input'
            onChange={(e) => this.changeText(e, i)}
            value={condition.text}
            id='date'
            placeholder='Value'
            type='date' />
        )
      } else if (temp[0] === 'customfield' && temp[1] === "datetime") {
        return (
          <input className='form-control m-input'
            onChange={(e) => this.changeText(e, i)}
            value={condition.text}
            id='datetime'
            placeholder='Value'
            type='datetime-local' />
        )
      } else if (temp[0] === 'customfield' && temp[1] === "true/false") {
        return (
          <select className='form-control m-input'
            onChange={(e) => this.changeText(e, i)}
            value={condition.text}>
            <option value=''>Select Criteria</option>
            <option value='true'>True</option>
            <option value='false'>False</option>
          </select>
        )
      } else {
        return (
          <input className='form-control m-input'
            onChange={(e) => this.changeText(e, i)}
            value={condition.text}
            id='text'
            placeholder='Value'
            type={condition.condition === 'subscriptionDate' || condition.condition === 'reply' ? 'date' : 'text'} />
        )
      }
    }
  }

  render() {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12 col-md-12 col-sm-12'>
              <div className='m-portlet m-portlet-mobile '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      {!this.state.isEdit
                        ? <h3 className='m-portlet__head-text'>
                          Create SubList of Subscribers
                        </h3>
                        : <h3 className='m-portlet__head-text'>
                          Edit SubList of Subscribers
                        </h3>
                      }
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    {!this.state.isEdit &&
                      <div>
                        <div className='radio-buttons' style={{ marginLeft: '37px' }}>
                          <div className='radio'>
                            <input id='segmentAll'
                              type='radio'
                              value='segmentAll'
                              name='segmentationType'
                              onChange={this.handleRadioChange}
                              checked={this.state.selectedRadio === 'segmentAll'} />
                            <label>Segment all subscribers</label>
                          </div>
                          {this.state.lists.length === 0
                            ? <div className='radio'>
                              <input id='segmentList'
                                type='radio'
                                value='segmentList'
                                name='segmentationType'
                                disabled />
                              <label>Segment an existing List</label>
                            </div>
                            : <div className='radio'>
                              <input id='segmentList'
                                type='radio'
                                value='segmentList'
                                name='segmentationType'
                                onChange={this.handleRadioChange}
                                checked={this.state.selectedRadio === 'segmentList'} />
                              <label>Segment an existing List</label>
                            </div>
                          }
                        </div>
                        <span className='m-form__help'>
                          {
                            this.state.errorMessages.map((m, i) => (
                              m.error === 'radio' &&
                              <span style={{ color: 'red', marginLeft: '20px' }}>{m.message}</span>
                            ))
                          }
                        </span>
                      </div>
                    }
                    {!this.state.isEdit &&
                      <div className='form-group m-form__group col-12'>
                        <label className='col-lg-2 col-form-label'>
                          Choose Lists
                      </label>
                        {this.state.selectedRadio === 'segmentList'
                          ? <div className='col-lg-6'>
                            <select id='selectLists' />
                          </div>
                          : <div className='col-lg-6'>
                            <select id='selectLists' disabled />
                          </div>
                        }
                        <span className='m-form__help'>
                          {
                            this.state.errorMessages.map((m, i) => (
                              m.error === 'selection' &&
                              <span style={{ color: 'red', paddingLeft: '14px' }}>{m.message}</span>
                            ))
                          }
                        </span>
                      </div>
                    }
                    {(this.state.isEdit && this.state.parentListName !== '') &&
                      <div className='form-group m-form__group col-12'>
                        <label className='col-lg-2 col-form-label'>
                          Parent List Name
                        </label>
                        <div className='col-lg-6'>
                          <input id='listName'
                            type='text'
                            value={this.state.parentListName}
                            disabled
                          />
                        </div>
                      </div>
                    }
                    <div className='form-group m-form__group col-12'>
                      <label className='col-lg-2 col-form-label'>
                        List Name
                      </label>
                      <div className='col-lg-6'>
                        <input id='listName'
                          type='text'
                          value={this.state.newListName}
                          onChange={this.handleNameText}
                        />
                      </div>
                      <span className='m-form__help'>
                        {
                          this.state.errorMessages.map((m, i) => (
                            m.error === 'listName' &&
                            <span style={{ color: 'red', paddingLeft: '14px' }}>{m.message}</span>
                          ))
                        }
                      </span>
                    </div>
                    <div className='form-group m-form__group col-12' style={{ marginBottom: '20px', color: '#337ab7', display: 'flex' }}>
                      <div style={{ marginTop: '10px' }}>Create a list of subscribers that match<span id='switchCondition' style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{this.state.joiningCondition === 'OR' ? ' any of the following conditions' : ' all of the following conditions'}:</span></div>
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
                                    <select className='form-control m-input' onChange={(e) => this.changeCondition(e, i)}
                                      value={condition.condition} >
                                      <option value=''>Select Condition</option>
                                      <option value='firstName'>First Name</option>
                                      <option value='lastName'>Last Name</option>
                                      <option value='page'>Page</option>
                                      <option value='phoneNumber'>Phone Number</option>
                                      <option value='gender'>Gender</option>
                                      <option value='locale'>Locale</option>
                                      <option value='tag'>Tag</option>
                                      <option value='subscriptionDate'>Subscribed</option>
                                      <option value='reply'>Replied</option>
                                      <optgroup label="Custom Fields" data-max-options="10">
                                        {
                                          this.props.customFields && this.props.customFields.length > 0 && this.props.customFields.map((field) => (
                                            <option value={`customfield_${field.type}_${field._id}`}>{field.name}</option>
                                          ))
                                        }
                                      </optgroup>
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
                                    {this.state.conditions[i].condition.split("_")[0] === 'customfield'
                                      ? <span>
                                        {this.state.conditions[i].condition.split("_")[1] === 'date' || this.state.conditions[i].condition.split("_")[1] === 'datetime' || this.state.conditions[i].condition.split("_")[1] === 'number'
                                        ? <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                        value={condition.criteria}>
                                        <option value=''>Select Criteria</option>
                                        <option value='is'>is</option>
                                        <option value='greater'>Greater Than</option>
                                        <option value='less'>Less Than</option>
                                      </select>
                                      : <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                      value={condition.criteria}>
                                      <option value=''>Select Criteria</option>
                                      <option value='is'>is</option>
                                    </select>
                                        }
                                      </span>
                                      : <span>
                                        {this.state.conditions[i].condition === 'subscriptionDate' || this.state.conditions[i].condition === 'reply'
                                          ? <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                            value={condition.criteria}>
                                            <option value=''>Select Criteria</option>
                                            <option value='on'>on</option>
                                            <option value='before'>Before</option>
                                            <option value='after'>After</option>
                                          </select>
                                          : <div>
                                            {
                                              this.state.conditions[i].condition === 'firstName' || this.state.conditions[i].condition === 'lastName'
                                                ? <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                                  value={condition.criteria}>
                                                  <option value=''>Select Criteria</option>
                                                  <option value='is'>is</option>
                                                  <option value='contains'>contains</option>
                                                  <option value='begins'>begins with</option>
                                                </select>
                                                : <select className='form-control m-input' onChange={(e) => this.changeCriteria(e, i)}
                                                  value={condition.criteria}>
                                                  <option value=''>Select Criteria</option>
                                                  <option value='is'>is</option>
                                                </select>
                                            }
                                          </div>
                                        }
                                      </span>
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
                                  {/* <td data-field='title'
                                   className='m-datatable__cell' style={{width: '25%'}}>
                                   <input className='form-control m-input'
                                     onChange={(e) => this.changeText(e, i)}
                                     value={condition.text}
                                     id='text'
                                     placeholder='Text'
                                     type={this.state.conditions[i].condition === 'subscriptionDate' || this.state.conditions[i].condition === 'reply' ? 'date' : 'text'} />
                                   <span className='m-form__help'>
                                     {
                                       this.state.errorMessages.map((m) => (
                                         m.error === 'conditions' && m.message.map((msg) => {
                                           return (msg.field === 'text' && msg.index === i &&
                                           <span style={{color: 'red'}}>{msg.message}</span>
                                           )
                                         })
                                       ))
                                     }
                                   </span>
                                 </td> */}
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
                  </div>
                </div>
                <div className='m-portlet__body' />
                <div className='m-portlet__foot m-portlet__foot--fit'>
                  <div className='m-form__actions m-form__actions' style={{ padding: '30px' }}>
                    {this.state.isSaveEnabled
                      ? <div>
                        <Link style={{ marginRight: '10px' }} to='/segmentedLists' className='btn btn-primary'>
                          Back
                        </Link>
                        {!this.state.isEdit
                          ? <button className='btn btn-primary' onClick={this.onSave}>
                            Save
                          </button>
                          : <button className='btn btn-primary' onClick={this.onUpdate}>
                            Update
                        </button>
                        }
                      </div>
                      : <div>
                        <Link style={{ marginRight: '10px' }} disabled className='btn btn-primary'>
                          Back
                        </Link>
                        <button className='btn btn-primary' disabled>
                          Save
                        </button>
                      </div>
                    }
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
  console.log('createSubList state', state)
  return {
    pages: (state.pagesInfo.pages),
    customerLists: (state.listsInfo.customerLists),
    currentList: (state.listsInfo.currentList),
    subscribers: (state.subscribersInfo.subscribers),
    pollSubscribers: (state.listsInfo.pollSubscribers),
    surveySubscribers: (state.listsInfo.surveySubscribers),
    tags: (state.tagsInfo.tags),
    locales: (state.subscribersInfo.locales),
    customFields: (state.customFieldInfo.customFields),
    customFieldSubscribers: (state.customFieldInfo.customFieldSubscriber),

  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadCustomerLists: loadCustomerLists,
    createSubList: createSubList,
    editList: editList,
    loadListDetails: loadListDetails,
    getParentList: getParentList,
    loadSubscribersList: loadSubscribersList,
    getRepliedPollSubscribers: getRepliedPollSubscribers,
    getRepliedSurveySubscribers: getRepliedSurveySubscribers,
    loadTags: loadTags,
    allLocales: allLocales,
    loadCustomFields: loadCustomFields,
    getCustomFieldSubscribers: getCustomFieldSubscribers
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSubList)
