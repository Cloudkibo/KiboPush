/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import AlertContainer from 'react-alert'

import {
  addPages,
  enablePage,
  removePageInAddPage
} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'

class AddPage extends React.Component {
  constructor (props) {
    super(props)
    props.getuserdetails()
    props.addPages()
    this.state = {
      counter: 0,
      showAlert: false,
      alertmsg: '',
      timeout: 2000,
      showWarning: false,
      descriptionMsg: (props.location.state && props.location.state.showMsg) ? props.location.state.showMsg : ''
    }
    this.closeDialog = this.closeDialog.bind(this)
    this.goToNext = this.goToNext.bind(this)
  }

  gotoView () {
    this.props.history.push({
      pathname: `/pages`

    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }

  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    document.title = 'KiboPush | Add Pages'
  }

  closeDialog () {
    this.setState({showWarning: false})
  }

  componentWillReceiveProps (nextprops) {
    console.log('nextprops in connect page', nextprops)
    if (nextprops.message && nextprops.message !== '') {
      this.msg.error('The page you are trying to connect is not published on Facebook. Please go to Facebook Page settings to publish your page and then try connecting this page.')
      this.setState({showAlert: true, alertmsg: 'The page you are trying to connect is not published on Facebook. Please go to Facebook Page settings to publish your page and then try connecting this page.'})
    } else if (nextprops.page_connected && nextprops.page_connected !== '') {
      this.msg.error(nextprops.page_connected)
      this.setState({showAlert: true, alertmsg: nextprops.page_connected})
    } else {
      this.setState({showAlert: false, alertmsg: ''})
    }
    if (nextprops.otherPages && nextprops.otherPages.length === 0) {
      this.setState({showWarning: true})
    }
  }
  goToNext () {
    browserHistory.push({
    })
  }
  onDismissAlert () {
    this.setState({showAlert: false, alertmsg: ''})
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <Header />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-portlet m-portlet--full-height'>
                <div className='m-portlet__body m-portlet__body--no-padding'>
                  <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                    <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                      <Sidebar step='1' />
                      <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                        <div className='m-portlet__head'>
                          <div className='m-portlet__head-caption'>
                            <div className='m-portlet__head-title'>
                              <h3 className='m-portlet__head-text'>
                                Step 1: Connect Pages
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='m-portlet__body'>
                          <div className='form-group m-form__group row'>
                            <label style={{fontWeight: 'normal'}}>This page will help you connect your Facebook pages. You will not be able to use any of the features of KiboPush unless you connect any Facebook pages.
                            To connect the pages click on connect buttons.</label>
                          </div>
                          <div className='tab-content'>
                            <div className='tab-pane active m-scrollable' role='tabpanel'>
                              <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                                <div style={{height: '380px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                                  <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                                    <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                                      <div className='tab-pane active' id='m_widget4_tab1_content'>
                                        <div className='m-widget4' >
                                          {
                                            (this.props.otherPages) &&
                                            this.props.otherPages.map((page, i) => (

                                              <div className='m-widget4__item' key={i + '-addPageItem'}>
                                                <div className='m-widget4__img m-widget4__img--icon'>
                                                  <img src={page.pagePic} className='m--img-rounded m--marginless m--img-centered' alt='' />
                                                </div>
                                                <div className='m-widget4__info'>
                                                  <span className='m-widget4__text'>
                                                    {page.pageName}
                                                  </span>
                                                </div>
                                                <div className='m-widget4__ext'>
                                                  {(page.connected) &&

                                                  <a href='#' onClick={() => this.props.removePageInAddPage(page)} className='m-widget4__icon'>
                                                    <button type='button' className='btn m-btn--pill btn-danger btn-sm m-btn m-btn--custom'>Disconnect</button>
                                                  </a>
                                                        }
                                                  {(!page.connected) &&

                                                  <a href='#' onClick={() => this.props.enablePage(page)} className='m-widget4__icon'>
                                                    <button type='button' className='btn m-btn--pill btn-primary btn-sm m-btn m-btn--custom'>Connect</button>
                                                  </a>

                                                        }

                                                </div>
                                              </div>
                                            ))
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                          <div className='m-form__actions'>
                            <div className='row'>
                              <div className='col-lg-6 m--align-left' />
                              <div className='col-lg-6 m--align-right'>
                                <Link to='/inviteUsingLinkWizard' href='#' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
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
  console.log(state)
  return {
    user: (state.basicInfo.user),
    otherPages: (state.pagesInfo.otherPages),
    page_connected: (state.pagesInfo.page_connected),
    message: (state.pagesInfo.message)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails,
    enablePage: enablePage,
    removePageInAddPage: removePageInAddPage,
    addPages: addPages
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPage)
