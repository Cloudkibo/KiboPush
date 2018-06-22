/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { saveDeleteOption, authenticatePassword } from '../../redux/actions/settings.actions'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class DeleteUserData extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedRadio: '',
      deleteOption: '',
      showConfirmation: false,
      confirmationMessage: '',
      showAuthentication: false,
      password: ''
    }
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.saveDeleteOption = this.saveDeleteOption.bind(this)
    this.updateDeleteOption = this.updateDeleteOption.bind(this)
    this.onSaveOption = this.onSaveOption.bind(this)
    this.closeConfirmation = this.closeConfirmation.bind(this)
    this.closeAuthentication = this.closeAuthentication.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.onPasswordSubmit = this.onPasswordSubmit.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }
  componentDidMount () {
    this.updateDeleteOption(this.props.deleteOption)
  }
  componentWillReceiveProps (nextProps) {
    this.updateDeleteOption(this.props.deleteOption)
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
    this.saveDeleteOption()
  }
  handleAuthentication (res) {
    if (res.status === 'success') {
      this.saveDeleteOption()
      this.closeAuthentication()
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
    this.setState({
      showConfirmation: true
    })
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
  closeConfirmation () {
    this.setState({
      showConfirmation: false
    })
  }
  closeAuthentication () {
    this.setState({
      password: '',
      showAuthentication: false
    })
  }
  updateDeleteOption (deleteOption) {
    if (deleteOption) {
      this.setState({
        deleteOption: deleteOption,
        selectedRadio: deleteOption
      })
    }
  }
  saveDeleteOption () {
    this.props.saveDeleteOption({delete_options: this.state.deleteOption}, this.msg)
  }
  handleRadioChange (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'delAccount') {
      this.setState({deleteOption: 'delAccount'})
    }
    if (e.currentTarget.value === 'delChat') {
      this.setState({deleteOption: 'delChat'})
    }
    if (e.currentTarget.value === 'delSubscribers') {
      this.setState({deleteOption: 'delSubscribers'})
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
        {
          this.state.showConfirmation &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeConfirmation}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeConfirmation}>
              <h3>Confirmation</h3>
              <p>{this.state.confirmationMessage}</p>
              <p>Are you sure you want to continue ?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.setState({
                    password: '',
                    showAuthentication: true
                  })
                  this.closeConfirmation()
                }}>Yes
              </button>
            </ModalDialog>
          </ModalContainer>
        }
        {
          this.state.showAuthentication &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeAuthentication}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeAuthentication}>
              <div className='col-12'>
                <h4>Enter Password</h4>
                <input className='form-control m-input' type='password' onChange={this.changePassword} value={this.state.password} placeholder='Password' name='password' />
              </div>
              <div className='col-12' style={{marginTop: '10px'}}>
                <button style={{float: 'right'}}
                  className='btn btn-primary btn-sm'
                  disabled={this.state.password === ''}
                  onClick={() => {
                    this.onPasswordSubmit()
                  }}>Submit
                </button>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
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
            <div className='row'>
              <button className='btn btn-primary' style={{marginLeft: '20px', marginTop: '20px'}} disabled={this.state.deleteOption === ''} onClick={(e) => this.onSaveOption(e)}>Save</button>
              <button className='btn btn-secondary' style={{marginLeft: '10px', marginTop: '20px'}} onClick={(e) => this.onCancel(e)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    user: state.basicInfo.user,
    deleteOption: state.settingsInfo.deleteOption
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    saveDeleteOption: saveDeleteOption,
    authenticatePassword: authenticatePassword
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(DeleteUserData)
