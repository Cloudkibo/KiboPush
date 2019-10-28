import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editautoposting, clearAlertMessages } from '../../redux/actions/autoposting.actions'
import { Alert } from 'react-bs-notifier'
import {loadTags} from '../../redux/actions/tags.actions'
import AlertContainer from 'react-alert'
import { getuserdetails, getFbAppId, fetchAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
// import { ModalBackground } from 'react-modal-dialog';
import MessengerSendToMessenger from 'react-messenger-send-to-messenger';
import SubscriptionPermissionALert from '../../components/alertMessages/subscriptionPermissionAlert'
var MessengerPlugin = require('react-messenger-plugin').default

class ItemSettings extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      page: {
        options: []
      },
      Gender: {
        options: [{id: 'male', text: 'Male', value: 'male'},
                  {id: 'female', text: 'Female', value: 'female'},
                  {id: 'other', text: 'Other', value: 'other'}
        ]
      },
      Locale: {
        options: [{id: 'en_US', text: 'en_US', value: 'en_US'},
                  {id: 'af_ZA', text: 'af_ZA', value: 'af_ZA'},
                  {id: 'ar_AR', text: 'ar_AR', value: 'ar_AR'},
                  {id: 'az_AZ', text: 'az_AZ', value: 'az_AZ'},
                  {id: 'pa_IN', text: 'pa_IN', value: 'pa_IN'}
        ]
      },
      Tag: {
        options: []
      },
      stayOpen: false,
      disabled: false,
      pageValue: this.props.location.state.item.segmentationPageIds,
      genderValue: this.props.location.state.item.segmentationGender,
      localeValue: this.props.location.state.item.segmentationLocale,
      tagValue: [],
      isActive: this.props.location.state.item.isActive ? 'Active' : 'Disabled',
      alertMessage: '',
      alertType: '',
      actionType: this.props.location.state.item.actionType,
      filterTweets: this.props.location.state.item.filterTweets == true ? 'yes' : 'no',
      moderateTweets: this.props.location.state.item.moderateTweets ? 'yes' : 'no',
      tags: this.props.location.state.item.filterTags.length > 0 ? this.props.location.state.item.filterTags : [],
      filterTagsValue: this.props.location.state.item.filterTags.length > 0 ? this.props.location.state.item.filterTags.join(';') : '',
      selectedPage: (this.props.location.state.item.approvalChannel && this.props.location.state.item.approvalChannel.pageId) ? this.props.location.state.item.approvalChannel.pageId : '',
      selectedPageFbId: '',
      selectedPageAccessToken: (this.props.location.state.item.approvalChannel && this.props.location.state.item.approvalChannel.pageAccessToken) ? this.props.location.state.item.approvalChannel.pageAccessToken : '',
      showMessengerModal: false,
      fbAppId:this.props.fbAppId,
      showSubscribeButton: false,
      rssTime: this.props.location.state.item.subscriptionType === 'rss' ? this.props.location.state.item.scheduledInterval : '24 hours',
      defaultPages: []
    }
    props.getFbAppId()
    props.getuserdetails()
    props.clearAlertMessages()
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleLocaleChange = this.handleLocaleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.editAutoposting = this.editAutoposting.bind(this)
    this.handleActionType = this.handleActionType.bind(this)
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.initializeGenderSelect = this.initializeGenderSelect.bind(this)
    this.initializeLocaleSelect = this.initializeLocaleSelect.bind(this)
    this.initializeTagSelect = this.initializeTagSelect.bind(this)
    this.handleTweetsFilter = this.handleTweetsFilter.bind(this)
    this.handleTweetsModerate = this.handleTweetsModerate.bind(this)
    this.handleTagsInput = this.handleTagsInput.bind(this)
    this.handlePageSelect = this.handlePageSelect.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.checkAdminSubscriber = this.checkAdminSubscriber.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.saveCallback = this.saveCallback.bind(this)
    this.handleRSSTime = this.handleRSSTime.bind(this)
  }

  handleRSSTime (event) {
    this.setState({ rssTime: event.target.value })
  }

  handleActionType (e) {
    this.setState({actionType: e.target.value})
  }

  handleTweetsFilter (e) {
    this.setState({filterTweets: e.target.value})
  }

  handleTweetsModerate (e) {
    this.setState({moderateTweets: e.target.value})
  }

  handleTagsInput (e) {
    let tagsInput = e.target.value

    let tags = []
    tags = tagsInput.split(';')
    if(tags.length >= 6) {
      return this.msg.error('Tags cannot be more than 5')
    }else{
      this.setState({tags: tags})
      this.setState({filterTagsValue: e.target.value})
    }
  }

  handlePageSelect (e) {
  if(e.target.selectedIndex !== 0){
  let pageIds = this.props.pages.map((p) => p._id)
  let index = pageIds.indexOf(e.target.value)
  this.setState({selectedPage: e.target.value, selectedPageFbId: this.props.pages[index].pageId, selectedPageAccessToken: this.props.pages[index].accessToken })
  this.props.fetchAdminSubscriptions({pageId: e.target.value}, this.checkAdminSubscriber)

    }
  }

  closeModal (e) {
    console.log('close modal called')
    this.setState({showMessengerModal: false})
  }

  checkAdminSubscriber (payload) {
    if(payload.length <= 0) {
    this.setState({showSubscribeButton : true})
    }else{
      this.setState({showSubscribeButton : false})
    }
  }

  componentDidMount () {
    console.log(this.props.location)
    this.props.loadTags()
    let options = []
    let selectedPageIds = []
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.location.state.item.segmentationPageIds.length > 0) {
        if (this.props.location.state.item.segmentationPageIds.indexOf(this.props.pages[i].pageId) !== -1) {
          options.push({text: this.props.pages[i].pageName, id: this.props.pages[i].pageId, selected: true})
          selectedPageIds.push(this.props.pages[i].pageId)
        } else {
          if (this.props.pages[i].gotPageSubscriptionPermission) {
            options.push({text: this.props.pages[i].pageName, id: this.props.pages[i].pageId})
            selectedPageIds.push(this.props.pages[i].pageId)
          }
        }
      } else {
        if (this.props.pages[i].gotPageSubscriptionPermission) {
          options.push({text: this.props.pages[i].pageName, id: this.props.pages[i].pageId})
          selectedPageIds.push(this.props.pages[i].pageId)
        }
      }
    }
    this.setState({page: {options: options}})
    this.setState({defaultPages: selectedPageIds})

    let optionsGender = []
    for (let i = 0; i < this.state.Gender.options.length; i++) {
      if (this.props.location.state.item.segmentationGender !== '') {
        if (this.props.location.state.item.segmentationGender.indexOf(this.state.Gender.options[i].value) !== -1) {
          optionsGender[i] = {text: this.state.Gender.options[i].value, id: this.state.Gender.options[i].value, selected: true}
        } else {
          optionsGender[i] = {text: this.state.Gender.options[i].value, id: this.state.Gender.options[i].value}
        }
      } else {
        optionsGender[i] = {text: this.state.Gender.options[i].value, id: this.state.Gender.options[i].value}
      }
    }
    this.setState({Gender: {options: optionsGender}})

    let optionsLocale = []
    for (let i = 0; i < this.state.Locale.options.length; i++) {
      if (this.props.location.state.item.segmentationLocale !== '') {
        if (this.props.location.state.item.segmentationLocale.indexOf(this.state.Locale.options[i].value) !== -1) {
          optionsLocale[i] = {text: this.state.Locale.options[i].value, id: this.state.Locale.options[i].value, selected: true}
        } else {
          optionsLocale[i] = {text: this.state.Locale.options[i].value, id: this.state.Locale.options[i].value}
        }
      } else {
        optionsLocale[i] = {text: this.state.Locale.options[i].value, id: this.state.Locale.options[i].value}
      }
    }
    this.setState({Locale: {options: optionsLocale}})

    this.initializePageSelect(options)
    this.initializeGenderSelect(optionsGender)
    this.initializeLocaleSelect(optionsLocale)
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Item Settings`
  }

  initializePageSelect (pageOptions) {
    var self = this
    /* eslint-disable */
    $('#selectPage').select2({
    /* eslint-enable */
      data: pageOptions,
      placeholder: 'Select Pages (Default: All)',
      allowClear: true,
      multiple: true,
      tags: true
    })
    /* eslint-disable */
    $('#selectPage').on('change', function (e) {
    /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ pageValue: selected })
      }
    })
  }

  initializeGenderSelect (conditionOptions) {
    var self = this
    /* eslint-disable */
    $('#genderSelect').select2({
    /* eslint-enable */
      data: conditionOptions,
      placeholder: 'Select Gender',
      allowClear: true,
      multiple: true,
      tags: true
    })
    /* eslint-disable */
    $('#genderSelect').on('change', function (e) {
    /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ genderValue: selected })
      }
    })
  }

  initializeLocaleSelect (conditionOptions) {
    var self = this
    /* eslint-disable */
    $('#localeSelect').select2({
    /* eslint-enable */
      data: conditionOptions,
      placeholder: 'Select Locale',
      allowClear: true,
      multiple: true,
      tags: true
    })
    /* eslint-disable */
    $('#localeSelect').on('change', function (e) {
    /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ localeValue: selected })
      }
    })
  }

  initializeTagSelect (tagOptions) {
    var self = this
      /* eslint-disable */
    $('#tagSelect').select2({
      /* eslint-enable */
      data: tagOptions,
      placeholder: 'Select Tags',
      allowClear: true,
      multiple: true
    })
      /* eslint-disable */
    $('#tagSelect').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ tagValue: selected })
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.successMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        alertType: 'success'
      })
    } else if (nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.errorMessage,
        alertType: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
    }
    if (nextProps.tags) {
      console.log('this.props.location.state.item.segmentationTags', this.props.location.state.item.segmentationTags)
      let optionsTag = []
      for (let i = 0; i < nextProps.tags.length; i++) {
        if (this.props.location.state.item.segmentationTags !== '') {
          if (this.props.location.state.item.segmentationTags.indexOf(nextProps.tags[i]._id) !== -1) {
            optionsTag.push({text: nextProps.tags[i].tag, id: nextProps.tags[i].tag, selected: true})
          } else {
            optionsTag.push({text: nextProps.tags[i].tag, id: nextProps.tags[i].tag})
          }
        } else {
          optionsTag[i] = {text: nextProps.tags[i].tag, id: nextProps.tags[i].tag}
        }
      }
      this.setState({Tag: {options: optionsTag}})
      console.log('optionsTag', optionsTag)
      this.initializeTagSelect(optionsTag)
    }
  }

  handlePageChange (value) {
    var temp = value.split(',')
    this.setState({ pageValue: temp })
  }

  handleGenderChange (value) {
    var temp = value.split(',')
    this.setState({ genderValue: temp })
  }

  handleLocaleChange (value) {
    var temp = value.split(',')
    this.setState({ localeValue: temp })
  }

  handleSelectChange (event) {
    this.setState({ isActive: event.target.value })
  }

  handleSave () {
    if(this.state.moderateTweets === 'yes'){
    this.props.fetchAdminSubscriptions({pageId : this.state.selectedPage}, this.saveCallback)
    }else{
      this.editAutoposting()
    }
  }

  saveCallback(payload) {
    if(payload.length > 0) {
      this.editAutoposting()
    }else{
      return this.msg.error('You are not a subscriber of this Page. Please click on Subscriber button ')
    }
  }

  editAutoposting () {
    if(this.state.filterTweets === 'yes' && this.state.filterTagsValue === ''){
      return this.msg.error('Please enter atleast one tag')
    }
    if (this.accountTitleValue.value === '') {
      return this.msg.error('Please add Account Title')
    }
    var isSegmented = true //pages will be segmented
    var isActive = false
    /* if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 || this.state.localeValue.length > 0 || this.state.tagValue.length > 0) {
      isSegmented = true
    }*/
    if (this.state.isActive === 'Active') {
      isActive = true
    } else {
      isActive = false
    }
    let tagIDs = []
    for (let i = 0; i < this.props.tags.length; i++) {
      for (let j = 0; j < this.state.tagValue.length; j++) {
        if (this.props.tags[i].tag === this.state.tagValue[j]) {
          tagIDs.push(this.props.tags[i]._id)
        }
      }
    }
    const autopostingData = {
      _id: this.props.location.state.item._id,
      accountTitle: this.accountTitleValue.value ? this.accountTitleValue.value : this.props.location.state.title,
      isSegmented: isSegmented,
      segmentationPageIds: this.state.pageValue.length > 0 ? this.state.pageValue: this.state.defaultPages  ,
      segmentationGender: this.state.genderValue,
      segmentationLocale: this.state.localeValue,
      segmentationTags: tagIDs,
      isActive: isActive,
      subscriptionType: this.props.location.state.item.subscriptionType,
      scheduledInterval: this.state.rssTime,
      actionType: this.state.actionType,
      filterTweets: this.state.filterTweets === 'yes' ? true : false,
      filterTags: this.state.tags,
      moderateTweets: this.state.moderateTweets === 'yes' ? true : false,
      approvalChannel: { type: 'messenger', pageId:  this.state.selectedPage, pageAccessToken: this.state.selectedPageAccessToken }
    }
    console.log(autopostingData)
    this.props.editautoposting(autopostingData)
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <SubscriptionPermissionALert />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {/*
          this.state.showMessengerModal &&
          <ModalContainer style={{width: '500px'}} onClose={this.closeModal}>
            <ModalDialog style={{width: '500px'}} onClose={this.closeModal}>
              <h3>Connect to Messenger:</h3>
              <MessengerPlugin
                appId={this.props.fbAppId}
                pageId={this.state.selectedPageFbId}
                size='large'
                passthroughParams={`${this.props.user._id}__kibopush_test_broadcast_`}
                />
            </ModalDialog>
          </ModalContainer>
        */}
        <div className='m-subheader'>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Feed Settings</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    <i style={{color: this.props.location.state.iconColor}} className={this.props.location.state.icon} aria-hidden='true' /> {this.props.location.state.title}
                  </h3>
                </div>
              </div>
            </div>
            <form className='m-form m-form--label-align-right'>
              <div className='m-portlet__body'>
                <div className='m-form__section m-form__section--first'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Info
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Account Title
                    </label>
                    <div className='col-lg-6'>
                      <input className='form-control m-input'
                        ref={(c) => { this.accountTitleValue = c }}
                        defaultValue={this.props.location.state.title} />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Status
                    </label>
                    <div className='col-lg-6' id='rules'>
                      <select className='form-control m-input' onChange={this.handleSelectChange} value={this.state.isActive}>
                        <option value='Active'>Active</option>
                        <option value='Disabled'>Disabled</option>
                      </select>
                    </div>
                  </div>
                  {
                    this.props.location.state.item.subscriptionType === 'rss' &&
                    <div className='form-group m-form__group row'>
                      <label className='col-lg-2 col-form-label'>
                        Time
                      </label>
                      <div className='col-lg-6' id='rules'>
                        <select className='form-control m-input' onChange={this.handleRSSTime} value={this.state.rssTime}>
                          <option value='8 hours'>Send updates after 8 hours</option>
                          <option value='12 hours'>Send updates after 12 hours</option>
                          <option value='24 hours'>Send updates after 24 hours</option>
                        </select>
                      </div>
                    </div>
                  }
                </div>
                <div style={{marginBottom: '40px'}} className='m-form__section m-form__section--last'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Select Pages
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Pages
                    </label>
                    <div className='col-lg-6'>
                      <select id='selectPage' />
                    </div>
                  </div>
                </div>
                {
                  this.props.location.state.item.subscriptionType === 'twitter' &&
                  <div>
                    <div className='m-form__seperator m-form__seperator--dashed' />
                    <div style={{marginBottom: '40px'}} className='m-form__section m-form__section--last'>
                      <div className='m-form__heading'>
                        <h3 className='m-form__heading-title'>
                          Action
                        </h3>
                      </div>
                      <div style={{paddingLeft: '100px'}} className='form-group m-form__group row'>
                        <div className='m-radio-list'>
                          <label className='m-radio'>
                            <input type='radio' value='messenger' onChange={this.handleActionType} checked={this.state.actionType === 'messenger'} />
                              Send tweets to messenger subscribers
                            <span />
                          </label>
                          <label className='m-radio'>
                            <input type='radio' value='facebook' onChange={this.handleActionType} checked={this.state.actionType === 'facebook'} />
                              Post tweets to Facebook page(s)
                            <span />
                          </label>
                          <label className='m-radio'>
                            <input type='radio' value='both' onChange={this.handleActionType} checked={this.state.actionType === 'both'} />
                              Do both
                            <span />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {
                  this.props.location.state.item.subscriptionType === 'rss' &&
                  <div>
                    <div className='m-form__seperator m-form__seperator--dashed' />
                    <div style={{marginBottom: '40px'}} className='m-form__section m-form__section--last'>
                      <div className='m-form__heading'>
                        <h3 className='m-form__heading-title'>
                          Action
                        </h3>
                      </div>
                      <div style={{paddingLeft: '100px'}} className='form-group m-form__group row'>
                        <div className='m-radio-list'>
                          <label className='m-radio'>
                            <input type='radio' value='messenger' onChange={this.handleActionTypeFor} checked={this.state.actionType === 'messenger'} />
                              Send RSS Feed updates to messenger subscribers
                            <span />
                          </label>
                          <label className='m-radio'>
                            <input type='radio' value='facebook' onChange={this.handleActionType} checked={this.state.actionType === 'facebook'} />
                              Post RSS Feed updates on Facebook page(s)
                            <span />
                          </label>
                          <label className='m-radio'>
                            <input type='radio' value='both' onChange={this.handleActionType} checked={this.state.actionType === 'both'} />
                              Do both
                            <span />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                <div className='m-form__seperator m-form__seperator--dashed' />
                <div className='m-form__section m-form__section--last'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Set Segmentation
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Gender
                    </label>
                    <div className='col-lg-6'>
                      <select id='genderSelect' />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Locale
                    </label>
                    <div className='col-lg-6'>
                      <select id='localeSelect' />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Tags
                    </label>
                    <div className='col-lg-6'>
                      <select id='tagSelect' />
                    </div>
                  </div>

                </div>
                {this.props.location.state.item.subscriptionType === 'twitter' &&
                <div>
                <div className='m-form__seperator m-form__seperator--dashed' />
                <div style={{marginBottom: '40px'}} className='m-form__section m-form__section--last'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Filter Tweets
                    </h3>
                  </div>
                  <div style={{paddingLeft: '100px'}} className='form-group m-form__group row'>
                    <div className='m-radio-list'>
                      <label className='m-radio'>
                        <input type='radio' value='no' onChange={this.handleTweetsFilter} checked={this.state.filterTweets === 'no'} />
                          {'Don\'t Filter'}
                        <span />
                      </label>
                      <label className='m-radio'>
                        <input type='radio' value='yes' onChange={this.handleTweetsFilter} checked={this.state.filterTweets === 'yes'} />
                          Filter
                        <span />
                      </label>
                      {this.state.filterTweets === 'yes' &&
                      <div>
                      <label>Enter upto 5 tags seperated by semi-colon (;)</label>
                      <input className='form-control m-input'  value={this.state.filterTagsValue}
                      onChange= {this.handleTagsInput}
                      />
                      </div>}
                    </div>
                  </div>
                </div>
              </div>}
              {this.props.location.state.item.subscriptionType === 'twitter' &&
                <div>
                <div className='m-form__seperator m-form__seperator--dashed' />
                <div style={{marginBottom: '40px'}} className='m-form__section m-form__section--last'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Moderate Tweets
                    </h3>
                  </div>
                  <div style={{paddingLeft: '100px'}} className='form-group m-form__group row'>
                    <div className='m-radio-list'>
                      <label className='m-radio'>
                        <input type='radio' value='no' onChange={this.handleTweetsModerate} checked={this.state.moderateTweets === 'no'} />
                          Send tweets without any approval
                        <span />
                      </label>
                      <label className='m-radio'>
                        <input type='radio' value='yes' onChange={this.handleTweetsModerate} checked={this.state.moderateTweets === 'yes'} />
                          Ask for approval before sending any tweets
                        <span />
                      </label>
                      {this.state.moderateTweets === 'yes' &&
                      <div>
                      <label>Select the page from which to ask for approval</label>
                      <select className='form-control m-input' onChange={this.handlePageSelect} value={this.state.selectedPage}>
                      <option>--Select--</option>
                      {this.props.pages.map((item, i) => {
                        return <option value={item._id}>{item.pageName}</option>
                      })}
                      </select>
                      <br/>
                      {this.state.showSubscribeButton &&
                      <div>
                      <label>You are not subscribed to selected page. In order to receive approval messages you need to become a subscriber. </label>
                      <br/>
                      <center>
                      <button className='btn btn-success btn-sm' type='button' onClick={() => this.setState({showMessengerModal:true})} >
                      Subscribe
                      </button>
                      </center>
                      </div>}
                      </div>}
                    </div>
                  </div>
                </div>
              </div>}
              </div>
              <div className='m-portlet__foot m-portlet__foot--fit'>
                <div className='m-form__actions m-form__actions'>
                  <div className='row'>
                    <div className='col-lg-2' />
                    <div className='col-lg-6'>
                      <button className='btn btn-primary' type='button' onClick={this.handleSave} >
                        Save Changes
                      </button>
                      <span>&nbsp;&nbsp;</span>
                      <Link to='/autoposting'>
                        <button className='btn btn-secondary'>
                          Back
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className='row'>
                    <span>&nbsp;&nbsp;</span>
                  </div>
                  <div className='row'>
                    <div className='col-lg-2' />
                    <div className='col-lg-6'>
                      {
                        this.state.alertMessage !== '' &&
                        <center>
                          <Alert type={this.state.alertType}>
                            {this.state.alertMessage}
                          </Alert>
                        </center>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state from items mapsto', state)
  return {
    autopostingData: (state.autopostingInfo.autopostingData),
    pages: (state.pagesInfo.pages),
    successMessage: (state.autopostingInfo.successMessageEdit),
    errorMessage: (state.autopostingInfo.errorMessageEdit),
    user: (state.basicInfo.user),
    tags: (state.tagsInfo.tags),
    fbAppId: (state.basicInfo.fbAppId),
    adminPageSubscription: (state.basicInfo.adminPageSubscription),

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      editautoposting: editautoposting,
      clearAlertMessages: clearAlertMessages,
      loadTags: loadTags,
      getuserdetails: getuserdetails,
      getFbAppId: getFbAppId,
      fetchAdminSubscriptions: fetchAdminSubscriptions
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemSettings)
