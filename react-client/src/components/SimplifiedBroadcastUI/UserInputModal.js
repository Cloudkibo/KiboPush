import React from 'react'
import { Popover, PopoverBody } from 'reactstrap'
import AddAction from './AddAction'

class UserInputModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action: null,
      questions: [{question: '', replyType: '', customField: ''}],
      text: props.text ? props.text : '',
      buttons: props.buttons.map(button => { return { visible: true, title: button.title } }),
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'],
      buttonLimit: 3,
      buttonDisabled: false,
      messengerAdPayloads: this.props.buttons.map((button) => button.payload).filter(button => !!button)
    }
    console.log('messengerAdPayloads', this.state.messengerAdPayloads)
    console.log('UserInputModal initial state', this.state)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.toggleUserOptions = this.toggleUserOptions.bind(this)
    this.getName = this.getName.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setReplyType = this.setReplyType.bind(this)
    this.setCustomField = this.setCustomField.bind(this)
    this.setQuestion = this.setQuestion.bind(this)
    this.addQuestion = this.addQuestion.bind(this)
    this.updateActionStatus = this.updateActionStatus.bind(this)

    this.questionLimit = 10
  }

  addQuestion () {
    let questions = this.state.questions
    questions.push({question: '', replyType: '', customField: ''})
    this.setState({questions})
  }

  setQuestion (e, index) {
    let questions = this.state.questions
    questions[index].question = e.target.value
    this.setState({questions})
}

  setReplyType (e, index) {
      let questions = this.state.questions
      questions[index].replyType = e.target.value
      this.setState({questions})
  }
  
  setCustomField (e, index) {
    let questions = this.state.questions
    questions[index].customField = e.target.value
    this.setState({questions})
  }

  toggleUserOptions() {
    this.setState({ showUserOptions: !this.state.showUserOptions })
  }

  getName(e, name) {
    console.log('getName', name)
    let message = this.state.text + ((this.state.text && this.state.text.length > 0) ? ` {{${name}}}` : `{{${name}}}`)
    this.setState({ text: message, showUserOptions: false })
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value, edited: true })
  }

  updateButtonStatus(status) {
    status.edited = true
    this.setState(status)
  }

  handleDone() {
    this.addComponent([])
  }

  addComponent(buttons) {
    console.log('addComponent in UserInputModal', this.props)

    this.props.addComponent({
      id: this.props.id >= 0 ? this.props.id : null,
      componentType: 'text',
      text: this.state.text,
      buttons: [],
      deletePayload: null
    }, this.props.edit)
  }

  closeModal() {
    if (!this.state.edited || (this.state.text === '' && this.state.buttons.length === 0)) {
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
                            <h5>{`Question #${index+1} for User:`}</h5>
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
                                <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_first_name')}>First Name</div>
                                <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_last_name')}>Last Name</div>
                                <div className='col-12 nameOptions' onClick={(e) => this.getName(e, 'user_full_name')}>Full Name</div>
                                </PopoverBody>
                            </Popover>
                            }
                            <div style={{ marginBottom: '20px', color: 'red' }}>{question.question === '' ? '*Required' : ''}</div>
            
                            <h6>Reply Type:</h6>
                                <div className='row'>
                                    <div className='col-6'>
                                        <select value={question.replyType} style={{borderColor: !question.replyType  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.setReplyType(event, index)}>
                                            <option value={''} disabled>Select a Reply Type</option>
                                            {/* {
                                                this.props.sequences.map((sequence, index) => {
                                                    return (
                                                        <option key={index} value={sequence.sequence._id}>{sequence.sequence.name}</option>
                                                    )
                                                })
                                            } */}
                                            <option value={'text'}>{'Text'}</option>
                                            <option value={'number'}>{'Number'}</option>
                                            <option value={'email'}>{'Email'}</option>                                    
                                        </select>
                                        <div style={{color: 'red', textAlign: 'left', marginBottom: '20px'}}>{!question.replyType ? '*Required' : ''}</div>
                                    </div>
                                </div>

            
                        <h6>Save response to a Custom Field:</h6>              
                            <div className='row'>
                                <div className='col-6'>
                                    <select value={question.customField} style={{borderColor: !question.customField  ? 'red' : ''}} className='form-control m-input' onChange={(event) => this.setReplyType(event, index)}>
                                        <option value={''} disabled>Select a Custom Field</option>
                                        {/* {
                                            this.props.sequences.map((sequence, index) => {
                                                return (
                                                    <option key={index} value={sequence.sequence._id}>{sequence.sequence.name}</option>
                                                )
                                            })
                                        } */}
                                        <option value={'city'}>{'city'}</option>
                                        <option value={'school'}>{'school'}</option>
                                        <option value={'profession'}>{'profession'}</option>                                    
                                    </select>
                                    <div style={{color: 'red', textAlign: 'left', marginBottom: index === this.state.questions.length-1 ? '10px' : '20px'}}>{!question.customField ? '*Required' : ''}</div>
                            </div>
                        </div>
                        <hr style={{marginBottom: '20px', marginTop: '10px', backgroundColor: 'darkgray'}}/>
                    </div>)
                    })
                }

                    <AddAction
                        edit={this.props.edit}
                        default_action={this.state.default_action}
                        webviewurl={this.state.webviewurl}
                        webviewsize={this.state.webviewsize}
                        elementUrl={this.state.elementUrl}
                        updateActionStatus={this.updateActionStatus} />
                </div>
                <hr style={{marginBottom: '20px', marginTop: '10px', backgroundColor: 'darkgray'}}/>
                <div>
                  {
                    (this.state.questions.length < this.questionLimit) && <div className='ui-block hoverborder' style={{borderColor: "#3379B7", minHeight: '30px', width: '100%', marginLeft: '0px', marginBottom: '30px' }} >
                      <div onClick={this.addQuestion} style={{ paddingTop: '5px' }} className='align-center'>
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
              <div className='ui-block' style={{ overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '68vh', maxHeight: '68vh', marginLeft: '-50px' }} >
                {
                    this.state.questions.map((question) => {
                        return (
                            <div>
                                <div className='discussion' style={{ display: 'inline-block', marginTop: '100px' }} >
                                    <div style={{ maxWidth: '100%', fontSize: '16px' }} className='bubble recipient'>{question.question}</div>
                                </div>
                                <div style={{marginLeft: '5%', marginTop: '30px', width: '90%', height: '12px', borderBottom: '1px solid lightgray', textAlign: 'center'}}>
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
                <button disabled={!this.state.text || this.state.buttonDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
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

export default UserInputModal
