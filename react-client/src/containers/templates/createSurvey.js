/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
import { createsurvey, loadCategoriesList, addCategory, deleteCategory } from '../../redux/actions/templates.actions'
import { Link } from 'react-router-dom'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class createSurvey extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadCategoriesList()
    this.state = {
      isShowingModal: false,
      isShowingModalDelete: false,
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
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.saveCategory = this.saveCategory.bind(this)
    this.removeCategory = this.removeCategory.bind(this)
    this.exists = this.exists.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Create Survey Template`;
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.categories) {
      let options = []
      for (var i = 0; i < nextprops.categories.length; i++) {
        options[i] = {id: nextprops.categories[i]._id, text: nextprops.categories[i].name}
      }
      this.initializeCategorySelect(options)
    }
    if (nextprops.warning) {
      this.msg.error(nextprops.warning)
    } else if (nextprops.surveyCreated) {
      this.props.history.push({
        pathname: '/templates'
      })
    }
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  showDialogDelete () {
    this.setState({isShowingModalDelete: true})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
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
  exists (newCategory) {
    for (let i = 0; i < this.props.categories.length; i++) {
      if (this.props.categories[i].name.toLowerCase().includes(newCategory.toLowerCase())) {
        return true
      }
    }
    return false
  }
  saveCategory () {
    if (this.refs.newCategory.value) {
      if (this.exists(this.refs.newCategory.value) === false) {
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
  removeCategory (c) {
    this.setState({isShowingModalDelete: false})
    this.props.deleteCategory(c._id, this.msg)
    this.props.loadCategoriesList()
  }
  createSurvey (e) {
    e.preventDefault()
    let flag = 0
    // Checking if Description or Title is empty, and highlighting it
    if (this.refs.title.value === '') {
      let incompleteTitle = document.getElementById('titl')
      incompleteTitle.classList.add('has-error')
      this.msg.error('Please add a title')
    } else if (this.refs.description.value === '') {
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
      if (flag === 0 && this.refs.title.value !== '' &&
        this.refs.description.value !== '' && this.state.categoryValue.length > 0) {
        var surveybody = {
          survey: {
            title: this.refs.title.value, // title of survey
            description: this.refs.description.value,
            category: this.state.categoryValue
          },
          questions: this.state.surveyQuestions
        }
        this.props.createsurvey(surveybody)
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
    if (surveyQuestions[qindex].choiceCount <= 2) {
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
    var choiceCount = this.state.surveyQuestions[qindex].choiceCount
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
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
              className='m-form m-form--label-align-right'>
              <div className='row align-items-center'>
                <div className='col-xl-8 order-2 order-xl-1' />
                <div
                  className='col-xl-4 order-1 order-xl-2 m--align-right'>
                  {/*
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
                  */}
                  {/*
                    this.state.isShowingModalDelete &&
                    <ModalContainer style={{width: '500px', marginTop: '100px'}}
                      onClose={this.closeDialogDelete}>
                      <ModalDialog style={{width: '500px', marginTop: '100px'}}
                        onClose={this.closeDialogDelete}>
                        {this.props.categories.map((d) => (
                          <div className='form-group m-form__group'>

                            <div className='m-input-icon m-input-icon--left m-input-icon--right'>
                              <input type='text' className='form-control m-input m-input--pill m-input--air' value={d.name} readOnly />
                              <span className='m-input-icon__icon m-input-icon__icon--right' onClick={() => this.removeCategory(d)}>
                                <span>
                                  <i className='fa fa-times' />
                                </span>
                              </span>
                            </div>
                          </div>
              ))}
                      </ModalDialog>
                    </ModalContainer>
                  */}
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
                          <select id='selectcategory' style={{width: '50px'}} />
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
                  <br />
                  {this.state.alertMessage !== '' &&
                  <center>
                    <Alert type={this.state.alertType}>
                      {this.state.alertMessage}
                    </Alert>
                  </center>

                }

                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px', 'marginBottom': '25px'}}>
                    <button className='btn btn-primary'
                      onClick={this.createSurvey}> Create Survey
                    </button>
                    <Link
                      to='/templates'
                      className='btn btn-secondary' style={{'margin-left': '10px'}}>
                      Cancel
                    </Link>
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
    categories: (state.templatesInfo.categories),
    surveyCreated: (state.templatesInfo.surveyCreated),
    warning: (state.templatesInfo.warning)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createsurvey: createsurvey,
    loadCategoriesList: loadCategoriesList,
    addCategory: addCategory,
    deleteCategory: deleteCategory
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(createSurvey)
