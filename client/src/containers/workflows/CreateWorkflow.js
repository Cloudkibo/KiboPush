/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import {
  addWorkFlow,
  loadWorkFlowList,
  clearAlertMessages
} from '../../redux/actions/workflows.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import {
  getuserdetails,
  workflowsTourCompleted
} from '../../redux/actions/basicinfo.actions'
import { Alert } from 'react-bs-notifier'

class CreateWorkflow extends React.Component {
  constructor (props) {
    super(props)
    props.getuserdetails()
    props.clearAlertMessages()
    this.gotoWorkflow = this.gotoWorkflow.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.changeKeywords = this.changeKeywords.bind(this)
    this.changeReply = this.changeReply.bind(this)
    this.changeActive = this.changeActive.bind(this)
    this.state = {
      condition: 'message_is',
      keywords: [],
      reply: '',
      isActive: 'Yes',
      steps: [],
      alertMessage: '',
      alertType: ''
    }
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
    this.tourFinished = this.tourFinished.bind(this)
  }

  componentDidMount () {
    document.title = 'KiboPush | Create Workflows'

    this.addSteps([
      {
        title: 'Workflows',
        text: `Workflows allow you to automatically respond to messages to your page, which meet a certain criteria`,
        selector: 'div#workflow',
        position: 'top-left',
        type: 'hover',
        isFixed: true
      },
      {
        title: 'Keywords',
        text: `Keywords are the specific strings, on which you want a particular action to take place `,
        selector: 'div#keywords',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true
      },
      {
        title: 'Rules',
        text: 'Rules are applied on the message recieved together with the given keyword, to trigger the auto-reply',
        selector: 'div#rules',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true
      },
      {
        title: 'Reply',
        text: 'Here you can write the automated message that get sent if above conditions are met',
        selector: 'div#reply',
        position: 'bottom-left',
        type: 'hover',
        isFixed: true
      }
    ])
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.successMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        alertType: 'success'
      })
    } else if (nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.errorMessage,
        alertType: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        alertType: ''
      })
    }
  }

  gotoWorkflow () {
    if (this.state.keywords.length === 0) {
      this.setState({
        alertMessage: 'Please fill the keywords field',
        alertType: 'danger'
      })
      return
    }
    if (this.state.reply === '') {
      this.setState({
        alertMessage: 'Please fill the reply field',
        alertType: 'danger'
      })
      return
    }

    this.props.addWorkFlow({
      condition: this.state.condition,
      keywords: this.state.keywords,
      reply: this.state.reply,
      isActive: this.state.isActive
    })
    // this.props.history.push({
    //   pathname: '/workflows'
    // })
  }

  changeCondition (event) {
    this.setState({condition: event.target.value})
  }

  changeKeywords (event) {
    this.setState({keywords: event.target.value.split(',')})
  }

  changeReply (event) {
    this.setState({reply: event.target.value})
  }

  changeActive (event) {
    this.setState({isActive: event.target.value})
  }

  tourFinished (data) {
    if (data.type === 'finished') {
      this.props.workflowsTourCompleted({
        'workFlowsTourSeen': true
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
        {
          (this.props.user && this.props.user.workFlowsTourSeen) &&
          <Joyride ref='joyride' run steps={this.state.steps} scrollToSteps
            debug={false} type={'continuous'}
            callback={this.tourFinished} showStepsProgress
            showSkipButton />
        }
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Create Workflow</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div
                className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
                role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  Define good rules for your workflow
                </div>
              </div>
              <div id='workflow' className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Form
                      </h3>
                    </div>
                  </div>
                </div>
                <form className='m-form m-form--label-align-right'>
                  <div className='m-portlet__body'>
                    <div className='m-form__section m-form__section--first'>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Rule
                        </label>
                        <div className='col-lg-6' id='rules'>
                          <select className='form-control m-input' onChange={this.changeCondition}
                            value={this.state.condition}>
                            <option value='message_is'>Message is</option>
                            <option value='message_contains'>Message Contains</option>
                            <option value='message_begins'>Message Begins with</option>
                          </select>
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Keywords (separated by comma)
                        </label>
                        <div className='col-lg-6'>
                          <input className='form-control m-input'
                            onChange={this.changeKeywords}
                            value={this.state.keywords}
                            id='keywords'
                            placeholder='hi,hello,hey' />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Reply
                        </label>
                        <div className='col-lg-6'>
                          <textarea className='form-control m-input'
                            onChange={this.changeReply}
                            value={this.state.reply} rows='5'
                            placeholder='Your reply here'
                            id='reply' />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Is Active?
                        </label>
                        <div className='col-lg-6'>
                          <select className='form-control m-input' onChange={this.changeActive}
                            value={this.state.isActive} id='isActive'>
                            <option value='Yes'>Yes</option>
                            <option value='No'>No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='m-portlet__foot m-portlet__foot--fit'>
                    <div className='m-form__actions m-form__actions'>
                      <div className='row'>
                        <div className='col-lg-2' />
                        <div className='col-lg-6'>
                          <button className='btn btn-primary' type='button' onClick={this.gotoWorkflow} >
                            Create
                          </button>
                          <span>&nbsp;&nbsp;</span>
                          <Link to='workflows'>
                            <button className='btn btn-secondary'>
                              { this.state.alertMessage !== '' ? 'Back' : 'Cancel'}
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className='row'>
                        <span>&nbsp;&nbsp;</span>
                      </div>
                      <div className='row'>
                        <div className='col-lg-2' />
                        <div className='col-lg-6'>
                          {
                            this.state.alertMessage !== '' &&
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
                </form>
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
    workflows: (state.workflowsInfo.workflows),
    user: (state.basicInfo.user),
    successMessage: (state.workflowsInfo.successMessageEdit),
    errorMessage: (state.workflowsInfo.errorMessageEdit)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadWorkFlowList: loadWorkFlowList,
      addWorkFlow: addWorkFlow,
      getuserdetails: getuserdetails,
      workflowsTourCompleted: workflowsTourCompleted,
      clearAlertMessages: clearAlertMessages
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateWorkflow)
