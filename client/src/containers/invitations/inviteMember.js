/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  addInvitation,
  loadInvitationsList,
  clearAlertMessages
} from '../../redux/actions/invitations.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { Alert } from 'react-bs-notifier'
import AlertContainer from 'react-alert'

class InviteMembers extends React.Component {
  constructor (props) {
    super(props)
    props.getuserdetails()
    this.createNewInvitations = this.createNewInvitations.bind(this)
    this.changeName = this.changeName.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
    this.changeRadio = this.changeRadio.bind(this)
    this.state = {
      name: '',
      email: '',
      role: '',
      alertMessage: '',
      alertType: '',
      timeout: 3000
    }
    this.clearAlert = this.clearAlert.bind(this)
  }

  componentDidMount () {
    document.title = 'KiboPush | Invite Member'
  }

  componentWillReceiveProps (nextProps) {
    // if (nextProps.successMessage) {
    //   this.setState({
    //     alertMessage: nextProps.successMessage,
    //     alertType: 'success'
    //   })
    // } else if (nextProps.errorMessage) {
    //   this.setState({
    //     alertMessage: nextProps.errorMessage,
    //     alertType: 'danger'
    //   })
    // } else {
    //   this.setState({
    //     alertMessage: '',
    //     alertType: ''
    //   })
    // }
  }

  createNewInvitations (event) {
    event.preventDefault()
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
    if (this.state.role === '') {
      this.setState({
        alertMessage: 'Please select the role',
        alertType: 'danger'
      })
      return
    }

    this.props.addInvitation({
      name: this.state.name,
      email: this.state.email,
      role: this.state.role
    }, this.msg)
    // this.props.history.push({
    //   pathname: '/workflows'
    // })
  }

  clearAlert () {
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

  changeRadio (event) {
    this.setState({role: event.target.value})
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

      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
            <form className='m-form m-form--label-align-right' onSubmit={this.createNewInvitations}>
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
                        type='email'
                        required
                        id='exampleInputReply' />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Invite as
                    </label>
                    <div className='col-lg-6'>
                      <div className='m-radio-list'>
                        <label className='m-radio m-radio--bold'>
                          <input type='radio' name='example_5_1' value='agent'
                            onChange={this.changeRadio} />
                          Agent
                          <span />
                        </label>
                        <label className='m-radio m-radio--bold'>
                          <input type='radio' name='example_5_1' value='admin'
                            onChange={this.changeRadio} />
                          Admin
                          <span />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='m-portlet__foot m-portlet__foot--fit'>
                <div className='m-form__actions m-form__actions'>
                  <div className='row'>
                    <div className='col-lg-2' />
                    <div className='col-lg-6'>
                      <button className='btn btn-primary' type='submit'>
                        Invite
                      </button>
                      <span>&nbsp;&nbsp;</span>
                      <Link to='members'>
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
                          <Alert type={this.state.alertType}
                            timeout={this.state.timeout}
                            showIcon={this.state.alertMessage !== ''}
                            onDismiss={this.clearAlert}>
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
    )
  }
}

function mapStateToProps (state) {
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
      clearAlertMessages: clearAlertMessages
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InviteMembers)
