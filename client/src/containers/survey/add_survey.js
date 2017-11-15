/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
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
      steps: [],
      showDropDown: false
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
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
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
  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }

  handlePageChange (page) {
    //  this.setState({ pageValue: temp })
    var index = 0
    for (var i = 0; i < this.props.pages.length; i++) {
      if (page.pageName === this.props.pages[i].pageName) {
        index = i
        break
      }
    }
    this.setState({
      pageValue: this.props.pages[index].pageId
    })
    console.log('handlePageChange', this.state.pageValue)
  }

  handleGenderChange (value) {
    var temp = value.split(',')
    this.setState({ genderValue: temp })
  }

  handleLocaleChange (value) {
    var temp = value.split(',')
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
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Create Survey Form</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='row'>
                <div
                  className='col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>
                    <div className='m-portlet__body'>
                      <div className='col-xl-12'>
                        <div className='form-group' id='titl'>
                          <label className='control-label'><h5>Title</h5></label>
                          <input className='form-control'
                            placeholder='Enter form title here' ref='title' />
                        </div>
                      </div>
                      <br />
                      <div className='col-xl-12'>
                        <div className='form-group' id='desc'>
                          <label className='control-label'><h5>Description</h5></label>
                          <textarea className='form-control'
                            placeholder='Enter form description here'
                            rows='3' ref='description' />
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
                      <br /><br />
                      <div className='add-options-message'>

                        <button className='btn btn-primary pull-right'
                          onClick={this.createSurvey}> Create Survey
                      </button>
                        <Link
                          to='/surveys'
                          style={{float: 'right', margin: 2}}
                          className='btn btn-border-think btn-transparent c-grey pull-right'>
                        Cancel
                      </Link>
                        <br />
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
                <div id='target' className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <h2 className='presentation-margin'>Targeting</h2>
                  <p>Select the type of customer you want to send survey to</p>
                  <div className='m-portlet__head-tools'>
                    <ul className='m-portlet__nav'>
                      <li onClick={this.showDropDown} className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                        <a className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                          Change Page
                        </a>
                        {
                          this.state.showDropDown &&
                          <div className='m-dropdown__wrapper'>
                            <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                            <div className='m-dropdown__inner'>
                              <div className='m-dropdown__body'>
                                <div className='m-dropdown__content'>
                                  <ul className='m-nav'>
                                    <li className='m-nav__section m-nav__section--first'>
                                      <span className='m-nav__section-text'>
                                    Connected Pages
                                      </span>
                                    </li>
                                    {
                                      this.props.pages.map((page, i) => (
                                        <li key={page.pageId} className='m-nav__item'>
                                          <a onClick={() => this.handlePageChange(page)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                            <span className='m-nav__link-text multiselect-selected-text'>
                                              {page.pageName}
                                            </span>
                                          </a>
                                        </li>
                                      ))
                                    }
                                    <li className='m-nav__separator m-nav__separator--fit' />
                                    <li className='m-nav__item'>
                                      <a onClick={() => this.hideDropDown} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                        Cancel
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          }
                      </li>
                    </ul>
                  </div>
                  <div className='col-lg-4 col-md-9 col-sm-12'>
											<select className='form-control m-select2' id='m_select2_9' name='param' multiple='' tabIndex='-1' aria-hidden='false'>
												<option>dsadsa</option>
												<optgroup label='Alaskan/Hawaiian Time Zone'>
													<option value='AK'>
														Alaska
													</option>
												</optgroup>
											</select>
                      <span className="select2 select2-container select2-container--default select2-container--focus select2-container--below" dir="ltr"><span className="selection"><span className="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabIndex="-1"><ul className="select2-selection__rendered"><li className="select2-search select2-search--inline"><input className="select2-search__field" type="search" tabIndex="0" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" role="textbox" aria-autocomplete="list" placeholder="" /></li></ul></span></span><span className="dropdown-wrapper" aria-hidden="true"></span></span>
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
