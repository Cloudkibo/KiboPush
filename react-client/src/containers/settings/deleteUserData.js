/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { saveDeleteOption, authenticatePassword, cancelDeletion } from '../../redux/actions/settings.actions'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import moment from 'moment'

class DeleteUserData extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedRadio: '',
      deleteOption: '',
      confirmationMessage: '',
      password: '',
      showEmailAlert: ''
    }
    props.getuserdetails()
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.saveDeleteOption = this.saveDeleteOption.bind(this)
    this.updateDeleteOption = this.updateDeleteOption.bind(this)
    this.onSaveOption = this.onSaveOption.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.onPasswordSubmit = this.onPasswordSubmit.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  componentDidMount () {
    this.updateDeleteOption(this.props.user)
  }
  componentWillReceiveProps (nextProps) {
    this.updateDeleteOption(nextProps.user)
  }

  changePassword (e) {
    this.setState({
      password: e.target.value
    })
  }
  onCancel () {
    this.setState({
      selectedRadio: '',
      deleteOption: ''
    })
    this.props.cancelDeletion(this.msg, this.handleSave)
  }
  handleAuthentication (res) {
    if (res.status === 'success') {
      this.saveDeleteOption()
    } else {
      this.setState({
        password: ''
      })
    }
  }
  onPasswordSubmit () {
    this.props.authenticatePassword({email: this.props.user.email, password: this.state.password}, this.msg, this.handleAuthentication)
  }
  onSaveOption () {
    if (this.state.selectedRadio === 'delAccount') {
      this.setState({
        confirmationMessage: 'Once you have deleted your account and data from KiboPush, you will not be able to reactivate it or retrieve any of the information. You have 14 days to change your decision, after which your account and entire data will be deleted.'
      })
    }
    if (this.state.selectedRadio === 'delChat') {
      this.setState({
        confirmationMessage: 'Once you have deleted your chats KiboPush, you will not be able to retrieve them back. You have 14 days to change your decision, after which your live chat data will be deleted.'
      })
    }
    if (this.state.selectedRadio === 'delSubscribers') {
      this.setState({
        confirmationMessage: 'Once you have deleted your subscribers from KiboPush, you will not be able to retrieve them back. You have 14 days to change your decision, after which your subscribers data will be deleted.'
      })
    }
  }
  updateDeleteOption (user) {
    if (user && user.deleteInformation && user.deleteInformation.delete_option) {
      var deletionDate = moment(user.deleteInformation.deletion_date).format('dddd, MMMM Do YYYY')
      if (user.deleteInformation.delete_option === 'DEL_ACCOUNT') {
        this.setState({
          deleteOption: 'DEL_ACCOUNT',
          selectedRadio: 'delAccount',
          showEmailAlert: `Your request to delete account has been sent to the admin. Your account will be deleted by ${deletionDate}`
        })
      } else if (user.deleteInformation.delete_option === 'DEL_CHAT') {
        this.setState({
          deleteOption: 'DEL_CHAT',
          selectedRadio: 'delChat',
          showEmailAlert: `Your request to delete chat sessions has been sent to the admin. Your data will be deleted by ${deletionDate}`
        })
      } else if (user.deleteInformation.delete_option === 'DEL_SUBSCRIBER') {
        this.setState({
          deleteOption: 'DEL_SUBSCRIBER',
          selectedRadio: 'delSubscribers',
          showEmailAlert: `Your request to delete subscribers has been sent to the admin. Your data will be deleted by ${deletionDate}`
        })
      } else {
        this.setState({
          deleteOption: '',
          selectedRadio: '',
          showEmailAlert: ''
        })
      }
    }
  }
  saveDeleteOption () {
    var deletionDate = moment().add(14, 'day')
    this.props.saveDeleteOption({delete_option: this.state.deleteOption, deletion_date: deletionDate}, this.msg, this.handleSave)
  }
  handleSave (res) {
    if (res.status === 'success') {
      this.props.getuserdetails()
    }
  }
  handleRadioChange (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'delAccount') {
      this.setState({deleteOption: 'DEL_ACCOUNT'})
    }
    if (e.currentTarget.value === 'delChat') {
      this.setState({deleteOption: 'DEL_CHAT'})
    }
    if (e.currentTarget.value === 'delSubscribers') {
      this.setState({deleteOption: 'DEL_SUBSCRIBER'})
    }
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="confirmation" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Confirmation
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>{this.state.confirmationMessage}</p>
                <p>Are you sure you want to continue ?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.setState({
                      password: '',
                    })
                  }} data-toggle="modal" data-target="#authentication">Yes
              </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="authentication" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Authentication
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div className='col-12'>
                  <p>Enter Password</p>
                  <input className='form-control m-input' type='password' onChange={this.changePassword} value={this.state.password} placeholder='Password' name='password' />
                </div>
                <div className='col-12' style={{ marginTop: '10px' }}>
                  <button style={{ float: 'right' }}
                    className='btn btn-primary btn-sm'
                    disabled={this.state.password === ''}
                    onClick={() => {
                      this.onPasswordSubmit()
                    }}>Submit
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-list-2 m--hide' />
                    Delete Information
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='row align-items-center'>
              <div className='col-12' style={{marginBottom: '20px'}}>
                <i className='flaticon-exclamation m--font-brand' />
                <span style={{marginLeft: '5px'}}> When you start the deletion process by selecting one of the options below, a request is sent to the admin to delete your desired information in 14 days time.</span>
              </div>
              <div className='radio-buttons' style={{marginLeft: '37px'}}>
                <div className='radio'>
                  <input id='delChat'
                    type='radio'
                    value='delChat'
                    name='delChat'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'delChat'} />
                  <p>Delete all live chat sessions</p>
                </div>
                <div className='radio'>
                  <input id='delSubscribers'
                    type='radio'
                    value='delSubscribers'
                    name='delSubscribers'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'delSubscribers'} />
                  <p>Delete all subscribers</p>
                </div>
                <div className='radio'>
                  <input id='delAccount'
                    type='radio'
                    value='delAccount'
                    name='delAccount'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'delAccount'} />
                  <p>Delete account and entire information</p>
                </div>
              </div>
            </div>
            <div className='row' style={{marginBottom: '20px'}}>
              <button className='btn btn-primary' style={{marginLeft: '20px', marginTop: '20px'}} disabled={this.state.deleteOption === ''} data-toggle="modal" data-target="#confirmation" onClick={(e) => this.onSaveOption(e)}>Start Deletion Process</button>
              <button className='btn btn-secondary' style={{marginLeft: '10px', marginTop: '20px'}} disabled={this.state.showEmailAlert === ''} onClick={(e) => this.onCancel(e)}>Cancel Deletion Process</button>
            </div>
            {this.state.showEmailAlert !== '' && <div className='row alert alert-email'>
              <p>{this.state.showEmailAlert}</p>
              <span>Click on 'Cancel Deletion Process' if you want to stop the deletion process.</span>
            </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    user: state.basicInfo.user
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    saveDeleteOption: saveDeleteOption,
    authenticatePassword: authenticatePassword,
    getuserdetails: getuserdetails,
    cancelDeletion: cancelDeletion
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(DeleteUserData)
