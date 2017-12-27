/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
import { createsurvey, loadCategoriesList, addCategory } from '../../redux/actions/templates.actions'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class createSurvey extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadCategoriesList()
    this.state = {
      isShowingModal: false,
      questionType: 'multichoice',
      surveyQuestions: [],
      alertMessage: '',
      alertType: '',
      categoryValue: []
    }
    this.createSurvey = this.createSurvey.bind(this)
    this.initializeCategorySelect = this.initializeCategorySelect.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.saveCategory = this.saveCategory.bind(this)
  }

  componentDidMount () {
    document.title = 'KiboPush | Create Survey'
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.categories) {
      console.log('categories', nextprops.categories)
      let options = []
      for (var i = 0; i < nextprops.categories.length; i++) {
        options[i] = {id: nextprops.categories[i]._id, text: nextprops.categories[i].name}
      }
      this.initializeCategorySelect(options)
    }
  }
  showDialog () {
    console.log('in showDialog')
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  initializeCategorySelect (categoryOptions) {
    console.log('asd', categoryOptions)
    var self = this
    /* eslint-disable */
    $('#selectcategory').select2({
      /* eslint-enable */
      data: categoryOptions,
      placeholder: 'Select Category',
      allowClear: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectcategory').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        console.log('selected options', e.target.selectedOptions)
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].label
          selected.push(selectedOption)
        }
        self.setState({ categoryValue: selected })
      }
      console.log('change category', selected)
    })
  }
  saveCategory () {
    if (this.refs.newCategory.value) {
      let payload = {name: this.refs.newCategory.value}
      this.props.addCategory(payload, this.msg)
      this.props.loadCategoriesList()
    }
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
      if (flag === 0 && this.refs.title.value !== '' &&
        this.refs.description.value !== '') {
        console.log('category', this.state.categoryValue)
        var surveybody = {
          survey: {
            title: this.refs.title.value, // title of survey
            description: this.refs.description.value,
            category: this.state.categoryValue
          },
          questions: this.state.surveyQuestions
        }
        this.props.createsurvey(surveybody)
        this.props.history.push({
          pathname: '/templates'
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
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Create Template Survey</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>

              <div className='row'>
                <div
                  className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div
                      className='col-xl-4 order-1 order-xl-2 m--align-right'>
                      {
                        this.state.isShowingModal &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialog}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialog}>
                            <h3>Add Category</h3>
                            <input className='form-control'
                              placeholder='Enter category' ref='newCategory' />
                            <br />
                            <button style={{float: 'right'}}
                              className='btn btn-primary btn-sm'
                              onClick={() => {
                                this.closeDialog()
                                this.saveCategory()
                              }}>Save
                            </button>
                          </ModalDialog>
                        </ModalContainer>
                      }
                      <div
                        className='m-separator m-separator--dashed d-xl-none' />
                    </div>
                  </div>
                </div>
                <div
                  className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
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
                        <div className='form-group' id='desc'>
                          <label className='control-label'><h5>Category</h5></label>
                          <div className='m-form'>
                            <div className='form-group m-form__group'>
                              <select id='selectcategory' />
                              <button onClick={this.showDialog} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' style={{marginLeft: '15px'}}>
                               + Add category
                             </button>
                            </div>
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
                      <br /><br />
                      <div className='add-options-message'>

                        <button className='btn btn-primary pull-right'
                          onClick={this.createSurvey}> Create Survey
                      </button>
                        <Link
                          to='/templates'
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
    categories: (state.templatesInfo.categories)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createsurvey: createsurvey,
    loadCategoriesList: loadCategoriesList,
    addCategory: addCategory
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(createSurvey)
