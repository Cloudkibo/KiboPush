/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { createsurvey, sendsurvey, sendSurveyDirectly } from '../../redux/actions/surveys.actions'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { loadSurveyDetails } from '../../redux/actions/templates.actions'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
import { Link } from 'react-router'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { checkConditions } from '../polls/utility'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {loadTags} from '../../redux/actions/tags.actions'
import { doesPageHaveSubscribers } from '../../utility/utils'
import Targeting from '../convo/Targeting'
import SubscriptionPermissionALert from '../../components/alertMessages/subscriptionPermissionAlert'

class AddSurvey extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    props.loadSubscribersList()
    props.loadTags()
    if (this.props.currentSurvey) {
      const id = this.props.currentSurvey._id
      props.loadSurveyDetails(id)
    }
    this.state = {
      questionType: 'multichoice',
      surveyQuestions: [],
      alertMessage: '',
      alertType: '',
      timeout: 2000,
      title: this.props.currentSurvey ? this.props.currentSurvey.title :'',
      description: this.props.currentSurvey ? this.props.currentSurvey.description :'Please respond to these questions',
      stayOpen: false,
      disabled: false,
      pageValue: [],
      genderValue: [],
      localeValue: [],
      tagValue: [],
      surveyValue: [],
      showDropDown: false,
      listSelected: '',
      isList: false,
      isShowingModal: false,
      lists: [],
      resetTarget: false,
      isShowingModalGuideLines: false,
      pageId: this.props.pages[0]
    }
    this.createSurvey = this.createSurvey.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.goToSend = this.goToSend.bind(this)
    this.handleTargetValue = this.handleTargetValue.bind(this)
    this.checkValidation = this.checkValidation.bind(this)
    this.showGuideLinesDialog = this.showGuideLinesDialog.bind(this)
    this.closeGuideLinesDialog = this.closeGuideLinesDialog.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrevious = this.onPrevious.bind(this)
    this.initTab = this.initTab.bind(this)
    this.onSurveyClick = this.onSurveyClick.bind(this)
    this.onTargetClick = this.onTargetClick.bind(this)
    this.checkSurveyErrors = this.checkSurveyErrors.bind(this)
  }

  onNext (e) {
    /* eslint-disable */
      $('#tab_1').removeClass('active')
      $('#tab_2').addClass('active')
      $('#titleBroadcast').removeClass('active')
      $('#titleTarget').addClass('active')
      /* eslint-enable */
    this.setState({tabActive: 'target'})
  }

  onPrevious () {
      /* eslint-disable */
      $('#tab_1').addClass('active')
      $('#tab_2').removeClass('active')
      $('#titleBroadcast').addClass('active')
      $('#titleTarget').removeClass('active')
      /* eslint-enable */
    this.setState({tabActive: 'survey'})
  }

  initTab () {
      /* eslint-disable */
      $('#tab_1').addClass('active')
      $('#tab_2').removeClass('active')
      $('#titleBroadcast').addClass('active')
      $('#titleTarget').removeClass('active')
      /* eslint-enable */
    this.setState({tabActive: 'survey'})
  }

  onSurveyClick () {
      /* eslint-disable */
      $('#tab_1').addClass('active')
      $('#tab_2').removeClass('active')
      $('#titleBroadcast').addClass('active')
      $('#titleTarget').removeClass('active')
      /* eslint-enable */
    this.setState({tabActive: 'survey'})
  }
  onTargetClick (e) {
    /* eslint-disable */
      $('#tab_1').removeClass('active')
      $('#tab_2').addClass('active')
      $('#titleBroadcast').removeClass('active')
      $('#titleTarget').addClass('active')
      /* eslint-enable */
    this.setState({tabActive: 'target', resetTarget: false})
  }

  showGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: true})
  }

  closeGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: false})
  }

  checkSurveyErrors () {
    let flag = false
    let questionLengthFlag = false
    if (this.state.surveyQuestions.length === 0) {
      questionLengthFlag = true
    }

    for (let j = 0; j < this.state.surveyQuestions.length; j++) {
      if (this.state.surveyQuestions[j].options.length > 0) {
        for (let k = 0; k <
        this.state.surveyQuestions[j].options.length; k++) {
          if (this.state.surveyQuestions[j].options[k] === '') {
            flag = true
          }
        }
      }
      // Checking if any Question statement is empty.
      if (this.state.surveyQuestions[j].statement === '') {
        flag = true
      }
    }

    if (this.state.description === '') {
      flag = true
    }

    if (this.state.title === '') {
      flag = true
    }

    return {flag, questionLengthFlag}
  }

  checkValidation () {
    let errors = this.checkSurveyErrors()
    let flag = errors.flag
    let questionLengthFlag = errors.questionLengthFlag

    if (flag === 1 || questionLengthFlag === 1) {
      if (flag === 1) {
        this.setState({
          alertMessage: 'Please fill all the fields.',
          alertType: 'danger'
        })
      }

      if (questionLengthFlag === 1) {
        this.setState({
          alertMessage: 'A survey form requires atleast one question',
          alertType: 'danger'
        })
      }
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
      this.showDialog()
    }
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }
  closeDialog () {
    this.setState({isShowingModal: false})
  }
  handleTargetValue (targeting) {
    this.setState({
      listSelected: targeting.listSelected,
      pageValue: targeting.pageValue,
      pageId: this.props.pages.find(page => page.pageId === targeting.pageValue[0]),
      genderValue: targeting.genderValue,
      localeValue: targeting.localeValue,
      tagValue: targeting.tagValue,
      surveyValue: targeting.surveyValue
    })
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Add Survey`
    this.initTab()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.createwarning) {
      this.props.history.push({
        pathname: '/surveys'

      })
    }
    if (this.props.currentSurvey && nextProps.questions) {
      this.setState({surveyQuestions: nextProps.questions})
    }

  }
  updateDescription (e) {
    this.setState({description: e.target.value, alertType: '', alertMessage: ''})
  }
  updateTitle (e) {
    this.setState({title: e.target.value, alertType: '', alertMessage: ''})
  }
  createSurvey () {
    //  e.preventDefault()
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    let flag = 0
    if (this.state.surveyQuestions.length === 0) {
      this.setState({
        alertMessage: 'A survey form requires atleast one question',
        alertType: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
      for (let j = 0; j < this.state.surveyQuestions.length; j++) {
        if (this.state.surveyQuestions[j].options.length > 0) {
          for (let k = 0; k <
          this.state.surveyQuestions[j].options.length; k++) {
            if (this.state.surveyQuestions[j].options[k] === '') {
              let incompleteChoice = document.getElementById('choice' + j + k)
              incompleteChoice.classList.add('has-error')
              flag = 1
            } else {
              let completeChoice = document.getElementById('choice' + j + k)
              completeChoice.classList.remove('has-error')
            }
          }
        }
        // Checking if any Question statement is empty.
        if (this.state.surveyQuestions[j].statement === '') {
          let incompleteQuestion = document.getElementById('question' + j)
          incompleteQuestion.classList.add('has-error')
          flag = 1
        } else {
          let completeChoice = document.getElementById('question' + j)
          completeChoice.classList.remove('has-error')
        }
      }
      // Checking if Description or Title is empty, and highlighting it

      if (this.state.description === '') {
        flag = 1
        let incompleteDesc = document.getElementById('desc')
        incompleteDesc.classList.add('has-error')
      } else {
        let completeDesc = document.getElementById('desc')
        completeDesc.classList.remove('has-error')
      }

      if (this.state.title === '') {
        flag = 1
        let incompleteTitle = document.getElementById('titl')
        incompleteTitle.classList.add('has-error')
      } else {
        let completeTitle = document.getElementById('titl')
        completeTitle.classList.remove('has-error')
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 ||
                    this.state.localeValue.length > 0 || this.state.tagValue.length > 0 || this.state.surveyValue.length > 0) {
        isSegmentedValue = true
      }
      if (flag === 0 && this.state.title !== '' &&
        this.state.description !== '') {
        let tagIDs = []
        for (let i = 0; i < this.props.tags.length; i++) {
          for (let j = 0; j < this.state.tagValue.length; j++) {
            if (this.props.tags[i].tag === this.state.tagValue[j]) {
              tagIDs.push(this.props.tags[i]._id)
            }
          }
        }
        var surveybody = {
          survey: {
            title: this.state.title, // title of survey
            description: this.state.description, // description of survey
            image: '' // image url
          },
          fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION',
          questions: this.state.surveyQuestions,
          isSegmented: isSegmentedValue,
          segmentationPageIds: this.state.pageValue,
          segmentationGender: this.state.genderValue,
          segmentationLocale: this.state.localeValue,
          segmentationSurvey: this.state.surveyValue,
          segmentationTags: tagIDs,
          isList: isListValue,
          segmentationList: this.state.listSelected
        }
        console.log('Adding Survey', surveybody)
        this.props.createsurvey(surveybody)
      } else {
        this.setState({
          alertMessage: 'Please fill all the fields.',
          alertType: 'danger'
        })
      }
    }
  }

  addClick () {
    let surveyQuestions = this.state.surveyQuestions
    let choiceCount = 0
    let choiceValues = []
    if (this.state.questionType === 'multichoice') {
      choiceCount = 3 // by default no. of options will be 3
      choiceValues = ['', '', '']
    }

    surveyQuestions.push({
      'statement': '',
      'type': this.state.questionType,
      'choiceCount': choiceCount,
      'options': choiceValues
    })
    this.setState({surveyQuestions: surveyQuestions, alertMessage: '', alertType: ''})
    if (this.state.surveyQuestions.length > 0) {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
    }
  }

  addChoices (qindex) {
    let surveyQuestions = this.state.surveyQuestions.slice()
    let choices = surveyQuestions[qindex].options.slice()
    surveyQuestions[qindex].choiceCount = surveyQuestions[qindex].choiceCount +
      1
    choices.push('')
    surveyQuestions[qindex].options = choices
    if (surveyQuestions[qindex].choiceCount >= 2) {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
    }
    this.setState({surveyQuestions})
  }

  removeChoices (choiceIndex, qindex) {
    let surveyQuestions = this.state.surveyQuestions.slice()
    if (surveyQuestions[qindex].choiceCount === 2) {
      this.setState({
        alertMessage: 'Atleast 2 options are required for each question',
        alertType: 'danger'
      })
    } else {
      let choices = surveyQuestions[qindex].options.slice()
      choices.splice(choiceIndex, 1)
      surveyQuestions[qindex].choiceCount = surveyQuestions[qindex].choiceCount -
        1
      surveyQuestions[qindex].options = choices
      this.setState({surveyQuestions: surveyQuestions})
    }
  }

  removeClick (i) {
    if (this.state.surveyQuestions.length === 1) {
      this.setState({
        alertMessage: 'A survey form requires atleast one question',
        alertType: 'danger'
      })
    } else {
      let surveyQuestions = this.state.surveyQuestions.slice()
      surveyQuestions.splice(i, 1)
      this.setState({
        surveyQuestions: surveyQuestions
      })
    }
  }

  handleChange (i, event) {
    let surveyQuestions = this.state.surveyQuestions.slice()
    surveyQuestions[i].statement = event.target.value
    this.setState({surveyQuestions: surveyQuestions, alertMessage: '', alertType: ''})
  }

  onhandleChoiceChange (qindex, choiceIndex, event) {
    let surveyQuestions = this.state.surveyQuestions.slice()
    surveyQuestions[qindex].options[choiceIndex] = event.target.value
    this.setState({surveyQuestions: surveyQuestions, alertMessage: '', alertType: ''})
  }

  /* handleQuestionType (e) {
   this.setState({
   'questionType': e.target.value
   })
   } */

  createOptionsList (qindex) {
    let choiceItems = []
    var choiceCount = this.state.surveyQuestions[qindex].options.length
    for (var j = 0; j < choiceCount; j++) {
      choiceItems.push(
        <div className='input-group' id={'choice' + qindex + j}>
          <input type='text' maxLength={20} placeholder={'Choice ' + (j + 1)}
            className='form-control input-sm'
            value={this.state.surveyQuestions[qindex].options[j]}
            onChange={this.onhandleChoiceChange.bind(this, qindex, j)} />
          <span className='input-group-btn'>
            <button className='btn btn-secondary' type='button' style={{background: '#e74c3c'}}
              onClick={this.removeChoices.bind(this, j, qindex)}>
              <span className='fa fa-times fa-inverse' />
            </button>
          </span>
        </div>
      )
    }
    return choiceItems || null
  }

  createUI () {
    let uiItems = []
    for (let i = 0; i < this.state.surveyQuestions.length; i++) {
      if (this.state.surveyQuestions[i].type === 'text') {
        uiItems.push(
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12' key={i + '-addSurveyUI'}>
            <br />
            <div className='panel panel-default field-editor'>
              <div className='panel-heading clearfix'>
                <strong className='panel-title'>Edit Question {(i + 1)} </strong>
                <div role='toolbar' className='pull-right btn-toolbar'>
                  <a className='remove'
                    onClick={this.removeClick.bind(this, i)}>
                    <span className='fa fa-times' />
                  </a>
                </div>
              </div>
              <div className='panel-body'>
                <div className='form-group' id={'question' + i}>
                  <input className='form-control'
                    placeholder='Enter question here...'
                    value={this.state.surveyQuestions[i].statement}
                    onChange={this.handleChange.bind(this, i)} />
                </div>
              </div>
            </div>

          </div>
        )
      } else {
        uiItems.push(
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <br />
            <div className='panel panel-default field-editor'>
              <div className='panel-heading clearfix'>
                <strong className='panel-title'>Edit Question {i + 1}</strong>
                <div role='toolbar' className='pull-right btn-toolbar'>
                  <a className='remove'
                    onClick={this.removeClick.bind(this, i)}>
                    <span className='fa fa-times' />
                  </a>
                </div>
              </div>
              <div className='panel-body'>
                <div className='form-group' id={'question' + i}>
                  <input className='form-control'
                    placeholder='Enter question here...'
                    value={this.state.surveyQuestions[i].statement}
                    onChange={this.handleChange.bind(this, i)} />
                  <span>Max Length for each choice is 20 characters</span>
                </div>

                <div className='form-group field field-array'>
                  <fieldset className='col-md-6 scheduler-border'>
                    <legend className='scheduler-border'>
                      Choices
                    </legend>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                      <div className='col-xs-10'>
                        <div className='form-group field field-string'>
                          {this.createOptionsList(i)}
                        </div>
                      </div>
                      {this.state.surveyQuestions[i].choiceCount < 3 &&
                      <div className='col-sm-6 col-md-4'>
                        <button className='btn btn-secondary btn-sm'
                          onClick={this.addChoices.bind(this, i)}> Add
                          Choices
                        </button>
                      </div>
                    }
                    </div>
                  </fieldset>

                </div>
              </div>
            </div>
          </div>
        )
      }
    }
    return uiItems || null
  }

  goToSend () {
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    let flag = 0
    if (this.state.surveyQuestions.length === 0) {
      this.setState({
        alertMessage: 'A survey form requires atleast one question',
        alertType: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
      for (let j = 0; j < this.state.surveyQuestions.length; j++) {
        if (this.state.surveyQuestions[j].options.length > 0) {
          for (let k = 0; k <
          this.state.surveyQuestions[j].options.length; k++) {
            if (this.state.surveyQuestions[j].options[k] === '') {
              let incompleteChoice = document.getElementById('choice' + j + k)
              incompleteChoice.classList.add('has-error')
              flag = 1
            } else {
              let completeChoice = document.getElementById('choice' + j + k)
              completeChoice.classList.remove('has-error')
            }
          }
        }
        // Checking if any Question statement is empty.
        if (this.state.surveyQuestions[j].statement === '') {
          let incompleteQuestion = document.getElementById('question' + j)
          incompleteQuestion.classList.add('has-error')
          flag = 1
        } else {
          let completeChoice = document.getElementById('question' + j)
          completeChoice.classList.remove('has-error')
        }
      }
      // Checking if Description or Title is empty, and highlighting it

      if (this.state.description === '') {
        flag = 1
        let incompleteDesc = document.getElementById('desc')
        incompleteDesc.classList.add('has-error')
      } else {
        let completeDesc = document.getElementById('desc')
        completeDesc.classList.remove('has-error')
      }

      if (this.state.title === '') {
        flag = 1
        let incompleteTitle = document.getElementById('titl')
        incompleteTitle.classList.add('has-error')
      } else {
        let completeTitle = document.getElementById('titl')
        completeTitle.classList.remove('has-error')
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 ||
                    this.state.localeValue.length > 0 || this.state.tagValue.length > 0 || this.state.surveyValue.length > 0) {
        isSegmentedValue = true
      }
      if (flag === 0 && this.state.title !== '' &&
        this.state.description !== '') {
        var res = checkConditions(this.state.pageValue, this.state.genderValue, this.state.localeValue, this.state.tagValue, this.props.subscribers)
        if (res === false) {
          this.msg.error('No subscribers match the selected criteria')
        } else {
          let tagIDs = []
          // for (let i = 0; i < this.props.tags.length; i++) {
          //   for (let j = 0; j < this.state.tagValue.length; j++) {
          //     if (this.props.tags[i].tag === this.state.tagValue[j]) {
          //       tagIDs.push(this.props.tags[i]._id)
          //     }
          //   }
          // }
          let currentPageSubscribers
          if (this.state.pageId) {
            currentPageSubscribers = this.props.subscribers.filter(subscriber => subscriber.pageId.pageId === this.state.pageId.pageId)
          } else {
            currentPageSubscribers = this.props.subscribers
          }
          var surveybody = {
            survey: {
              title: this.state.title, // title of survey
              description: this.state.description, // description of survey
              image: '' // image url
            },
            fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION',
            questions: this.state.surveyQuestions,
            isSegmented: isSegmentedValue,
            segmentationPageIds: this.state.pageValue,
            segmentationGender: this.state.genderValue,
            segmentationLocale: this.state.localeValue,
            segmentationSurvey: this.state.surveyValue,
            segmentationTags: this.state.tagValue,
            isList: isListValue,
            segmentationList: this.state.listSelected,
            subscribersCount: currentPageSubscribers.length
          }
          console.log('Sending Survey', surveybody)
          this.props.sendSurveyDirectly(surveybody, this.msg)
        }
      } else {
        this.setState({
          alertMessage: 'Please fill all the fields.',
          alertType: 'danger'
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
    let surveyErrors = this.checkSurveyErrors()
    // const { disabled, stayOpen } = this.state
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <SubscriptionPermissionALert />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.isShowingModalGuideLines &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeGuideLinesDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeGuideLinesDialog}>
              <h4>Message Types</h4>
              <p> Following are the types of messages that can be sent to facebook messenger.</p>
              <div className='panel-group accordion' id='accordion1'>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      <p>Subscription messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity. In order to send Subscription Messages, please apply for Subscription Messages Permission by following the steps given on this&nbsp;
                      <a href='https://kibopush.com/subscription-messaging/' target='_blank'>link.</a></p>
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      Promotional messages can contain ads and promotional materials, but can only be sent to subscribers who were active in the past 24 hours.
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_3' aria-expanded='false'>Follow-Up Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      After the end of the 24 hours window you have an ability to send "1 follow up message" to these recipients. After that you won&#39;t be able to send them ads or promotional messages until they interact with you again.
                    </div>
                  </div>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }

        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.showGuideLinesDialog} >Message Types</Link>
            </div>
          </div>

          <div className='m-portlet__body'>
            <div className='row'>
              <div className='col-12'>
                <div className='m-portlet' style={{height: '100%'}}>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                        Ask Facebook Subscribers a Question
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className='m-portlet__body' >
                    {
                    this.state.tabActive === 'target' &&
                      <div className='row'>
                        <div className='col-12'>
                          <div className='pull-right'>
                            <button className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.onPrevious}>
                            Previous
                            </button>

                            <button
                              disabled={!doesPageHaveSubscribers(this.props.pages, this.state.pageValue) ? true : null}
                              className='btn btn-primary'
                              onClick={() => {
                                this.checkValidation()
                              }}>
                              Create Survey
                            </button>

                          </div>
                        </div>
                      </div>
                  }

                    {
                    this.state.tabActive === 'survey' &&
                      <div className='row'>
                        <div className='col-12'>
                          <div className='pull-right'>
                            <button className='btn btn-primary'
                              style={{marginRight: '10px'}}
                              disabled={surveyErrors.flag || surveyErrors.questionLengthFlag ? true : null}
                              onClick={this.onNext}>
                            Next
                            </button>
                            <Link
                              to='/surveys'
                              className='btn btn-secondary' style={{'marginLeft': '10px'}}>
                            Cancel
                          </Link>
                          </div>
                        </div>
                      </div>
                  }

                    <div className='row'>
                      <div className='col-12'>
                        <ul className='nav nav-tabs'>
                          <li>
                            <a id='titleBroadcast' className='broadcastTabs active' onClick={this.onSurveyClick}>Survey </a>
                          </li>
                          <li>
                            {
                            (surveyErrors.flag || surveyErrors.questionLengthFlag)
                            ? <a>Targeting</a>
                            : <a id='titleTarget' className='broadcastTabs' onClick={this.onTargetClick}>Targeting </a>
                          }
                          </li>
                        </ul>
                        <div className='tab-content'>
                          <div className='tab-pane fade active in' id='tab_1'>
                            <div className='col-12'>
                              <div className='row align-items-center'>
                                <div className='col-xl-8 order-2 order-xl-1' />
                                <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                                  {
                                      this.state.isShowingModal &&
                                      <ModalContainer style={{width: '500px'}}
                                        onClose={this.closeDialog}>
                                        <ModalDialog style={{width: '500px'}}
                                          onClose={this.closeDialog}>
                                          <p>Do you want to send this survey right away or save it for later use? </p>
                                          <div style={{width: '100%', textAlign: 'center'}}>
                                            <div style={{display: 'inline-block', padding: '5px'}}>
                                              <button className='btn btn-primary'
                                                disabled={!doesPageHaveSubscribers(this.props.pages, this.state.pageValue) ? true : null}
                                                onClick={() => {
                                                  this.closeDialog()
                                                  this.goToSend()
                                                }}>
                                                Send
                                              </button>
                                            </div>
                                            <div style={{display: 'inline-block', padding: '5px'}}>
                                              <button className='btn btn-primary'
                                                disabled={!doesPageHaveSubscribers(this.props.pages, this.state.pageValue) ? true : null}
                                                onClick={() => {
                                                  this.createSurvey()
                                                  this.props.history.push({
                                                    pathname: '/surveys'
                                                  })
                                                }}>
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        </ModalDialog>
                                      </ModalContainer>
                                    }
                                </div>
                              </div>
                              <div className='col-xl-12'>
                                <div className='form-group' id='titl'>
                                  <label className='control-label'><h5>Survey Title</h5></label>
                                  <input className='form-control' placeholder='Enter form title here'
                                    value={this.state.title} onChange={(e) => this.updateTitle(e)} />
                                </div>
                              </div>
                              <br />
                              <div className='col-xl-12'>
                                <div className='form-group' id='desc'>
                                  <label className='control-label'><h5>Survey Introduction</h5></label>
                                  <textarea className='form-control'
                                    placeholder='Enter your survey introduction here'
                                    rows='3' value={this.state.description} onChange={(e) => this.updateDescription(e)} />
                                </div>
                              </div>
                              <br />
                              <div className='col-xl-12'>
                                <h5> Add Questions </h5>
                                {this.createUI()}
                              </div>

                              {/*
                              <div className='col-xl-12'>
                              <label className='control-label col-sm-offset-2 col-sm-2'>Question Type</label>
                              <div className='col-sm-6 col-md-4'>
                              <select className='form-control' onChange={this.handleQuestionType.bind(this)}>
                              <option value='text'>Text</option>
                              <option value='multichoice'>Multi Choice Question</option>
                              </select>
                              <br />
                              </div>
                              </div>
                              */}

                              <div id='questions' className='col-sm-6 col-md-4'>
                                <button className='btn btn-primary btn-sm'
                                  onClick={this.addClick.bind(this)}> Add Questions
                                </button>
                              </div>
                              <br />
                              {this.state.alertMessage !== '' &&
                              <center>
                                <Alert type={this.state.alertType}>
                                  {this.state.alertMessage}
                                </Alert>
                              </center>
                              }
                            </div>
                          </div>
                          <div className='tab-pane' id='tab_2'>
                            <Targeting handleTargetValue={this.handleTargetValue} resetTarget={this.state.resetTarget} subscribers={this.props.subscribers} page={this.state.pageId} component='survey' />
                          </div>
                        </div>
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

function mapStateToProps (state) {
  return {
    surveys: (state.surveysInfo.surveys),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    subscribers: (state.subscribersInfo.subscribers),
    tags: (state.tagsInfo.tags),
    survey: (state.templatesInfo.survey),
    questions: (state.templatesInfo.questions),
    currentSurvey: (state.backdoorInfo.currentSurvey)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createsurvey: createsurvey,
    getuserdetails: getuserdetails,
    loadSubscribersList: loadSubscribersList,
    sendsurvey: sendsurvey,
    sendSurveyDirectly: sendSurveyDirectly,
    loadTags: loadTags,
    loadSurveyDetails: loadSurveyDetails,

  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddSurvey)
