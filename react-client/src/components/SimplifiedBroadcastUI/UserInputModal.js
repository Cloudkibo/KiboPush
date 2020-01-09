import React from 'react'
import { Popover, PopoverBody } from 'reactstrap'
import UserInputActions from './UserInputActions'
// import CustomFields from '../customFields/customfields'
import { loadCustomFields } from '../../redux/actions/customFields.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class UserInputModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      edited: false,
      action: props.action ? props.action : null,
      questions: props.questions ? props.questions : 
        [{
            id: new Date().getTime(), 
            question: '', 
            type: '',
            incorrectTriesAllowed: 3, 
            skipButtonText: 'Skip', 
            retryMessage: ''
        }]
    }
    console.log('messengerAdPayloads', this.state.messengerAdPayloads)
    console.log('UserInputModal initial state', this.state)
    this.toggleUserOptions = this.toggleUserOptions.bind(this)
    this.getName = this.getName.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setReplyType = this.setReplyType.bind(this)
    this.setQuestion = this.setQuestion.bind(this)
    this.addQuestion = this.addQuestion.bind(this)
    this.updateActionStatus = this.updateActionStatus.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.checkDisabled = this.checkDisabled.bind(this)
    this.onLoadCustomFields = this.onLoadCustomFields.bind(this)
    this.incorrectTriesAllowedChange = this.incorrectTriesAllowedChange.bind(this)
    this.skipButtonTextChange = this.skipButtonTextChange.bind(this)
    this.retryMessageChange = this.retryMessageChange.bind(this)
    this.saveGoogleSheet = this.saveGoogleSheet.bind(this)
    this.savehubSpotForm = this.savehubSpotForm.bind(this)
    this.saveCustomFieldsAction = this.saveCustomFieldsAction.bind(this)
    this.removeAction = this.removeAction.bind(this)
    this.getCustomFieldType = this.getCustomFieldType.bind(this)
    this.validateCustomFieldType = this.validateCustomFieldType.bind(this)
    this.validateCustomFieldTypes = this.validateCustomFieldTypes.bind(this)
    this.props.loadCustomFields()
  }

  removeAction () {
    this.setState({action: null})
  }

  saveGoogleSheet (googleSheet) {
      this.setState({
        action: {
            type: 'google_sheets',
            ...googleSheet
        }
    })
  }

  savehubSpotForm(hubSpotFormPayload) {
    this.setState({
      action: {
          type: 'hubspot',
          ...hubSpotFormPayload
        }
     })
  }

  saveCustomFieldsAction (customFields) {
    this.setState({
      action: {
          type: 'custom_fields',
          ...customFields
        }
     })
  }

  retryMessageChange (e, index) {
    let questions = this.state.questions
    questions[index].retryMessage = e.target.value
    this.setState({questions, edited: true})
  }

  skipButtonTextChange (e, index) {
    let questions = this.state.questions
    questions[index].skipButtonText = e.target.value
    this.setState({questions, edited: true})
  }

  incorrectTriesAllowedChange (e, index) {
      let questions = this.state.questions
      questions[index].incorrectTriesAllowed = e.target.value
      this.setState({questions, edited: true})
  }

  onLoadCustomFields (customFields) {
    this.setState({customFields})
  }

  checkDisabled () {
    if (!this.state.action) {
      return true
    }
    for (let i = 0; i < this.state.questions.length; i++) {
      let question = this.state.questions[i]
      if (!question.question || !question.type) {
          return true
      }
      if (question.type !== 'text') {
        if (!question.skipButtonText || !question.retryMessage) {
            return true
        }
      }
    }
  }

  scrollParentToChild(parent, child) {
    let parentRect = parent.getBoundingClientRect();
    let childRect = child.getBoundingClientRect();
    parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top - 20
  }

  scrollToTopPreview (elementId) {
    console.log('scrollToTopPreview', elementId)
    this.scrollParentToChild(document.getElementById('userInputPreview'), document.getElementById(elementId))
  }

  scrollToTop(elementId) {
    document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' })
  }

  addQuestion () {
    let questions = this.state.questions
    questions.push({
        id: new Date().getTime(),
        question: '', 
        type: '', 
        incorrectTriesAllowed: 3, 
        skipButtonText: 'Skip', 
        retryMessage: ''
    })
    this.setState({questions, edited: true}, () => {
      this.scrollToTopPreview(`question-preview${questions.length}`)
      this.scrollToTop(`question-heading${questions.length}`)
    })
  }

  setQuestion (e, index) {
    let questions = this.state.questions
    questions[index].question = e.target.value
    this.setState({questions, edited: true}, () => {
        this.scrollToTopPreview(`question-preview${index+1}`)
        this.updateQuestionAction(questions[index])
    })
  }

  updateQuestionAction (question) {
    if (this.state.action) {
      let action = this.state.action
      for (let i = 0; i < action.mapping.length; i++) {
        if (action.mapping[i].id === question.id) {
          action.mapping[i] = Object.assign(action.mapping[i], question)
        }
      }
      this.setState({action})
    }
  }

  setReplyType (e, index) {
      let questions = this.state.questions
      questions[index].type = e.target.value
      if (e.target.value === 'text') {
        questions[index].retryMessage = 'Please enter some valid text'
      } else if (e.target.value === 'number') {
        questions[index].retryMessage = 'Please enter a number. Use digits only.'
      } else if (e.target.value === 'email') {
        questions[index].retryMessage = 'Please enter a valid email address. e.g. me@mail.com'
      } else if (e.target.value === 'phoneNumber') {
        questions[index].retryMessage = "Please enter a correct phone number starting with '+'"
      } else if (e.target.value === 'url') {
        questions[index].retryMessage = "Please enter a correct website address e.g. kibopush.com"
      }
      this.setState({questions, edited: true}, () => {
        if (this.state.action) {
          this.updateQuestionAction(questions[index])
          this.validateCustomFieldTypes()
        }
      })
  }

  validateCustomFieldType (question, customFieldId) {
    if (customFieldId) {
      let customFieldType = this.getCustomFieldType(customFieldId)
      return (question.type === 'number' && customFieldType === question.type) || (customFieldType === 'text' && question.type !== 'number')
    }
  }

  getCustomFieldType (customFieldId) {
    console.log('getCustomFieldType', customFieldId)
    if (customFieldId && this.props.customFields) {
      return this.props.customFields.find(cf => cf._id === customFieldId).type
    }
  }

  validateCustomFieldTypes () {
    debugger;
    let action = this.state.action
    let mappingDataChanged = false
    for (let i = 0; i < action.mapping.length; i++) {
      if (action.mapping[i].customFieldId) {
        if (!this.validateCustomFieldType(action.mapping[i], action.mapping[i].customFieldId)) {
          mappingDataChanged = true
          action.mapping[i].customFieldId = ''
        }
      }
    }
    if (mappingDataChanged) {
      this.setState({action})
    }
  }

  toggleUserOptions() {
    this.setState({ showUserOptions: !this.state.showUserOptions })
  }

  getName(e, index, name) {
    console.log('getName', name)
    let questions = this.state.questions
    let currentQuestion = this.state.questions[index].question
    questions[index].question = currentQuestion + ((currentQuestion && currentQuestion.length > 0) ? ` {{${name}}}` : `{{${name}}}`)
    this.setState({ questions, showUserOptions: false })
  }

  addComponent() {
    console.log('addComponent in UserInputModal', this.props)
    this.props.addComponent({
      id: this.props.id >= 0 ? this.props.id : null,
      componentType: 'userInput',
      componentName: 'User Input',
      questions: this.state.questions,
      action: this.state.action
    }, this.props.edit)
  }

  closeModal() {
    if (!this.state.edited) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
  }

  updateActionStatus (action) {
    this.setState({action})
  }

  UNSAFE_componentWillUnmount() {
    this.props.closeModal()
  }

  render() {
    console.log('UserInputModal state', this.state)
    return (
      <div className="modal-content" style={{width: '72vw'}}>
        <div style={{ display: 'block' }} className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            User Input
					</h5>
          <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" aria-label="Close" onClick={this.closeModal}>
            <span aria-hidden="true">
              &times;
            </span>
          </button>
        </div>
        <div style={{ color: 'black' }} className="modal-body">
          <div className='row'>
            <div className='col-6'>
                <div style={{ maxHeight: '55vh', overflowY: 'scroll', overflowX: 'hidden', paddingRight: '10px' }}>
                {
                    this.state.questions.map((question, index) => {
                        return (
                        <div>
                            <h5 id={`question-heading${index+1}`}>{`Question #${index+1} for User:`}</h5>
                            <textarea placeholder={'Please type here...'} value={question.question} style={{ maxWidth: '100%', minHeight: '100px', borderColor: question.question === '' ? 'red' : '' }} onChange={(event) => this.setQuestion(event, index)} className='form-control' />
                            {(!this.props.hideUserOptions) &&
                            <div className='m-messenger__form-tools pull-right messengerTools' style={{ backgroundColor: '#F1F0F0', marginTop: '-25px', marginRight: '2px' }}>
                                <div id='userOptions' data-tip='options' style={{ display: 'inline-block', float: 'left' }}>
                                <i onClick={this.toggleUserOptions} style={{
                                    height: '24px',
                                    width: '24px',
                                    position: 'relative',
                                    display: 'inline-block',
                                    cursor: 'pointer'
                                }}>
                                    <i className='greetingMessage fa fa-user' style={{
                                    fontSize: '20px',
                                    left: '0px',
                                    width: '100%',
                                    height: '2em',
                                    textAlign: 'center',
                                    color: 'rgb(120, 120, 120)'
                                    }} />
                                </i>
                                </div>
                            </div>
                            }
                            {(!this.props.hideUserOptions) &&
                            <Popover container={document.getElementsByClassName('narcissus_17w311v')[0]} placement='left' isOpen={this.state.showUserOptions} className='greetingPopover' target='userOptions' toggle={this.toggleUserOptions}>
                                <PopoverBody>
                                <div className='col-12 nameOptions' onClick={(e) => this.getName(e, index, 'user_first_name')}>First Name</div>
                                <div className='col-12 nameOptions' onClick={(e) => this.getName(e, index, 'user_last_name')}>Last Name</div>
                                <div className='col-12 nameOptions' onClick={(e) => this.getName(e, index, 'user_full_name')}>Full Name</div>
                                </PopoverBody>
                            </Popover>
                            }
                            <div style={{ marginBottom: '20px', color: 'red' }}>{question.question === '' ? '*Required' : ''}</div>
            
                            <h6>Reply Type:</h6>
                                <div className='row'>
                                    <div className='col-6'>
                                        <select value={question.type} style={{borderColor: !question.type  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.setReplyType(event, index)}>
                                            <option value={''} disabled>Select a Reply Type</option>
                                            <option value={'text'}>{'Text'}</option>
                                            <option value={'number'}>{'Number'}</option>
                                            <option value={'email'}>{'Email'}</option>
                                            <option value={'phoneNumber'}>{'Phone Number'}</option>    
                                            <option value={'url'}>{'URL'}</option>                                       
                                        </select>
                                        <div style={{color: 'red', textAlign: 'left', marginBottom: '20px'}}>{!question.type ? '*Required' : ''}</div>
                                    </div>
                                </div>
                        {
                        question.type &&
                        <div>
                            <h6>Number of incorrect tries allowed:</h6>              
                            <div className='row'>
                                <div className='col-6'>
                                <input style={{marginBottom: '20px'}} type='number' min='0' step='1' value={question.incorrectTriesAllowed} className='form-control' onChange={(event) => this.incorrectTriesAllowedChange(event, index)} />
                                </div>
                            </div>

                            <h6>"Skip" button text:</h6>      
                            <div className='row'>
                                <div className='col-6'>
                                    <input maxLength='21' style={{borderColor: question.skipButtonText === '' ? 'red' : ''}} type='text' className='form-control m-input' value={question.skipButtonText} onChange={(e) => this.skipButtonTextChange(e, index)} />
                                    <div style={{color: 'red', textAlign: 'left', marginBottom: '20px'}}>{!question.skipButtonText ? '*Required' : ''}</div>
                                </div>
                            </div>

                            <h6>Retry message if user gives incorrect response:</h6>      
                            <div className='row'>
                                <div className='col-12'>
                                    <textarea style={{minHeight: '50px', maxHeight: '100px', borderColor: question.retryMessage === '' ? 'red' : ''}} type='text' className='form-control m-input' value={question.retryMessage} onChange={(e) => this.retryMessageChange(e, index)} />
                                    <div style={{color: 'red', textAlign: 'left', marginBottom: index === this.state.questions.length-1 ? '10px' : '20px'}}>{!question.retryMessage ? '*Required' : ''}</div>
                                </div>
                            </div>
                        </div>
                        }
                        <hr style={{marginBottom: '20px', marginTop: '10px', backgroundColor: 'darkgray'}}/>
                    </div>)
                    })
                }
                  <UserInputActions
                    required
                    customFields={this.props.customFields}
                    saveGoogleSheet={this.saveGoogleSheet}
                    savehubSpotForm={this.savehubSpotForm}
                    saveCustomFieldsAction={this.saveCustomFieldsAction}
                    removeAction={this.removeAction}
                    action={this.state.action}
                    questions={this.state.questions}
                    toggleGSModal={this.props.toggleGSModal}
                    closeGSModal={this.props.closeGSModal}
                    updateActionStatus={this.updateActionStatus} />
                </div>
                <hr style={{marginBottom: '20px', marginTop: '10px', backgroundColor: 'darkgray'}}/>
                <div>
                  {
                    <div onClick={this.addQuestion} className='ui-block hoverborder' style={{borderColor: "#3379B7", minHeight: '30px', width: '100%', marginLeft: '0px', marginBottom: '30px' }} >
                      <div style={{ paddingTop: '5px' }} className='align-center'>
                        <h6 style={{color: "#3379B7"}}> + Add Question </h6>
                      </div>
                    </div>
                  }
                </div>
            </div>
            <div className='col-1'>
              <div style={{ minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)' }} />
            </div>
            <div className='col-5'>
              <h4 style={{ marginLeft: '-50px' }}>Preview:</h4>
              <div id='userInputPreview' className='ui-block' style={{ overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '68vh', maxHeight: '68vh', marginLeft: '-50px' }} >
                {
                    this.state.questions.map((question, index) => {
                        return (
                            <div>
                                <div id={`question-preview${index+1}`} className='discussion' style={{ display: 'inline-block', marginTop: index === 0 ? '100px' : '0' }} >
                                    <div style={{ maxWidth: '100%', fontSize: '16px' }} className='bubble recipient'>{question.question}</div>
                                </div>
                                <div style={{marginLeft: '5%', marginTop: '30px', marginBottom: '50px', width: '90%', height: '12px', borderBottom: '1px solid lightgray', textAlign: 'center'}}>
                                    <span style={{color: 'dimgray', backgroundColor: 'white', padding: '0 5px'}}>
                                        Waiting for a reply from the user
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
              </div>
            </div>
            <div className='col-6' style={{ marginTop: '-5vh' }}>
              <div className='pull-right'>
                <button onClick={this.closeModal} className='btn btn-primary' style={{ marginRight: '20px'}}>
                  Cancel
                </button>
                <button disabled={this.checkDisabled()} onClick={() => this.addComponent()} className='btn btn-primary'>
                  {this.props.edit ? 'Edit' : 'Next'}
                </button>
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
    customFields: (state.customFieldInfo.customFields)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadCustomFields: loadCustomFields
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UserInputModal)
