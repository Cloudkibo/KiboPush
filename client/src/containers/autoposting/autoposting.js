/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { loadAutopostingList, clearAlertMessages, deleteautoposting } from '../../redux/actions/autoposting.actions'
import AddChannel from './addChannel'
import ListItem from './ListItem'
import { Alert } from 'react-bs-notifier'

class Autoposting extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowingModal: false,
      isShowingModalDelete: false,
      showListItems: true,
      alertMessage: '',
      alertType: '',
      deleteid: ''
    }
    props.loadAutopostingList()
    props.clearAlertMessages()
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.gotoSettings = this.gotoSettings.bind(this)
    this.updateDeleteID = this.updateDeleteID.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Autoposting'
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

  updateDeleteID (id) {
    this.setState({deleteid: id})
    this.showDialogDelete()
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

  gotoSettings (item) {
    this.props.history.push({
      pathname: `/autoposting-itemsettings`,
      state: item
    })
  }

  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Auto Posting</h3>
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
                  Connect several channels and information sources to send
                  updates to your subscribers
                </div>
              </div>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Connected Channels
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <Link onClick={this.showDialog}>
                      <button
                        className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Add Channel
                          </span>
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div
                    className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                    <div className='row align-items-center'>
                      <div className='col-xl-8 order-2 order-xl-1' />
                      <div
                        className='col-xl-4 order-1 order-xl-2 m--align-right'>
                        {
                          this.state.isShowingModal &&
                          <ModalContainer style={{width: '500px'}}
                            onClose={this.closeDialog}>
                            <ModalDialog style={{width: '500px'}}
                              onClose={this.closeDialog}>
                              <AddChannel onClose={this.closeDialog} />
                            </ModalDialog>
                          </ModalContainer>
                        }
                        {
                          this.state.isShowingModalDelete &&
                          <ModalContainer style={{width: '500px'}}
                            onClose={this.closeDialogDelete}>
                            <ModalDialog style={{width: '500px'}}
                              onClose={this.closeDialogDelete}>
                              <h3>Delete Integration</h3>
                              <p>Are you sure you want to delete this integration?</p>
                              <button style={{float: 'right'}}
                                className='btn btn-primary btn-sm'
                                onClick={() => {
                                  this.props.deleteautoposting(this.state.deleteid)
                                  this.closeDialogDelete()
                                }}>Delete
                              </button>
                            </ModalDialog>
                          </ModalContainer>
                        }
                        <div
                          className='m-separator m-separator--dashed d-xl-none' />
                      </div>
                    </div>
                  </div>
                  {
                    this.state.alertMessage !== '' &&
                    <div>
                      <center>
                        <Alert type={this.state.alertType}>
                          {this.state.alertMessage}
                        </Alert>
                      </center>
                      <br />
                    </div>
                  }
                  {
                    this.props.autopostingData && this.props.autopostingData.length > 0
                      ? this.props.autopostingData.map((item, i) => (
                        <div className='m-widget5'>
                          <ListItem key={item._id} updateDeleteID={this.updateDeleteID} openSettings={this.gotoSettings} type={item.subscriptionType} title={item.accountTitle} username={item.userId} item={item} />
                        </div>
                    ))
                      : <p>Currently, you do not have any channels. Click on Add Channel button to add new channels. </p>
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
  console.log(state)
  return {
    autopostingData: (state.autopostingInfo.autopostingData),
    successMessage: (state.autopostingInfo.successMessageCreate),
    errorMessage: (state.autopostingInfo.errorMessageCreate)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadAutopostingList: loadAutopostingList,
    clearAlertMessages: clearAlertMessages,
    deleteautoposting: deleteautoposting
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Autoposting)
