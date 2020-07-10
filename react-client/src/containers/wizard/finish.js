/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
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
import swal from 'sweetalert2'
import {getCurrentProduct} from '../../utility/utils'

class Finish extends React.Component {
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
      sendTestMessage: false
    }
    this.setPage = this.setPage.bind(this)
    this.setLink = this.setLink.bind(this)
    this.setSubscriber = this.setSubscriber.bind(this)
    this.sendTestMessage = this.sendTestMessage.bind(this)
    this.sendTestBroadcast = this.sendTestBroadcast.bind(this)
    this.generateAlert = this.generateAlert.bind(this)
    this.show = this.show.bind(this)
  }

  show () {
    swal({
      type: 'success',
      title: 'Congratulations!',
      text: 'Your basic setup is complete. You can make further changes by going to our settings page.',
      confirmButtonColor: '#337ab7',
      footer: '<div className="col-lg-6 m--align-left" style="margin-right: 94px"><a href="https://web.facebook.com/groups/kibopush/" target="_blank" style="color: #337ab7; font-weight: bold">Join Our Community</a></div><div className="col-lg-6 m--align-right"><a href="https://web.facebook.com/messages/t/kibopush" target="_blank" style="color: #337ab7; font-weight: bold">Become Our Subscriber</a></div>'
    }).then((value) => {
      this.props.history.push({
        pathname: `/dashboard`
      })
    })
  }

  getlink () {
    let linkurl = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fweb.facebook.com%2F' +
      this.state.selectPage.pageName + '-' +
      this.state.selectPage.pageId + '%2F&amp;src=sdkpreparse'
    return linkurl
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
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

    document.title = `${title} | Wizard`
    var addScript = document.createElement('script')
    addScript.setAttribute('type', 'text/javascript')
    addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/custom/components/base/toastr.js')
    addScript.type = 'text/javascript'
    document.body.appendChild(addScript)
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
      segmentationPageIds: [],
      segmentationLocale: '',
      segmentationGender: '',
      segmentationTimeZone: '',
      title: 'Test Broadcast',
      segmentationList: '',
      isList: false
    }
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
    console.log('props in finish', this.props)
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div style={{marginLeft: '-255px'}} className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div className='m-content'>
          <div className='m-portlet m-portlet--full-height'>
            <div className='m-portlet__body m-portlet__body--no-padding'>
              <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                  <Sidebar history={this.props.history} step='7' user={this.props.user} stepNumber={getCurrentProduct() === 'KiboEngage' ? 5 : 4} />
                  <div className='col-md-9 col-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Step {6}: Subscribe To Kibopush
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div>
                        <br /><br />
                        <label style={{fontWeight: 'normal'}}>Want to get the latest updates and news from KiboPush? Please send a message on our page to become a subscriber.</label>
                        <br /><br /><br /><br />
                        <center>
                          <a className='btn btn-primary' href='https://web.facebook.com/messages/t/kibopush' target='_blank' rel='noopener noreferrer' onClick={this.sendTestMessage}>
                            <span>Subscribe To KiboPush</span>
                          </a>
                        </center>
                      </div>
                    </div>
                    <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                      <div className='m-form__actions'>
                        <div className='row'>
                          {/* <div className='col-lg-6 m--align-left' >
                                <Link to='/paymentMethodsWizard' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <i className='la la-arrow-left' />
                                    <span>Back</span>&nbsp;&nbsp;
                                  </span>
                                </Link>
                              </div> */}
                          <div className='col-lg-6 m--align-left' >
                            <Link to={getCurrentProduct() === 'KiboEngage' || getCurrentProduct() === 'localhost' ? '/menuWizard' : '/responseMethods'} className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                              <span>
                                <i className='la la-arrow-left' />
                                <span>Back</span>&nbsp;&nbsp;
                              </span>
                            </Link>
                          </div>
                          <div className='col-lg-6 m--align-right'>
                            <button className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next' onClick={this.show}>
                              <span>
                                <span>Finish</span>&nbsp;&nbsp;
                                <i className='la la-arrow-right' />
                              </span>
                            </button>
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
    user: (state.basicInfo.user),
    pages: (state.pagesInfo.pages),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    clearAlertMessage: clearAlertMessage,
    sendBroadcast: sendBroadcast
  },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Finish)
