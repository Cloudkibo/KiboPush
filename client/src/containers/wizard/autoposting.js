/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './header'
import Sidebar from './sidebar'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { loadAutopostingList, clearAlertMessages, deleteautoposting } from '../../redux/actions/autoposting.actions'
import AddChannel from '../autoposting/addChannel'
import ListItem from '../autoposting/ListItem'
import YouTube from 'react-youtube'
import { registerAction } from '../../utility/socketio'
import AlertContainer from 'react-alert'

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
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    document.title = 'KiboPush | Autoposting'
    this.scrollToTop()
    var compProp = this.props
    registerAction({
      event: 'autoposting_created',
      action: function (data) {
        compProp.loadAutopostingList()
      }
    })
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
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px'}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px'}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='RDOnbzldnoc'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-portlet m-portlet--full-height'>
                <div className='m-portlet__body m-portlet__body--no-padding'>
                  <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                    <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                      <Sidebar step='5' />
                      <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                        <div className='m-portlet__head'>
                          <div className='m-portlet__head-caption'>
                            <div className='m-portlet__head-title'>
                              <h3 className='m-portlet__head-text'>
                                Step 5: Autoposting Feeds
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='m-portlet__body' style={{height: 'auto'}}>
                          <br />
                          <div className='form-group m-form__group row'>
                            <label style={{fontWeight: 'normal'}}>This page will help you setup autoposting feeds. You can connect your Facebook pages and twitter accounts and send updates to your subscribers automatically. Click on Add Feeds to start adding them.</label>
                          </div>
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
                            </div>
                          </div>
                          {this.props.autopostingData && this.props.autopostingData.length > 0 &&
                          <div className='row' >
                            <div className='col-lg-6 m--align-left' />
                            <div className='col-lg-6 m--align-right'>
                              <button className='btn btn-primary' onClick={this.showDialog}>
                                <i className='fa fa-plus' style={{marginRight: '10px'}} />
                                <span>Add Feeds</span>
                              </button>
                            </div>
                          </div>
                        }
                          <br />
                          <div className='tab-pane active m-scrollable' role='tabpanel'>
                            <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                              <div style={{height: '380px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                                <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                                  <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                                    {
                                    this.props.autopostingData && this.props.autopostingData.length > 0
                                      ? this.props.autopostingData.map((item, i) => (
                                        <div className='m-widget5'>
                                          <ListItem key={item._id} updateDeleteID={this.updateDeleteID} openSettings={this.gotoSettings} type={item.subscriptionType} title={item.accountTitle} username={item.userId} item={item} marginState />
                                        </div>
                                    ))
                                      : <div>
                                        <br /><br /><br /><br />
                                        <center>
                                          <button className='btn btn-primary' onClick={this.showDialog}>
                                            <i className='fa fa-plus' style={{marginRight: '10px'}} />
                                            <span>Add Feeds</span>
                                          </button>
                                        </center>
                                      </div>
                                  }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                          <div className='m-form__actions'>
                            <div className='row'>
                              <div className='col-lg-6 m--align-left' >
                                <Link to='/welcomeMessageWizard' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <i className='la la-arrow-left' />
                                    <span>Back</span>&nbsp;&nbsp;
                                  </span>
                                </Link>
                              </div>
                              <div className='col-lg-6 m--align-right'>
                                <Link to='/workflowWizard' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
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
