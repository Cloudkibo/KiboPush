/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import Select from 'react-select'
import { createsurvey } from '../../redux/actions/surveys.actions'
import { getuserdetails, surveyTourCompleted } from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
import { Link } from 'react-router'
class AddSurvey extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    this.state = {
      questionType: 'multichoice',
      surveyQuestions: [],
      alertMessage: '',
      alertType: '',
      timeout: 2000,
      page: {
        options: []
      },
      Gender: {
        options: [{label: 'Male', value: 'male'},
                  {label: 'Female', value: 'female'},
                  {label: 'Other', value: 'other'}
        ]
      },
      Locale: {
        options: [{label: 'en_US', value: 'en_US'},
                  {label: 'af_ZA', value: 'af_ZA'},
                  {label: 'ar_AR', value: 'ar_AR'},
                  {label: 'az_AZ', value: 'az_AZ'},
                  {label: 'pa_IN', value: 'pa_IN'}
        ]
      },
      stayOpen: false,
      disabled: false,
      pageValue: [],
      genderValue: [],
      localeValue: [],
      steps: []
    }
    // surveyQuestions will be an array of json object
    // each json object will have following keys:
    // statement : //value of question
    // type: //text or multichoice
    // choiceCount: //no of options
    // options: [] array of choice values
    this.createSurvey = this.createSurvey.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleLocaleChange = this.handleLocaleChange.bind(this)
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
    this.tourFinished = this.tourFinished.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://unpkg.com/react-select/dist/react-select.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Add Survey'
    let options = []
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {label: this.props.pages[i].pageName, value: this.props.pages[i].pageId}
    }
    this.setState({page: {options: options}})
    this.addSteps([
      {
        title: 'Surveys',
        text: `Survey allows creation of set of questions, to be sent to your subscribers, where they can choose from a set of given reponses`,
        selector: 'div#survey',
        position: 'top-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Title and Description',
        text: `Give your survey a title and description for easy identification`,
        selector: 'div#identity',
        position: 'right',
        type: 'hover',
        isFixed: true},
      {
        title: 'Add Questions',
        text: 'Add questions, and create a set of responses for your subscriber to reply with',
        selector: 'button#questions',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true},
      {
        title: 'Targetting',
        text: 'You can target a specific demographic amongst your subscribers, by choosing these options',
        selector: 'div#target',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true}
    ])
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.createwarning) {
      console.log('i am called')
      this.props.history.push({
        pathname: '/surveys'

      })
    }
  }

  handlePageChange (value) {
    var temp = value.split(',')
    console.log('handlePageChange', temp)
    this.setState({ pageValue: temp })
  }

  handleGenderChange (value) {
    var temp = value.split(',')
    console.log('handleGenderChange', temp)
    this.setState({ genderValue: temp })
  }

  handleLocaleChange (value) {
    var temp = value.split(',')
    console.log('handleLocaleChange', temp)
    this.setState({ localeValue: temp })
  }

  createSurvey (e) {
    e.preventDefault()
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
              console.log('empty')
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
          console.log('empty')
        } else {
          let completeChoice = document.getElementById('question' + j)
          completeChoice.classList.remove('has-error')
        }
      }
      // Checking if Description or Title is empty, and highlighting it

      if (this.refs.description.value === '') {
        flag = 1
        let incompleteDesc = document.getElementById('desc')
        incompleteDesc.classList.add('has-error')
      } else {
        let completeDesc = document.getElementById('desc')
        completeDesc.classList.remove('has-error')
      }

      if (this.refs.title.value === '') {
        flag = 1
        let incompleteTitle = document.getElementById('titl')
        incompleteTitle.classList.add('has-error')
      } else {
        let completeTitle = document.getElementById('titl')
        completeTitle.classList.remove('has-error')
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 ||
                    this.state.localeValue.length > 0) {
        isSegmentedValue = true
      }
      if (flag === 0 && this.refs.title.value !== '' &&
        this.refs.description.value !== '') {
        var surveybody = {
          survey: {
            title: this.refs.title.value, // title of survey
            description: this.refs.description.value, // description of survey
            image: '' // image url
          },
          questions: this.state.surveyQuestions,
          isSegmented: isSegmentedValue,
          segmentationPageIds: this.state.pageValue,
          segmentationGender: this.state.genderValue,
          segmentationLocale: this.state.localeValue
        }
        this.props.createsurvey(surveybody)
        this.props.history.push({
          pathname: '/surveys'
        })
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
    this.setState({surveyQuestions: surveyQuestions})
    console.log('surveyQuestions')
    if (this.state.surveyQuestions.length > 0) {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
    }
    console.log(this.state.surveyQuestions)
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
    console.log(
      'removeChoices called qindex ' + qindex + ' choiceIndex ' + choiceIndex)
    let surveyQuestions = this.state.surveyQuestions.slice()
    if (surveyQuestions[qindex].choiceCount === 2) {
      this.setState({
        alertMessage: 'Atleast 2 options are required for each question',
        alertType: 'danger'
      })
    } else {
      let choices = surveyQuestions[qindex].options.slice()
      console.log('choices before')
      console.log(choices)
      choices.splice(choiceIndex, 1)
      console.log('choices after')
      console.log(choices)
      surveyQuestions[qindex].choiceCount = surveyQuestions[qindex].choiceCount -
        1
      surveyQuestions[qindex].options = choices
      this.setState({surveyQuestions: surveyQuestions})
    }
  }

  removeClick (i) {
    if (this.state.surveyQuestions.length === 1) {
      console.log('A survey form requires atleast one question')
      this.setState({
        alertMessage: 'A survey form requires atleast one question',
        alertType: 'danger'
      })
    } else {
      console.log('delete this survey question')
      let surveyQuestions = this.state.surveyQuestions.slice()
      surveyQuestions.splice(i, 1)
      console.log(surveyQuestions)
      this.setState({
        surveyQuestions: surveyQuestions
      })
    }
  }

  handleChange (i, event) {
    let surveyQuestions = this.state.surveyQuestions.slice()
    surveyQuestions[i].statement = event.target.value
    this.setState({surveyQuestions})
    console.log('surveyQuestions')
    console.log(this.state.surveyQuestions)
  }

  onhandleChoiceChange (qindex, choiceIndex, event) {
    console.log('onhandleChoiceChange is called')
    let surveyQuestions = this.state.surveyQuestions.slice()
    console.log('qindex is ' + qindex)
    console.log('choiceIndex is ' + choiceIndex)
    surveyQuestions[qindex].options[choiceIndex] = event.target.value
    this.setState({surveyQuestions})
    console.log('surveyQuestions')
    console.log(this.state.surveyQuestions)
  }

  /* handleQuestionType (e) {
   this.setState({
   'questionType': e.target.value
   })
   } */

  createOptionsList (qindex) {
    console.log('qindex' + qindex)
    let choiceItems = []
    var choiceCount = this.state.surveyQuestions[qindex].choiceCount
    console.log('choiceCount is ' + choiceCount)
    for (var j = 0; j < choiceCount; j++) {
      choiceItems.push(
        <div className='input-group' id={'choice' + qindex + j}>
          <input type='text' placeholder={'Choice ' + (j + 1)}
            className='form-control input-sm'
            value={this.state.surveyQuestions[qindex].options[j]}
            onChange={this.onhandleChoiceChange.bind(this, qindex, j)} />
          <span className='input-group-btn'>
            <button className='btn btn-secondary' type='button'
              onClick={this.removeChoices.bind(this, j, qindex)}>
              <span className='fa fa-times' />
            </button>
          </span>
        </div>
      )
    }
    return choiceItems || null
  }

  tourFinished (data) {
    console.log('Next Tour Step')
    if (data.type === 'finished') {
      console.log('this: ', this)
      console.log('Tour Finished')
      this.props.surveyTourCompleted({
        'surveyTourSeen': true
      })
    }
  }

  addSteps (steps) {
    // let joyride = this.refs.joyride

    if (!Array.isArray(steps)) {
      steps = [steps]
    }

    if (!steps.length) {
      return false
    }
    var temp = this.state.steps
    this.setState({
      steps: temp.concat(steps)
    })
  }

  addTooltip (data) {
    this.refs.joyride.addTooltip(data)
  }

  createUI () {
    let uiItems = []
    for (let i = 0; i < this.state.surveyQuestions.length; i++) {
      if (this.state.surveyQuestions[i].type === 'text') {
        uiItems.push(
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
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

  render () {
    const { disabled, stayOpen } = this.state
    return (
      <div>
        {
      !(this.props.user && this.props.user.surveyTourSeen) &&
        <Joyride ref='joyride' run steps={this.state.steps} scrollToSteps debug={false} type={'continuous'} callback={this.tourFinished} showStepsProgress showSkipButton />
      }
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />
          <div className='row'>
            <div className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
              <div id='survey'>
                <h2 className='presentation-margin'>Create Survey Form</h2>
              </div>
              <div className='ui-block'>
                <div className='news-feed-form'>

                  <div className='tab-content'>
                    <div className='tab-pane active' id='home-1' role='tabpanel'
                      aria-expanded='true'>
                      <div id='identity'>
                        <div className='col-xl-12'>
                          <div className='form-group' id='titl'>
                            <label className='control-label'>Title</label>
                            <input className='form-control'
                              placeholder='Enter form title here' ref='title' />
                          </div>
                        </div>
                        <br />
                        <div className='col-xl-12'>
                          <div className='form-group' id='desc'>
                            <label className='control-label'>Description</label>
                            <textarea className='form-control'
                              placeholder='Enter form description here'
                              rows='3' ref='description' />
                          </div>
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

                      <div className='col-sm-6 col-md-4'>
                        <button id='questions' className='btn btn-primary btn-sm'
                          onClick={this.addClick.bind(this)}> Add Questions
                      </button>
                      </div>
                      <div className='add-options-message'>

                        <button className='btn btn-primary'
                          onClick={this.createSurvey}> Create Survey
                      </button>
                        <Link
                          to='/surveys'
                          style={{float: 'right', margin: 2}}
                          className='btn btn-border-think btn-transparent c-grey'>
                        Cancel
                      </Link>
                      </div>
                      {this.state.alertMessage !== '' &&
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
            </div>
            <div id='target' className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
              <h2 className='presentation-margin'>Targeting</h2>
              <p>Select the type of customer you want to send survey to</p>
              <div className='form-group'>
                <Select
                  closeOnSelect={!stayOpen}
                  disabled={disabled}
                  multi
                  onChange={this.handlePageChange}
                  options={this.state.page.options}
                  placeholder='Select page(s)'
                  simpleValue
                  value={this.state.pageValue}
                />
              </div>
              <div className='form-group'>
                <Select
                  closeOnSelect={!stayOpen}
                  disabled={disabled}
                  multi
                  onChange={this.handleGenderChange}
                  options={this.state.Gender.options}
                  placeholder='Select Gender'
                  simpleValue
                  value={this.state.genderValue}
                />
              </div>
              <div className='form-group'>
                <Select
                  closeOnSelect={!stayOpen}
                  disabled={disabled}
                  multi
                  onChange={this.handleLocaleChange}
                  options={this.state.Locale.options}
                  placeholder='Select Locale'
                  simpleValue
                  value={this.state.localeValue}
                />
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
    surveys: (state.surveysInfo.surveys),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createsurvey: createsurvey,
    getuserdetails: getuserdetails,
    surveyTourCompleted: surveyTourCompleted
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddSurvey)
