import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadCustomerLists } from '../../redux/actions/customerLists.actions'
import {getSubscriberReachEstimation} from '../../redux/actions/pages.actions'
import { loadTags } from '../../redux/actions/tags.actions'
import { getAllPollResults } from '../../redux/actions/poll.actions'

class Targeting extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      Gender: {
        options: [{id: 'male', text: 'male'},
          {id: 'female', text: 'female'},
          {id: 'other', text: 'other'}
        ]
      },
      Locale: {
        options: [{id: 'en_US', text: 'en_US'},
          {id: 'af_ZA', text: 'af_ZA'},
          {id: 'ar_AR', text: 'ar_AR'},
          {id: 'az_AZ', text: 'az_AZ'},
          {id: 'pa_IN', text: 'pa_IN'}
        ]
      },
      page: {
        options: []
      },
      survey: {
        options: []
      },
      pageValue: [],
      genderValue: [],
      localeValue: [],
      tagValue: [],
      selectedRadio: '',
      messageTypeSelectedRadio: 'non promotional',
      listSelected: [],
      isList: false,
      lists: [],
      showDropDownSurvey: false,
      showDropDownPoll: false,
      pollValue: [],
      surveyValue: [],
      isShowingModalPro: false,
      showSubscriptionMsg: false,
      isShowingLearnMore: false
    }
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.initializeGenderSelect = this.initializeGenderSelect.bind(this)
    this.initializeLocaleSelect = this.initializeLocaleSelect.bind(this)
    this.initializeTagSelect = this.initializeTagSelect.bind(this)
    this.initializeListSelect = this.initializeListSelect.bind(this)
    this.initializePollSelect = this.initializePollSelect.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.messageTypeRadioButton = this.messageTypeRadioButton.bind(this)
    this.resetTargeting = this.resetTargeting.bind(this)
    this.showDropDownSurvey = this.showDropDownSurvey.bind(this)
    this.showDropDownPoll = this.showDropDownPoll.bind(this)
    this.showProDialog = this.showProDialog.bind(this)
    this.closeProDialog = this.closeProDialog.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.showSubscriptionMsg = this.showSubscriptionMsg.bind(this)
    this.isShowingLearnMore = this.isShowingLearnMore.bind(this)
    // this.subscriberReachEstimation = this.subscriberReachEstimation.bind(this)
    // this.initializeSubscribers = this.initializeSubscribers.bind(this)
    props.loadTags()
    props.loadCustomerLists()
  }

  // subscriberReachEstimation () {
  //   this.props.getSubscriberReachEstimation(this.props.page, this.state.subscribers)
  // }

  isShowingLearnMore () {
    this.setState({isShowingLearnMore: !this.state.isShowingLearnMore})
  }

  showProDialog () {
    this.setState({isShowingModalPro: true})
  }

  closeProDialog () {
    this.setState({isShowingModalPro: false})
  }
  goToSettings () {
    this.props.history.push({
      pathname: `/settings`,
      state: {module: 'pro'}
    })
  }
  componentDidMount () {
    let options = []
  //  this.props.onRef(this)

    if (this.props.pages) {
      console.log('this.props.pages[0].gotPageSubscriptionPermission', this.props.pages[0])
      for (var i = 0; i < this.props.pages.length; i++) {
        options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
      }
      if (!this.props.pages[0].gotPageSubscriptionPermission) {
        this.setState({showSubscriptionMsg: true})
      }
    }
    let pollOptions = []
    if (this.props.polls) {
      for (var j = 0; j < this.props.polls.length; j++) {
        pollOptions[j] = {id: this.props.polls[j]._id, text: this.props.polls[j].statement}
      }
    }
    let surveyOptions = []
    if (this.props.surveys) {
      for (var k = 0; k < this.props.surveys.length; k++) {
        surveyOptions[k] = {id: this.props.surveys[k]._id, text: this.props.surveys[k].title}
      }
    }
    console.log('options', options)
    this.setState({pageValue: [options[0].id]})
    console.log('surveyOptions', surveyOptions)
    this.props.getAllPollResults()
    this.setState({page: {options: options}})
    this.initializeGenderSelect(this.state.Gender.options)
    this.initializeLocaleSelect(this.state.Locale.options)
    this.initializePageSelect(options)
    this.initializePollSelect(pollOptions)
    this.initializeSurveySelect(surveyOptions)
    // this.initializeSubscribers(this.props)
    /* eslint-disable */
    $('.selectSegmentation').addClass('hideSegmentation')
    $('.selectList').addClass('hideSegmentation')
    if (this.props.component !== 'poll') {
      $('.pollFilter').addClass('hideSegmentation')
    }
    if (this.props.component !== 'survey') {
      $('.surveyFilter').addClass('hideSegmentation')
    }
    /* eslint-enable */
    console.log('pageValue', this.state.pageValue)
  }

  showSubscriptionMsg (pageSelected) {
    for (let i = 0; i < this.props.pages.length; i++) {
      console.log('pageSelected', pageSelected)
      console.log('pages', this.props.pages[i])
      for (let j = 0; j < pageSelected.length; j++) {
        if (pageSelected[j] === this.props.pages[i].pageId && !this.props.pages[i].gotPageSubscriptionPermission) {
          console.log('inside if')
          this.setState({showSubscriptionMsg: true})
          return
        }
      }
    }
    this.setState({showSubscriptionMsg: false})
  }
  showDropDownSurvey () {
    this.setState({
      showDropDownSurvey: true
    })
  }
  showDropDownPoll () {
    this.setState({
      showDropDownPoll: true
    })
  }
  resetTargeting () {
    this.setState({
      pageValue: [],
      genderValue: [],
      localeValue: [],
      selectedRadio: '',
      listSelected: '',
      isList: false,
      lists: [],
      tagValue: [],
      pollValue: [],
      surveyValue: [],
      messageTypeSelectedRadio: 'non promotional'
    })
      /* eslint-disable */
    $('.selectSegmentation').addClass('hideSegmentation')
    $('.selectList').addClass('hideSegmentation')
    $('#selectLists').val('').trigger('change')
    $('#selectPage').val('').trigger('change')
    $('#selectGender').val('').trigger('change')
    $('#selectLocale').val('').trigger('change')
    $('#selectTags').val('').trigger('change')
    $('#selectPoll').val('').trigger('change')
    $('#selectSurvey').val('').trigger('change')
      /* eslint-enable */
  }

  initializeSurveySelect (surveyOptions) {
    var self = this
    console.log('surveyOptions', surveyOptions)
    /* eslint-disable */
    $('#selectSurvey').select2({
    /* eslint-enable */
      data: surveyOptions,
      placeholder: 'Select Survey',
      allowClear: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectSurvey').on('change', function (e) {
    /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ surveyValue: selected })
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: self.state.pageValue,
          genderValue: self.state.genderValue,
          localeValue: self.state.localeValue,
          tagValue: self.state.tagValue,
          pollValue: self.state.pollValue,
          surveyValue: selected,
          messageTypeSelectedRadio: self.state.messageTypeSelectedRadio
        })
      }
    })
  }

  initializePollSelect (pollOptions) {
    var self = this
     /* eslint-disable */
     $('#selectPoll').select2({
     /* eslint-enable */
       data: pollOptions,
       placeholder: 'Select Poll',
       allowClear: true,
       multiple: true
     })
     /* eslint-disable */
     $('#selectPoll').on('change', function (e) {
     /* eslint-enable */
       var selectedIndex = e.target.selectedIndex
       if (selectedIndex !== '-1') {
         var selectedOptions = e.target.selectedOptions
         var selected = []
         for (var i = 0; i < selectedOptions.length; i++) {
           var selectedOption = selectedOptions[i].value
           selected.push(selectedOption)
         }
         self.setState({ pollValue: selected })
         console.log('pollValue', self.state.pollValue)
         self.props.handleTargetValue({
           listSelected: self.state.listSelected,
           pageValue: self.state.pageValue,
           genderValue: self.state.genderValue,
           localeValue: self.state.localeValue,
           tagValue: self.state.tagValue,
           pollValue: selected,
           surveyValue: self.state.surveyValue,
           messageTypeSelectedRadio: self.state.messageTypeSelectedRadio
         })
       }
     })
  }
  initializeListSelect (lists) {
    console.log('this.state.pageValue', this.state.pageValue)
    var self = this
    /* eslint-disable */
    $('#selectLists').select2({
    /* eslint-enable */
      data: lists,
      placeholder: 'Select Lists',
      allowClear: true,
      tags: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectLists').on('change', function (e) {
    /* eslint-enable */
      console.log('send data to function handle target value', self.state)
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ listSelected: selected })
        self.props.handleTargetValue({
          isList: selected.length > 0 ? true : false,
          listSelected: selected,
          pageValue: self.state.pageValue,
          genderValue: self.state.genderValue,
          localeValue: self.state.localeValue,
          tagValue: self.state.tagValue,
          pollValue: self.state.pollValue,
          surveyValue: self.state.surveyValue,
          messageTypeSelectedRadio: self.state.messageTypeSelectedRadio
        })
      }
    })

    /* eslint-disable */
    $('#selectLists').val('').trigger('change')
    /* eslint-enable */
  }
  initializePageSelect (pageOptions) {
    var self = this
    /* eslint-disable */
    $('#selectPage').select2({
      /* eslint-enable */
      data: pageOptions,
      placeholder: this.props.component === 'broadcast' ? 'Select page' : 'Default: All Pages',
      allowClear: false,
      multiple: false
    })

    // this.setState({pageValue: pageOptions[0].id})

    /* eslint-disable */
    $('#selectPage').on('change', function (e) {
      /* eslint-enable */
      // var selectedIndex = e.target.selectedIndex
      // if (selectedIndex !== '-1') {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ pageValue: selected })
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: selected,
          genderValue: self.state.genderValue,
          localeValue: self.state.localeValue,
          tagValue: self.state.tagValue,
          pollValue: self.state.pollValue,
          surveyValue: self.state.surveyValue,
          messageTypeSelectedRadio: self.state.messageTypeSelectedRadio
        })
      }
      self.showSubscriptionMsg(selected)
    })
  }

  initializeGenderSelect (genderOptions) {
    var self = this
    /* eslint-disable */
    $('#selectGender').select2({
      /* eslint-enable */
      data: genderOptions,
      placeholder: 'Select Gender',
      allowClear: true,
      multiple: true
    })

    /* eslint-disable */
    $('#selectGender').on('change', function (e) {
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
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: self.state.pageValue,
          genderValue: selected,
          localeValue: self.state.localeValue,
          tagValue: self.state.tagValue,
          pollValue: self.state.pollValue,
          surveyValue: self.state.surveyValue,
          messageTypeSelectedRadio: self.state.messageTypeSelectedRadio
        })
      }
    })
  }

  initializeLocaleSelect (localeOptions) {
    var self = this
    /* eslint-disable */
    $('#selectLocale').select2({
      /* eslint-enable */
      data: localeOptions,
      placeholder: 'Select Locale',
      allowClear: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectLocale').on('change', function (e) {
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
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: self.state.pageValue,
          genderValue: self.state.genderValue,
          localeValue: selected,
          tagValue: self.state.tagValue,
          pollValue: self.state.pollValue,
          surveyValue: self.state.surveyValue,
          messageTypeSelectedRadio: self.state.messageTypeSelectedRadio
        })
      }
    })
  }

  initializeTagSelect (tagOptions) {
    let remappedOptions = []

    for (let i = 0; i < tagOptions.length; i++) {
      let temp = {
        id: tagOptions[i].tag,
        text: tagOptions[i].tag
      }
      remappedOptions[i] = temp
    }
    var self = this
      /* eslint-disable */
    $('#selectTags').select2({
      /* eslint-enable */
      data: remappedOptions,
      placeholder: 'Select Tags',
      allowClear: true,
      multiple: true
    })
      /* eslint-disable */
    $('#selectTags').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {

        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          console.log('e.target',selectedOptions[i].value)
          selected.push(selectedOption)
        }
        self.setState({ tagValue: selected })
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: self.state.pageValue,
          genderValue: self.state.genderValue,
          localeValue: self.state.localeValue,
          tagValue: selected,
          pollValue: self.state.pollValue,
          surveyValue: self.state.surveyValue,
          messageTypeSelectedRadio: self.state.messageTypeSelectedRadio
        })
      }
    })
  }
  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'list') {
      console.log('this.state.pageValue in handle radio function', this.state.pageValue)
      this.setState({genderValue: [], localeValue: [], tagValue: [], isList: true, pollValue: [], surveyValue: []})
      /* eslint-disable */
      // $('#selectPage').val('').trigger('change')
      $('#selectGender').val('').trigger('change')
      $('#selectLocale').val('').trigger('change')
      $('#selectTags').val('').trigger('change')
      // $('#selectPoll').val('').trigger('change')
      // $('#selectSurvey').val('').trigger('change')
      $('.selectSegmentation').addClass('hideSegmentation')
      $('.selectList').removeClass('hideSegmentation')
      /* eslint-enable */
    } if (e.currentTarget.value === 'segmentation') {
      /* eslint-disable */
      $('.selectSegmentation').removeClass('hideSegmentation')
      $('.selectList').addClass('hideSegmentation')
      $('#selectLists').val('').trigger('change')
      /* eslint-enable */
      this.setState({listSelected: [], isList: false})
    }
  }
  messageTypeRadioButton (e) {
    this.setState({
      messageTypeSelectedRadio: e.currentTarget.value
    })
    var self = this
    self.props.handleTargetValue({
      listSelected: self.state.listSelected,
      pageValue: self.state.pageValue,
      genderValue: self.state.genderValue,
      localeValue: self.state.localeValue,
      tagValue: self.state.tagValue,
      pollValue: self.state.pollValue,
      surveyValue: self.state.surveyValue,
      messageTypeSelectedRadio: e.currentTarget.value
    })

  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('UNSAFE_componentWillReceiveProps', nextProps)
    console.log('this.state.pageValue in component will receive', this.state.pageValue)
    if (nextProps.resetTarget) {
      this.resetTargeting()
    }
    if (nextProps.customerLists && this.state.lists.length === 0 && nextProps.customerLists.length > 0) {
      let options = []
      for (var j = 0; j < nextProps.customerLists.length; j++) {
        if (!(nextProps.customerLists[j].initialList)) {
          options.push({id: nextProps.customerLists[j]._id, text: nextProps.customerLists[j].listName})
        } else {
          if (nextProps.customerLists[j].content && nextProps.customerLists[j].content.length > 0) {
            options.push({id: nextProps.customerLists[j]._id, text: nextProps.customerLists[j].listName})
          }
        }
      }
      this.setState({lists: options})
      this.initializeListSelect(options)
      if (options.length === 0) {
        this.setState({selectedRadio: 'segmentation'})
      }
    }
    if (this.props.tags) {
      this.initializeTagSelect(this.props.tags)
    }
    console.log('current pageId', this.props.page.pageId)
    console.log('next pageId', nextProps.page)
    // if (this.props.page && nextProps.page && this.props.page.pageId !== nextProps.page.pageId) {
    //   this.initializeSubscribers(nextProps)
    // }
  }

  // initializeSubscribers (props) {
  //   let currentPageSubscribers = this.props.subscribers.filter(subscriber => subscriber.pageId.pageId === props.page.pageId)
  //   console.log('currentPageSubscribers', currentPageSubscribers)
  //   this.setState({subscribers: currentPageSubscribers}, () => {
  //     this.subscriberReachEstimation()
  //   })
  // }

  render () {
    return (
      <div className='row'>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="learnMore" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                      Subscriber count is zero
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <span>You can not send messages to any of your subscribers if :</span>
              <ol>
                <li>None of your subscribers have 24 hour window session active. The session will automatically become active when your subscriber messages.</li>
                <li>No subscriber match the selected criteria</li>
              </ol>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        {/* {
          this.state.isShowingModalPro &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeProDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeProDialog}>
              <h3>Upgrade to Pro</h3>
              <p>This feature is not available in free account. Kindly updrade your account to use this feature.</p>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={() => this.goToSettings()}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        } */}
        <div className='col-12' style={{paddingLeft: '20px', paddingBottom: '0px', paddingTop:'20px'}}>
        {
          this.props.page.tasks && this.props.page.tasks.includes('MANAGE') &&
          <span
            className={this.props.subscriberCount === 0 ? 'm--font-boldest m--font-danger' : 'm--font-boldest m--font-success'}
            style={{marginLeft: '10px'}}
          >
            This {this.props.component} will be sent to {this.props.subscriberCount} out of {this.props.totalSubscribersCount} subscriber(s).
            { this.props.subscriberCount === 0 &&
              <a href='#/' onClick={this.isShowingLearnMore} style={{textDecoration: 'underline' }}
              data-toggle="modal" data-target="#learnMore">
                Learn More
            </a>
            }
          </span>
        }
        </div>
        {/* <div className='col-2' style={{paddingLeft: '20px', paddingBottom: '20px', paddingTop: '20px', borderBottom: '.07rem dashed #ebedf2'}}>
          <span class="m--font-bolder">
					  Message Type
				  </span>
        </div>
        <div className='col-10' style={{paddingLeft: '20px', paddingBottom: '20px', paddingTop: '20px', borderBottom: '.07rem dashed #ebedf2'}}>
          <div className="m-radio-list">
					  <label className="m-radio m-radio--solid m-radio--brand">
              <input
                type="radio"
                value="non promotional"
                name='message_type'
                onChange={this.messageTypeRadioButton}
                checked={this.state.messageTypeSelectedRadio === 'non promotional'}
              />
						  Non-Promotional Content
              <span></span>
					  </label>
            <span class="m-form__help">
              These broadcasts cannot contain any promotions (no sales, coupons and discounts, etc.) and
              should be within one of the 16 allowed use cases defined by
              <a href='https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags#supported_tags' target='_blank' rel='noopener noreferrer'> Facebook</a>.
					  </span>
            <div className="m-alert m-alert--outline m-alert--outline-2x alert alert-warning alert-dismissible fade show" role="alert">
							<button type="button" style={{top: '-10px'}} className="close" data-dismiss="alert" aria-label="Close"></button>
							<strong>Non-compliant! </strong> messages may result in your page being suspended by Facebook.
						</div>
					  <label className="m-radio m-radio--solid m-radio--brand">
              <input
                type="radio"
                value="promotional"
                name='message_type'
                onChange={this.messageTypeRadioButton}
                checked={this.state.messageTypeSelectedRadio === 'promotional'}
              />
						  Promotional Content
              <span></span>
					  </label>
            <span class="m-form__help">
              These broadcasts can contain promotions, but the target audience is limited to subscribers who
              interacted with your bot in the last 24 hours.
              <a href='https://developers.facebook.com/docs/messenger-platform/policy/policy-overview#24hours_window' target='_blank' rel='noopener noreferrer'> Learn more here</a>
					  </span>
				  </div>
        </div> */}
        <div className='col-12' style={{paddingLeft: '20px', paddingBottom: '0px'}}>
          <i className='flaticon-exclamation m--font-brand' />
          { this.props.component === 'broadcast' && <span style={{marginLeft: '10px'}}>
            If you do not select any targeting, broadcast message will be sent to all the subscribers from the connected pages.
            <p> <b>Note:</b> Subscribers who are engaged in live chat with an agent, will receive this broadcast after 30 mins of ending the conversation.</p>
          </span>
          }
          { this.props.component === 'poll' && <span style={{marginLeft: '10px'}}>
            If you do not select any targeting, poll will be sent to all the subscribers from the connected pages.
            <p> <b>Note:</b> Subscribers who are engaged in live chat with an agent, will receive this poll after 30 mins of ending the conversation.</p>
          </span>
          }
          { this.props.component === 'survey' && <span style={{marginLeft: '10px'}}>
            If you do not select any targeting, survey will be sent to all the subscribers from the connected pages.
            <p> <b>Note:</b> Subscribers who are engaged in live chat with an agent, will receive this survey after 30 mins of ending the conversation.</p>
          </span>
          }
        </div>
        { /*
          <h5 style={{paddingLeft: '20px', paddingBottom: '0px', marginBottom: '30px'}}>This {this.props.component} will be sent to <strong>{this.props.currentReachEstimation || this.props.currentReachEstimation === 0 ? this.props.currentReachEstimation : 'calculating...'}</strong> subscribers</h5>
        */ }
        {/* <div className='col-12' style={{paddingLeft: '20px'}}>
          {this.state.showSubscriptionMsg &&
          <div style={{paddingBottom: '10px'}}>
            <span style={{fontSize: '0.9rem', fontWeight: 'bold'}} >Note:</span>&nbsp;
            <span style={{fontSize: '0.9rem'}}>
              This {this.props.component === 'survey' ? 'survey' : this.props.component === 'poll' ? 'poll' : this.props.component === 'broadcast' ? 'broadcast' : ''} will be sent to only those subscribers who you have chatted with in the last 24 hours. In order to send this {this.props.component === 'survey' ? 'survey' : this.props.component === 'poll' ? 'poll' : this.props.component === 'broadcast' ? 'broadcast' : ''} to all your subcribers, please apply for Subscription Messages Permission by following the steps given on this&nbsp;
              <a href='https://developers.facebook.com/docs/messenger-platform/policy/app-to-page-subscriptions' target='_blank' rel='noopener noreferrer'>link.</a>
            </span>
          </div>
          }
          </div> */}
          {/* <div className='col-2' style={{paddingLeft: '20px', paddingBottom: '30px'}}>
            <span class="m--font-bolder">
					    Targeting
				    </span>
          </div> */}
          <div className='col-12' style={{paddingLeft: '20px', paddingBottom: '30px'}}>
            {
              this.props.component !== 'broadcast' &&
              <div>
                <label>Select Page:</label>
                <div className='form-group m-form__group'>
                  <select id='selectPage' style={{width: 200 + '%'}} />
                </div>
              </div>
            }
            <label>Select Segmentation:</label>
            <div className='radio-buttons' style={{marginLeft: '37px'}}>
              <div className='radio'>
                <input id='segmentAll'
                  type='radio'
                  value='segmentation'
                  name='segmentationType'
                  onChange={this.handleRadioButton}
                  checked={this.state.selectedRadio === 'segmentation'} />
                <label>Apply Basic Segmentation</label>
              </div>
              { this.state.selectedRadio === 'segmentation'
                ? <div className='m-form selectSegmentation '>
                  <div className='form-group m-form__group'>
                    <select id='selectGender' style={{minWidth: 75 + '%'}} />
                  </div>
                  <div className='form-group m-form__group' style={{marginTop: '-10px'}}>
                    <select id='selectLocale' style={{minWidth: 75 + '%'}} />
                  </div>
                  <div className='form-group m-form__group' style={{marginTop: '-18px'}}>
                    <select id='selectTags' style={{minWidth: 75 + '%'}} />
                  </div>
                  <div className='form-group m-form__group row pollFilter' style={{marginTop: '-18px', marginBottom: '20px'}}>
                    <div className='col-lg-8 col-md-8 col-sm-8'>
                      {/* this.props.user.unique_ID === 'plan_A' || this.props.user.unique_ID === 'plan_C'  */}
                      <select id='selectPoll' style={{minWidth: 75 + '%'}} />
                      {/* : <select id='selectPoll' style={{minWidth: 75 + '%'}} disabled /> */}
                    </div>
                    <div className='m-dropdown m-dropdown--inline m-dropdown--arrow col-lg-4 col-md-4 col-sm-4' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDownPoll}>
                      {/* this.props.user.unique_ID === 'plan_A' || this.props.user.unique_ID === 'plan_C'  */ }
                      <a href='#/' className='m-portlet__nav-link m-dropdown__toggle btn m-btn m-btn--link'>
                        <i className='la la-info-circle' />
                      </a>
                      {/* add paid plan check later
                        : <a onClick={this.showProDialog} className='m-portlet__nav-link btn m-btn m-btn--link'>&nbsp;&nbsp;
                        <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                          <span style={{color: '#34bfa3'}}>PRO</span>
                        </span>
                      </a>
                      */}
                      {
                        this.state.showDropDownPoll &&
                        <div className='m-dropdown__wrapper' style={{marginLeft: '-170px'}}>
                          <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                          <div className='m-dropdown__inner'>
                            <div className='m-dropdown__body'>
                              <div className='m-dropdown__content'>
                                <label>Select a poll to send this newly created poll to only those subscribers who responded to the selected polls.</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                  <div className='form-group m-form__group row surveyFilter' style={{marginTop: '-18px', marginBottom: '20px'}}>
                    <div className='col-lg-8 col-md-8 col-sm-8'>
                      {/* this.props.user.unique_ID === 'plan_A' || this.props.user.unique_ID === 'plan_C'  */}
                      <select id='selectSurvey' style={{minWidth: 75 + '%'}} />
                      {/* <select id='selectSurvey' style={{minWidth: 75 + '%'}} disabled /> */}
                    </div>
                    <div className='m-dropdown m-dropdown--inline m-dropdown--arrow col-lg-4 col-md-4 col-sm-4' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDownSurvey}>
                      {/* this.props.user.unique_ID === 'plan_A' || this.props.user.unique_ID === 'plan_C' */}
                      <a href='#/' className='m-portlet__nav-link m-dropdown__toggle btn m-btn m-btn--link'>
                        <i className='la la-info-circle' />
                      </a>
                      {/* : <a onClick={this.showProDialog} className='m-portlet__nav-link btn m-btn m-btn--link'>&nbsp;&nbsp;
                          <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                            <span style={{color: '#34bfa3'}}>PRO</span>
                          </span>
                        </a>
                      */}
                      {
                       this.state.showDropDownSurvey &&
                       <div className='m-dropdown__wrapper' style={{marginLeft: '-170px'}}>
                         <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                         <div className='m-dropdown__inner'>
                           <div className='m-dropdown__body'>
                             <div className='m-dropdown__content'>
                               <label>Select a survey to send this newly created survey to only those subscribers who responded to the selected survey.</label>
                             </div>
                           </div>
                         </div>
                       </div>
                     }
                    </div>
                  </div>
                </div>
              : <div className='m-form selectSegmentation hideSegmentation'>
                <div className='form-group m-form__group'>
                  <select id='selectGender' style={{minWidth: 75 + '%'}} disabled />
                </div>
                <div className='form-group m-form__group' style={{marginTop: '-10px'}}>
                  <select id='selectLocale' style={{minWidth: 75 + '%'}} disabled />
                </div>
                <div className='form-group m-form__group' style={{marginTop: '-18px'}}>
                  <select id='selectTags' style={{minWidth: 75 + '%'}} disabled />
                </div>
                <div className='form-group m-form__group row pollFilter' style={{marginTop: '-18px', marginBottom: '20px'}}>
                  <div className='col-lg-8 col-md-8 col-sm-8'>
                    <select id='selectPoll' style={{minWidth: 75 + '%'}} disabled />
                  </div>
                  <div className='m-dropdown m-dropdown--inline m-dropdown--arrow col-lg-4 col-md-4 col-sm-4' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDownPoll}>
                    {/* this.props.user.unique_ID === 'plan_A' || this.props.user.unique_ID === 'plan_C' */}
                    <a href='#/' className='m-portlet__nav-link m-dropdown__toggle btn m-btn m-btn--link'>
                      <i className='la la-info-circle' />
                    </a>
                    {/* : <a onClick={this.showProDialog} className='m-portlet__nav-link btn m-btn m-btn--link'>&nbsp;&nbsp;
                      <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                        <span style={{color: '#34bfa3'}}>PRO</span>
                      </span>
                    </a>
                    */}
                    {
                      this.state.showDropDownPoll &&
                      <div className='m-dropdown__wrapper' style={{marginLeft: '-170px'}}>
                        <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                        <div className='m-dropdown__inner'>
                          <div className='m-dropdown__body'>
                            <div className='m-dropdown__content'>
                              <label>Select a poll to send this newly created poll to only those subscribers who responded to the selected polls.</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className='form-group m-form__group row surveyFilter' style={{marginTop: '-18px', marginBottom: '20px'}}>
                  <div className='col-lg-8 col-md-8 col-sm-8'>
                    <select id='selectSurvey' style={{minWidth: 75 + '%'}} disabled />
                  </div>
                  <div className='m-dropdown m-dropdown--inline m-dropdown--arrow col-lg-4 col-md-4 col-sm-4' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDownSurvey}>
                    {/* this.props.user.unique_ID === 'plan_A' || this.props.user.unique_ID === 'plan_C' */}
                    ? <a href='#/' className='m-portlet__nav-link m-dropdown__toggle btn m-btn m-btn--link'>
                      <i className='la la-info-circle' />
                    </a>
                    {/* : <a onClick={this.showProDialog} className='m-portlet__nav-link btn m-btn m-btn--link'>&nbsp;&nbsp;
                      <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                        <span style={{color: '#34bfa3'}}>PRO</span>
                      </span>
                    </a>
                    */}
                    {
                      this.state.showDropDownSurvey &&
                      <div className='m-dropdown__wrapper' style={{marginLeft: '-170px'}}>
                        <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                        <div className='m-dropdown__inner'>
                          <div className='m-dropdown__body'>
                            <div className='m-dropdown__content'>
                              <label>Select a survey to send this newly created survey to only those subscribers who responded to the selected survey.</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              }
              { (this.state.lists.length === 0)
              ? <div className='radio'>
                <input id='segmentList'
                  type='radio'
                  value='list'
                  name='segmentationType'
                  disabled />
                <label>Use Segmented Subscribers List</label>
                <div style={{marginLeft: '20px'}}>
                  <Link to='/segmentedLists' style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}> See Segmentation Here</Link></div>
              </div>
              : <div className='radio'>
                <input id='segmentList'
                  type='radio'
                  value='list'
                  name='segmentationType'
                  onChange={this.handleRadioButton}
                  checked={this.state.selectedRadio === 'list'} />
                <label>Use Segmented Subscribers List</label>
                <div style={{marginLeft: '20px'}}>
                  <Link to='/segmentedLists' style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}> See Segmentation Here</Link></div>
              </div>
              }
              <div className='m-form'>
                { this.state.selectedRadio === 'list'
              ? <div className='selectList form-group m-form__group'>
                <select id='selectLists' style={{minWidth: 75 + '%'}} />
              </div>
              : <div className='selectList form-group m-form__group'>
                <select id='selectLists' style={{minWidth: 75 + '%'}} disabled />
              </div>
              }
              </div>
            </div>
          </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log('state in targeting', state)
  return {
    pages: (state.pagesInfo.pages),
    customerLists: (state.listsInfo.customerLists),
    tags: (state.tagsInfo.tags),
    polls: (state.pollsInfo.polls),
    surveys: (state.surveysInfo.surveys),
    user: (state.basicInfo.user),
    currentReachEstimation: (state.pagesInfo.currentReachEstimation)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getAllPollResults: getAllPollResults,
    loadCustomerLists: loadCustomerLists,
    loadTags: loadTags,
    getSubscriberReachEstimation
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Targeting)
