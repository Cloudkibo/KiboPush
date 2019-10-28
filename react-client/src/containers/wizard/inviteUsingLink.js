/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Header from './header'
import Sidebar from './sidebar'
import { connect } from 'react-redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import {
  sendBroadcast, clearAlertMessage
} from '../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import AlertMessage from '../../components/alertMessages/alertMessage'
import { updateChecks } from '../../redux/actions/wizard.actions'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import {getCurrentProduct} from '../../utility/utils'

class InviteSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMyPagesList()
    this.getlink = this.getlink.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.state = {
      fblink: '',
      copied: false,
      selectPage: {},
      selectedTab: 'becomeSubscriber',
      sendTestMessage: false,
      isShowingModal: (props.location && !props.location.state)
    }
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.setPage = this.setPage.bind(this)
    this.setLink = this.setLink.bind(this)
    this.setSubscriber = this.setSubscriber.bind(this)
    this.sendTestMessage = this.sendTestMessage.bind(this)
    this.sendTestBroadcast = this.sendTestBroadcast.bind(this)
    this.generateAlert = this.generateAlert.bind(this)
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  getlink () {
    let linkurl = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fweb.facebook.com%2F' +
      this.state.selectPage.pageName + '-' +
      this.state.selectPage.pageId + '%2F&amp;src=sdkpreparse'
    return linkurl
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.successMessage && this.state.step !== 0) {
      //  this.generateAlert('success', nextprops.successMessage)
      this.msg.success('Message sent successfully!')
    } else if (nextprops.errorMessage && this.state.step !== 0) {
      this.msg.success('Message not sent!')
      //  this.generateAlert('danger', nextprops.errorMessage)
    }
  }
  generateAlert (type, message) {
    toastr.options = {
      'closeButton': true,
      'debug': false,
      'newestOnTop': false,
      'progressBar': false,
      'positionClass': 'toast-bottom-right',
      'preventDuplicates': false,
      'showDuration': '300',
      'hideDuration': '1000',
      'timeOut': '5000',
      'extendedTimeOut': '1000',
      'showEasing': 'swing',
      'hideEasing': 'linear',
      'showMethod': 'fadeIn',
      'hideMethod': 'fadeOut'
    }
    if (type === 'success') {
      toastr.success('Message sent successfully.', 'Success!')
    } else {
      toastr.error('Message not sent', 'Failed!')
    }
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Getting Started`
    var addScript = document.createElement('script')
    addScript.setAttribute('type', 'text/javascript')
    addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/custom/components/base/toastr.js')
    addScript.type = 'text/javascript'
    document.body.appendChild(addScript)
    this.props.updateChecks({wizardSeen: true})
    if (this.props.location.state && this.props.location.state.pageUserName) {
      this.setState({
        fblink: `https://m.me/${this.props.location.state.pageUserName}`,
        selectPage: this.props.location.state
      })
    } else if (this.props.location.state && this.props.location.state.pageId) {
      this.setState({
        fblink: `https://m.me/${this.props.location.state.pageId}`,
        selectPage: this.props.location.state
      })
    } else if (this.props.pages && this.props.pages.length > 0 && this.props.pages[0].pageUserName) {
      this.setState({
        fblink: `https://m.me/${this.props.pages[0].pageUserName}`,
        selectPage: this.props.pages[0]
      })
    } else {
      if (this.props.pages && this.props.pages.length > 0) {
        this.setState({
          fblink: `https://m.me/${this.props.pages[0].pageId}`,
          selectPage: this.props.pages[0]
        })
      }
    }
  }

  onChangeValue (event) {
    if (event.target.value !== -1) {
      let page
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === event.target.value) {
          page = this.props.pages[i]
          break
        }
      }
      if (page.pageUserName) {
        this.setState({
          fblink: `https://m.me/${page.pageUserName}`,
          selectPage: page
        })
      } else {
        this.setState({
          fblink: `https://m.me/${page.pageId}`,
          selectPage: page
        })
      }
    } else {
      this.setState({
        fblink: '',
        selectPage: {}
      })
    }
  }
  sendTestBroadcast () {
    this.props.clearAlertMessage()
    var data = {
      platform: 'facebook',
      payload: [{ text: 'Hello! this is a test broadcast.', componentType: 'text' }],
      isSegmented: false,
      segmentationPageIds: [this.state.selectPage._id],
      segmentationLocale: '',
      segmentationGender: '',
      segmentationTimeZone: '',
      title: 'Test Broadcast',
      segmentationList: '',
      isList: false,
      fbMessageTag: 'NON_PROMOTIONAL_SUBSCRIPTION'
    }
    this.msg.info('Sending test message...')
    this.props.sendBroadcast(data, this.msg)
  }
  setPage () {
    this.setState({selectedTab: 'sharePage'})
  }
  sendTestMessage () {
    this.setState({sendTestMessage: true})
  }
  setLink () {
    this.setState({selectedTab: 'shareLink'})
  }
  setSubscriber () {
    this.setState({selectedTab: 'becomeSubscriber'})
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
        {/*
          this.state.isShowingModal &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialog}>
              <h3>Welcome to KiboPush</h3>
              <p>Thank you for joining us. This wizard will walk you through the basic features of KiboPush and help you setup your account.</p>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <Link style={{color: 'white'}} onClick={this.closeDialog} className='btn btn-primary'>
                    Continue
                  </Link>
                </div>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <Link to='/dashboard' className='btn btn-secondary'>
                    Skip
                  </Link>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        */}
        <Header />
        <div className='m-content'>
          <div className='m-portlet m-portlet--full-height'>
            <div className='m-portlet__body m-portlet__body--no-padding'>
              <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                  <Sidebar step='1' user={this.props.user} stepNumber={getCurrentProduct() === 'KiboEngage' ? 5 : 4} />
                  <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Step 1: Invite Subscribers
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <ul className='nav nav-tabs m-tabs-line m-tabs-line--right' role='tablist'>
                          <li className='nav-item m-tabs__item'>
                            <a className='nav-link m-tabs__link active' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={this.setSubscriber}>
                              Become a Subscriber
                            </a>
                          </li>
                          <li className='nav-item m-tabs__item'>
                            <a className='nav-link m-tabs__link' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={this.setPage}>
                              Share Your Page
                            </a>
                          </li>
                          <li className='nav-item m-tabs__item'>
                            <a className='nav-link m-tabs__link' data-toggle='tab' role='tab' style={{cursor: 'pointer'}} onClick={this.setLink}>
                              Share Page Link
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      { this.props.pages && this.props.pages.length === 0 &&
                        <AlertMessage type='page' />
                      }
                      {this.state.selectedTab === 'becomeSubscriber' &&
                        <div>
                          <br /><br />
                          <label style={{fontWeight: 'normal'}}>You can become a subscriber of your page by sending a message to your page on messenger.</label>
                          <br /><br /><br /><br />
                          <div className='form-group m-form__group row'>
                            <label className='col-2 col-form-label'>
                              Change Page
                            </label>
                            <div className='col-10'>
                              <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.onChangeValue}>
                                {
                                  this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                    <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                          <br /><br /><br /><br />
                          <center>
                            <a className='btn btn-primary' href={this.state.fblink} target='_blank' onClick={this.sendTestMessage}>
                              <span>Subscribe Now</span>
                            </a>
                          </center>
                        </div>
                      }
                      {this.state.selectedTab === 'sharePage' &&
                        <div>
                          <br /><br />
                          <label style={{fontWeight: 'normal'}}>Become a subscriber of your own page
                          This will let your friends know about your Facebook page.</label>
                          <label style={{fontWeight: 'normal'}}>Build your audience by sharing the page on your timeline.
                          This will let your friends know about your Facebook page.</label>
                          <br /><br /><br /><br />
                          <div className='form-group m-form__group row'>
                            <label className='col-2 col-form-label'>
                              Change Page
                            </label>
                            <div className='col-10'>
                              <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.onChangeValue}>
                                {
                                  this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                    <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                          <br /><br /><br /><br />
                          <center>
                            <a className='btn btn-primary' target='_blank' href={this.getlink()}>
                              <i className='fa fa-facebook' style={{marginRight: '10px'}} />
                              <span>Share Page</span>
                            </a>
                          </center>
                        </div>
                      }
                      { this.state.selectedTab === 'shareLink' &&
                        <div>
                          <br /><br />
                          <div className='form-group m-form__group row'>
                            <label className='col-2 col-form-label'>
                            Change Page
                            </label>
                            <div className='col-10'>
                              <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.onChangeValue}>
                                {
                                  this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                    <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                          <br /><br /><br />
                          <div className='form-group m-form__group row'>
                            <label style={{fontWeight: 'normal'}}>This is the link to your facebook page. Copy this link and share it with people to invite them to become susbcribers of your page</label>
                            <br /><input className='form-control m-input m-input--air' value={this.state.fblink} />
                          </div>
                          <br /><br /><br /><br />
                          <center>
                            <CopyToClipboard text={this.state.fblink}
                              onCopy={() => {
                                this.setState({copied: true})
                                toastr.options = {
                                  'closeButton': true,
                                  'debug': false,
                                  'newestOnTop': false,
                                  'progressBar': false,
                                  'positionClass': 'toast-bottom-right',
                                  'preventDuplicates': false,
                                  'showDuration': '300',
                                  'hideDuration': '1000',
                                  'timeOut': '5000',
                                  'extendedTimeOut': '1000',
                                  'showEasing': 'swing',
                                  'hideEasing': 'linear',
                                  'showMethod': 'fadeIn',
                                  'hideMethod': 'fadeOut'
                                }
                                toastr.success('Link Copied Successfully', 'Copied!')
                              }
                            }>
                              <button className='btn btn-primary'>
                                <i className='fa fa-copy' style={{marginRight: '10px'}} />
                                <span>Copy Link</span>
                              </button>
                            </CopyToClipboard>
                          </center>
                        </div>
                    }
                    </div>
                    <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                      <div className='m-form__actions'>
                        <div className='row'>
                          <div className='col-lg-6 m--align-left' />
                          <div className='col-lg-6 m--align-right'>
                            <Link to='/greetingTextWizard' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
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
    )
  }
}

function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadMyPagesList: loadMyPagesList, clearAlertMessage: clearAlertMessage, sendBroadcast: sendBroadcast, updateChecks: updateChecks}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteSubscribers)
