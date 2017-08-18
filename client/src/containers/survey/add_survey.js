/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import { createsurvey } from '../../redux/actions/surveys.actions'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
class AddSurvey extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      questionType: 'multichoice',
      surveyQuestions: [],
      showAlert: false,
      alertmsg: '',
      timeout: 2000
    }
    // surveyQuestions will be an array of json object
    // each json object will have following keys:
    // statement : //value of question
    // type: //text or multichoice
    // choiceCount: //no of options
    // options: [] array of choice values
    this.createSurvey = this.createSurvey.bind(this)
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
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.createwarning) {
      console.log('i am called')
      this.props.history.push({
        pathname: '/surveys'

      })
    }
  }

  createSurvey (e) {
    e.preventDefault()
    let flag = 0
    if (this.state.surveyQuestions.length === 0) {
      this.setState({
        showAlert: true,
        alertmsg: 'A survey form requires atleast one question'
      })
    } else {
      for (let j = 0; j < this.state.surveyQuestions.length; j++) {
        if (this.state.surveyQuestions[j].options.length > 0) {
          for (let k = 0; k <
          this.state.surveyQuestions[j].options.length; k++) {
            if (this.state.surveyQuestions[j].options[k] === '') {
              flag = 1
              console.log('empty')
              break
            }
          }
        }
        if (flag === 1) {
          break
        }
      }
      if (flag === 0 && this.refs.title.value !== '' &&
        this.refs.description.value !== '') {
        var surveybody = {
          survey: {
            title: this.refs.title.value, // title of survey
            description: this.refs.description.value, // description of survey
            image: '' // image url
          },
          questions: this.state.surveyQuestions
        }
        this.props.createsurvey(surveybody)
        this.props.history.push({
          pathname: '/surveys'
        })
      } else {
        // alert('Please fill all the fields.')
        this.setState(
          {showAlert: true, alertmsg: 'Please fill all the fields.'})
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
      this.setState({showAlert: false, alertmsg: ''})
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
      this.setState({showAlert: false, alertmsg: ''})
    }
    this.setState({surveyQuestions})
  }

  onDismissAlert () {
    this.setState({showAlert: false, alertmsg: ''})
  }

  removeChoices (choiceIndex, qindex) {
    console.log(
      'removeChoices called qindex ' + qindex + ' choiceIndex ' + choiceIndex)
    let surveyQuestions = this.state.surveyQuestions.slice()
    if (surveyQuestions[qindex].choiceCount === 2) {
      this.setState({
        showAlert: true,
        alertmsg: 'Atleast 2 options are required for each question'
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
    if (this.state.surveyQuestions.length == 1) {
      console.log('A survey form requires atleast one question');
      this.setState({
        showAlert: true,
        alertmsg: 'A survey form requires atleast one question'
      })
    } else {
      console.log('delete this survey question');
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
        <div className='input-group'>
          <input type='text' placeholder={'Choice' + (j + 1)}
            className='form-control input-sm'
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

  createUI () {
    let uiItems = []
    for (let i = 0; i < this.state.surveyQuestions.length; i++) {
      if (this.state.surveyQuestions[i].type === 'text') {
        uiItems.push(
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <br />
            <div className='panel panel-default field-editor'>
              <div className='panel-heading clearfix'>
                <strong className='panel-title'>Edit Question {i} </strong>
                <div role='toolbar' className='pull-right btn-toolbar'>
                  <a className='remove'
                    onClick={this.removeClick.bind(this, i)}>
                    <span className='fa fa-times' />
                  </a>
                </div>
              </div>
              <div className='panel-body'>
                <div className='form-group'>
                  <input className='form-control'
                    placeholder='Enter question here...'
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
                <strong className='panel-title'>Edit Question {i}</strong>
                <div role='toolbar' className='pull-right btn-toolbar'>
                  <a className='remove'
                    onClick={this.removeClick.bind(this, i)}>
                    <span className='fa fa-times' />
                  </a>
                </div>
              </div>
              <div className='panel-body'>
                <div className='form-group'>
                  <input className='form-control'
                    placeholder='Enter question here...'
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
                      <div className='col-sm-6 col-md-4'>
                        <button className='btn btn-secondary btn-sm'
                          onClick={this.addChoices.bind(this, i)}> Add
                          Choices
                        </button>
                      </div>
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
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />

          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2 className='presentation-margin'>Create Survey Form</h2>
            <div className='ui-block'>
              <div className='news-feed-form'>

                <div className='tab-content'>
                  <div className='tab-pane active' id='home-1' role='tabpanel'
                    aria-expanded='true'>

                    <div className='col-xl-12'>
                      <div className='form-group'>
                        <label className='control-label'>Title</label>
                        <input className='form-control'
                          placeholder='Enter form title here' ref='title' />
                      </div>
                    </div>
                    <br />
                    <div className='col-xl-12'>
                      <div className='form-group'>
                        <label className='control-label'>Description</label>
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
                      <button className='btn btn-secondary btn-sm'
                        onClick={this.addClick.bind(this)}> Add Questions
                      </button>
                    </div>
                    <div className='add-options-message'>

                      <button className='btn btn-secondary'
                        onClick={this.createSurvey}> Create Survey
                      </button>
                      <button
                        className='btn btn-border-think btn-transparent c-grey'>
                        Cancel
                      </button>
                    </div>
                    {this.state.showAlert === true &&
                    <center>
                      <Alert type='danger' timeout={this.state.timeout}
                        onDismiss={this.onDismissAlert.bind(this)}>
                        {this.state.alertmsg}
                      </Alert>
                    </center>

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

function mapStateToProps (state) {
  console.log(state)
  return {
    surveys: (state.surveysInfo.surveys)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({createsurvey: createsurvey}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddSurvey)
