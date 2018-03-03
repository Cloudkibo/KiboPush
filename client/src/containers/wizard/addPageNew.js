/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Header from './header'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

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
      this.setState({showAlert: true, alertmsg: 'The page you are trying to connect is not published on Facebook. Please go to Facebook Page settings to publish your page and then try connecting this page.'})
    } else if (nextprops.page_connected && nextprops.page_connected !== '') {
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
    console.log('SHow allert state', this.state.showAlert)
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Connect Pages</h3>
                </div>
              </div>
              {
                this.state.showWarning &&
                <ModalContainer style={{width: '300px'}}
                  onClose={this.closeDialog}>
                  <ModalDialog style={{width: '300px'}}
                    onClose={this.closeDialog}>
                    <h3><i style={{fontSize: '1.75rem'}} className='fa fa-exclamation-triangle' aria-hidden='true' /> Warning:</h3>
                    <p>You are not admin of any Facebook page. In order to use the application you must need to create your own Facebook page and grow audience.</p>
                  </ModalDialog>
                </ModalContainer>
            }
            </div>
            <div className='m-content'>
              { this.props.user && !this.props.user.facebookInfo
                ? <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                  <div className='m-alert__icon'>
                    <i className='flaticon-exclamation m--font-brand' />
                  </div>
                  <div className='m-alert__text'>
                    This page will help you connect your Facebook pages. To connect Facebook Pages, facebook account must be connected by at least one of your team admins or by you. Click <Link onClick={() => this.gotoSettings()} style={{color: 'blue', cursor: 'pointer'}}>here</Link> to connect with facebook or Click <Link to='/newInvitation' style={{color: 'blue', cursor: 'pointer'}}>here</Link> to invite admins to your company.
                  </div>
                </div>
                : <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                  <div className='m-alert__icon'>
                    <i className='flaticon-exclamation m--font-brand' />
                  </div>
                  <div>
                    { // this.state.descriptionMsg &&
                      <div className='m-alert__text'>
                        This page will help you connect your Facebook pages. You will not be able to use any of the features of KiboPush unless you connect any Facebook pages.
                        To connect the pages click on connect buttons. Click on continue to move to the next step.
                      </div>
                    }
                  </div>
                </div>
              }
              <div className='row'>
                <div className='col-xl-12'>
                  {this.state.showAlert === true &&
                    <div className='alert alert-danger alert-dismissible fade show' role='alert'>
                      <button type='button' className='close' data-dismiss='alert' aria-label='Close' />
                      {this.state.alertmsg}
                      </div>
                  }
                  <div className='m-portlet m-portlet--full-height '>
                    <div className='m-portlet__body'>
                      <div className='tab-content'>
                        <div className='tab-pane active m-scrollable' role='tabpanel'>
                          <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                            <div style={{height: '370px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
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
                      <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                        <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px'}}>
                          <Link to='/inviteUsingLinkWizard' className='btn m-btn--pill    btn-link'> Continue
                          </Link>
                          <Link to='/dashboard' className='btn m-btn--pill    btn-link' style={{'marginLeft': '10px'}}> Cancel
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
