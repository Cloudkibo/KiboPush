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
  addInvitation,
  loadInvitationsList,
  clearAlertMessages
} from '../../redux/actions/invitations.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import {
  getuserdetails,
  workflowsTourCompleted
} from '../../redux/actions/basicinfo.actions'
import { Alert } from 'react-bs-notifier'

class InviteMembers extends React.Component {
  constructor (props) {
    super(props)
    props.getuserdetails()
    this.createNewInvitations = this.createNewInvitations.bind(this)
    this.changeName = this.changeName.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
    this.state = {
      name: '',
      email: '',
      steps: [],
      alertMessage: '',
      alertType: '',
      timeout: 3000
    }
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
    this.tourFinished = this.tourFinished.bind(this)
    this.clearAlert = this.clearAlert.bind(this)
  }

  componentDidMount () {
    document.title = 'KiboPush | Invite Member'

    // this.addSteps([
    //   {
    //     title: 'Workflows',
    //     text: `Workflows allow you to automatically respond to messages to your page, which meet a certain criteria`,
    //     selector: 'div#workflow',
    //     position: 'top-left',
    //     type: 'hover',
    //     isFixed: true
    //   },
    //   {
    //     title: 'Keywords',
    //     text: `Keywords are the specific strings, on which you want a particular action to take place `,
    //     selector: 'div#keywords',
    //     position: 'bottom-left',
    //     type: 'hover',
    //     isFixed: true
    //   },
    //   {
    //     title: 'Rules',
    //     text: 'Rules are applied on the message recieved together with the given keyword, to trigger the auto-reply',
    //     selector: 'div#rules',
    //     position: 'bottom-left',
    //     type: 'hover',
    //     isFixed: true
    //   },
    //   {
    //     title: 'Reply',
    //     text: 'Here you can write the automated message that get sent if above conditions are met',
    //     selector: 'div#reply',
    //     position: 'bottom-left',
    //     type: 'hover',
    //     isFixed: true
    //   }
    // ])
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.successMessage) {
      console.log(nextProps.successMessage)
      this.setState({
        alertMessage: nextProps.successMessage,
        alertType: 'success'
      })
    } else if (nextProps.errorMessage) {
      console.log(nextProps.errorMessage)
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

  createNewInvitations () {
    if (this.state.name === '') {
      this.setState({
        alertMessage: 'Please fill the name field',
        alertType: 'danger'
      })
      return
    }
    if (this.state.email === '') {
      this.setState({
        alertMessage: 'Please fill the email field',
        alertType: 'danger'
      })
      return
    }

    this.props.addInvitation({
      name: this.state.name,
      email: this.state.email
    })
    // this.props.history.push({
    //   pathname: '/workflows'
    // })
  }

  clearAlert () {
    console.log('clear Alert called')
    this.setState({
      alertMessage: '',
      alertType: ''
    })
    this.props.clearAlertMessages()
  }

  changeName (event) {
    this.setState({name: event.target.value})
  }

  changeEmail (event) {
    this.setState({email: event.target.value})
  }

  tourFinished (data) {
    console.log('Next Tour Step')
    if (data.type === 'finished') {
      console.log('this: ', this)
      console.log('Tour Finished')
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
          !(this.props.user && this.props.user.workFlowsTourSeen) &&
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
                  <h3 className='m-subheader__title'>Invite Member to
                    Company</h3>
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
                  Invitation email would be sent by KiboPush on behalf of your
                  company
                </div>
              </div>
              <div className='m-portlet m-portlet--mobile'>
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
                          Name
                        </label>
                        <div className='col-lg-6'>
                          <input className='form-control m-input'
                            onChange={this.changeName}
                            value={this.state.name}
                            id='exampleInputReply' />
                        </div>
                      </div>
                      <div className='form-group m-form__group row'>
                        <label className='col-lg-2 col-form-label'>
                          Email
                        </label>
                        <div className='col-lg-6'>
                          <input className='form-control m-input'
                            onChange={this.changeEmail}
                            value={this.state.email}
                            id='exampleInputReply' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='m-portlet__foot m-portlet__foot--fit'>
                    <div className='m-form__actions m-form__actions'>
                      <div className='row'>
                        <div className='col-lg-2' />
                        <div className='col-lg-6'>
                          <button className='btn btn-primary' type='button'
                            onClick={this.createNewInvitations}>
                            Invite
                          </button>
                          <span>&nbsp;&nbsp;</span>
                          <Link to='inviteMembers'>
                            <button className='btn btn-secondary'>
                              Cancel
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
                              <Alert type={this.state.alertType} timeout={this.state.timeout} showIcon={this.state.alertMessage !== ''} onDismiss={this.clearAlert}>
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
  console.log(state)
  return {
    invitations: (state.invitationsInfo.invitations),
    user: (state.basicInfo.user),
    successMessage: (state.invitationsInfo.successMessageEdit),
    errorMessage: (state.invitationsInfo.errorMessageEdit)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadInvitationsList: loadInvitationsList,
      addInvitation: addInvitation,
      getuserdetails: getuserdetails,
      workflowsTourCompleted: workflowsTourCompleted,
      clearAlertMessages: clearAlertMessages
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InviteMembers)
