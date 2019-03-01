/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
import { editSurvey, loadCategoriesList, addCategory, loadSurveyDetails } from '../../redux/actions/templates.actions'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class createSurvey extends React.Component {
  constructor (props, context) {
    super(props, context)
    if (this.props.currentSurvey) {
      const id = this.props.currentSurvey._id
      props.loadSurveyDetails(id)
    }
    props.loadCategoriesList()
    this.state = {
      isShowingModal: false,
      questionType: 'multichoice',
      surveyQuestions: [],
      alertMessage: '',
      alertType: '',
      categoryValue: [],
      title: '',
      description: ''
    }
    this.createSurvey = this.createSurvey.bind(this)
    this.initializeCategorySelect = this.initializeCategorySelect.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.saveCategory = this.saveCategory.bind(this)
    this.exists = this.exists.bind(this)
    this.categoryExists = this.categoryExists.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Edit Survey`;
  }
  componentWillReceiveProps (nextprops) {
    console.log('nextprops', nextprops)
    if (nextprops.categories) {
      let options = []
      for (var j = 0; j < nextprops.survey.category.length; j++) {
        for (var i = 0; i < nextprops.categories.length; i++) {
          if (nextprops.categories[i].name === nextprops.survey.category[j]) {
            options.push({id: nextprops.categories[i]._id, text: nextprops.categories[i].name, selected: true})
          }
        }
      }
      for (var k = 0; k < nextprops.categories.length; k++) {
        if (this.exists(options, nextprops.categories[k]) === false) {
          options.push({id: nextprops.categories[k]._id, text: nextprops.categories[k].name})
        }
      }
      this.initializeCategorySelect(options)
    }
    if (nextprops.survey) {
      this.setState({title: nextprops.survey.title, description: nextprops.survey.description, categoryValue: nextprops.survey.category})
    }
    if (nextprops.questions) {
      this.setState({surveyQuestions: nextprops.questions})
    }
  }
  exists (options, category) {
    for (var i = 0; i < options.length; i++) {
      if (options[i].text === category.name) {
        return true
      }
    }
    return false
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  initializeCategorySelect (categoryOptions) {
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
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].label
          selected.push(selectedOption)
        }
        self.setState({ categoryValue: selected })
      }
    })
  }
  updateDescription (e) {
    this.setState({description: e.target.value})
  }
  updateTitle (e) {
    this.setState({title: e.target.value})
  }
  categoryExists (newCategory) {
    for (let i = 0; i < this.props.categories.length; i++) {
      if (this.props.categories[i].name.toLowerCase().includes(newCategory.toLowerCase())) {
        return true
      }
    }
    return false
  }
  saveCategory () {
    if (this.refs.newCategory.value) {
      if (this.categoryExists(this.refs.newCategory.value) === false) {
        let payload = {name: this.refs.newCategory.value}
        this.props.addCategory(payload, this.msg)
        this.props.loadCategoriesList()
      } else {
        this.msg.error('Category already exists')
      }
    } else {
      this.msg.error('Please enter a category')
    }
  }
  createSurvey (e) {
    e.preventDefault()
    let flag = 0
    // Checking if Description or Title is empty, and highlighting it
    if (this.state.title === '') {
      let incompleteTitle = document.getElementById('titl')
      incompleteTitle.classList.add('has-error')
      this.msg.error('Please add a title')
    } else if (this.state.description === '') {
      let completeTitle = document.getElementById('titl')
      completeTitle.classList.remove('has-error')
      let incompleteDesc = document.getElementById('desc')
      incompleteDesc.classList.add('has-error')
      this.msg.error('Please add a description')
    } else if (this.state.categoryValue.length === 0) {
      let completeTitle = document.getElementById('titl')
      completeTitle.classList.remove('has-error')
      let completeDesc = document.getElementById('desc')
      completeDesc.classList.remove('has-error')
      this.msg.error('Please select a category')
    } else if (this.state.surveyQuestions.length === 0) {
      let completeTitle = document.getElementById('titl')
      completeTitle.classList.remove('has-error')
      let completeDesc = document.getElementById('desc')
      completeDesc.classList.remove('has-error')
      this.msg.error('A survey form requires ateast one question')
    } else {
      for (let j = 0; j < this.state.surveyQuestions.length; j++) {
        if (this.state.surveyQuestions[j].options.length > 0) {
          for (let k = 0; k <
          this.state.surveyQuestions[j].options.length; k++) {
            if (this.state.surveyQuestions[j].statement === '') {
              let incompleteQuestion = document.getElementById('question' + j)
              incompleteQuestion.classList.add('has-error')
              flag = 1
              this.msg.error('Please add a statement')
              break
            } else if (this.state.surveyQuestions[j].options[k] === '') {
              let completeChoice = document.getElementById('question' + j)
              completeChoice.classList.remove('has-error')
              let incompleteChoice = document.getElementById('choice' + j + k)
              incompleteChoice.classList.add('has-error')
              flag = 1
              this.msg.error('Please add all the choices')
              break
            } else {
              let completeChoice = document.getElementById('choice' + j + k)
              completeChoice.classList.remove('has-error')
              flag = 0
            }
          }
        }
      }
      if (flag === 0 && this.state.title !== '' &&
        this.state.description !== '') {
        var surveybody = {
          survey: {
            _id: this.props.currentSurvey._id,
            title: this.state.title, // title of survey
            description: this.state.description,
            category: this.state.categoryValue
          },
          questions: this.state.surveyQuestions
        }
        this.props.editSurvey(surveybody, this.msg)
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
    if (surveyQuestions[qindex].options.length <= 2) {
      this.msg.error('Atleast 2 options are required for each question')
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
      this.msg.error('A survey form requires atleast one question')
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
    this.setState({surveyQuestions})
  }

  onhandleChoiceChange (qindex, choiceIndex, event) {
    let surveyQuestions = this.state.surveyQuestions.slice()
    surveyQuestions[qindex].options[choiceIndex] = event.target.value
    this.setState({surveyQuestions})
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
                      {this.state.surveyQuestions[i].options.length < 3 &&
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
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div style={{width: '100%'}}>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Edit Template Survey</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__body'>
                  <div className='col-xl-12'>
                    <div className='form-group' id='titl'>
                      <label className='control-label'><h5>Title</h5></label>
                      <input className='form-control'
                        value={this.state.title} onChange={(e) => this.updateTitle(e)} />
                    </div>
                  </div>
                  <br />
                  <div className='col-xl-12'>
                    <div className='form-group' id='desc'>
                      <label className='control-label'><h5>Description</h5></label>
                      <textarea className='form-control'
                        placeholder='Enter form description here'
                        rows='3' value={this.state.description} onChange={(e) => this.updateDescription(e)} />
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
                           Add category
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
                  <div className='col-sm-6 col-md-4'>
                    <button id='questions' className='btn btn-primary btn-sm'
                      onClick={this.addClick.bind(this)}> Add Questions
                  </button>
                  </div>
                  <br /><br />
                  <div className='add-options-message'>

                    <button className='btn btn-primary pull-right'
                      onClick={this.createSurvey}> Save
                  </button>
                    <Link
                      to='/templates'
                      style={{float: 'right', margin: 2}}
                      className='btn btn-border-think btn-transparent c-grey pull-right'>
                    Back
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
    )
  }
}

function mapStateToProps (state) {
  return {
    categories: (state.templatesInfo.categories),
    survey: (state.templatesInfo.survey),
    questions: (state.templatesInfo.questions),
    currentSurvey: (state.backdoorInfo.currentSurvey)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    editSurvey: editSurvey,
    loadCategoriesList: loadCategoriesList,
    addCategory: addCategory,
    loadSurveyDetails: loadSurveyDetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(createSurvey)
