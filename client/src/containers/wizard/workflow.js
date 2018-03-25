/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from './sidebar'
import Header from './header'
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
import AlertContainer from 'react-alert'

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
      // this.setState({
      //   alertMessage: nextProps.successMessage,
      //   alertType: 'success'
      // })
      this.msg.success(nextProps.successMessage)
    } else if (nextProps.errorMessage) {
      // this.setState({
      //   alertMessage: nextProps.errorMessage,
      //   alertType: 'danger'
      // })
      this.msg.error(nextProps.errorMessage)
    } else {
      // this.setState({
      //   alertMessage: '',
      //   alertType: ''
      // })
    }
  }

  gotoWorkflow () {
    if (this.state.keywords.length === 0) {
      this.setState({
        alertMessage: 'Please fill the keywords field',
        alertType: 'danger'
      })
      this.msg.error('Please fill the keywords field')
      return
    }
    if (this.state.reply === '') {
      this.setState({
        alertMessage: 'Please fill the reply field',
        alertType: 'danger'
      })
      this.msg.error('Please fill the reply field')
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
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-portlet m-portlet--full-height'>
                <div className='m-portlet__body m-portlet__body--no-padding'>
                  <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                    <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                      <Sidebar step='6' />
                      <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                        <div className='m-portlet__head'>
                          <div className='m-portlet__head-caption'>
                            <div className='m-portlet__head-title'>
                              <h3 className='m-portlet__head-text'>
                                Step 6: Setup Workflows
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='m-portlet__body'>
                          <br />
                          <div className='form-group m-form__group row'>
                            <label style={{fontWeight: 'normal'}}>This page will help you setup workflows for your page. Workflows are automated replies which you can set based on certain keywords. Please fill in the following information to set your first workflow.</label>
                          </div>
                          <div className='m-form__section m-form__section--first'>
                            <div className='form-group m-form__group row'>
                              <label className='col-lg-3 col-form-label'>
                                Rule
                              </label>
                              <div className='col-lg-8' id='rules'>
                                <select className='form-control m-input' onChange={this.changeCondition}
                                  value={this.state.condition}>
                                  <option value='message_is'>Message is</option>
                                  <option value='message_contains'>Message Contains</option>
                                  <option value='message_begins'>Message Begins with</option>
                                </select>
                              </div>
                            </div>
                            <div className='form-group m-form__group row'>
                              <label className='col-lg-3 col-form-label'>
                                Keywords (separated by comma)
                              </label>
                              <div className='col-lg-8'>
                                <input className='form-control m-input'
                                  onChange={this.changeKeywords}
                                  value={this.state.keywords}
                                  id='keywords'
                                  placeholder='hi,hello,hey' />
                              </div>
                            </div>
                            <div className='form-group m-form__group row'>
                              <label className='col-lg-3 col-form-label'>
                                Reply
                              </label>
                              <div className='col-lg-8'>
                                <textarea className='form-control m-input'
                                  onChange={this.changeReply}
                                  value={this.state.reply} rows='5'
                                  placeholder='Your reply here'
                                  id='reply' />
                              </div>
                            </div>
                            <div className='form-group m-form__group row'>
                              <label className='col-lg-3 col-form-label'>
                                Is Active?
                              </label>
                              <div className='col-lg-8'>
                                <select className='form-control m-input' onChange={this.changeActive}
                                  value={this.state.isActive} id='isActive'>
                                  <option value='Yes'>Yes</option>
                                  <option value='No'>No</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-lg-8 m--align-left' />
                            <div className='col-lg-4'>
                              <button className='btn btn-primary' onClick={this.gotoWorkflow} style={{marginLeft: '150px'}}>
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                          <div className='m-form__actions'>
                            <div className='row'>
                              <div className='col-lg-6 m--align-left' >
                                <Link to='/autopostingWizard' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <i className='la la-arrow-left' />
                                    <span>Back</span>&nbsp;&nbsp;
                                  </span>
                                </Link>
                              </div>
                              <div className='col-lg-6 m--align-right'>
                                <Link to='/menuWizard' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <span>Next</span>&nbsp;&nbsp;
                                    <i className='la la-arrow-right' />
                                  </span>
                                </Link>
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
