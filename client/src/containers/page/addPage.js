/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
//  import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
//  import HeaderResponsive from '../../components/header/headerResponsive'
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
    if (nextprops.otherPages && nextprops.otherPages.length === 0) {
      this.setState({showWarning: true})
    }
    if (nextprops.page_connected && nextprops.page_connected !== '') {
      this.setState({showAlert: true, alertmsg: nextprops.page_connected})
    } else {
      this.setState({showAlert: false, alertmsg: ''})
    }
  }
  gotoSettings () {
    browserHistory.push({
      pathname: `/settings`,
      state: {module: 'addPages'}
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
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Manage Pages</h3>
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
                        To connect the pages click on connect buttons. Click on Done button to save them.
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
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                                Add Pages
                              </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                          <li className='nav-item m-tabs__item'>
                            <Link to='/pages' className='btn m-btn--pill btn-success' data-toggle='tab' role='tab'>
                                  Done
                                </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='m-widget4'>
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

          {/*
             <div className='container'>
            <br /><br /><br /><br /><br /><br />
            <div className='row'>
              <main
                className='col-xl-6 push-xl-3 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12'>
                <h3>Add Pages</h3>
                {this.state.showAlert === true &&
                <center>
                  <Alert type='danger' timeout={this.state.timeout}
                    onDismiss={this.onDismissAlert.bind(this)}>
                    {this.state.alertmsg}
                  </Alert>
                </center>

                    }
                {
                (this.props.otherPages) &&
                this.props.otherPages.map((page, i) => (
                  <div className='ui-block'>
                    <div className='birthday-item inline-items'>

                      <div className='birthday-author-name'>
                        <a href='#'
                          className='h6 author-name'>{page.pageName} </a>

                      </div>
                      {(page.connected) &&
                      <button onClick={() => this.props.removePageInAddPage(page)}
                        className='btn btn-sm bg-blue'>Disconnect
                      </button>
                      }
                      {(!page.connected) &&
                      <button onClick={() => this.props.enablePage(page)}
                        className='btn btn-sm bg-blue'>Connect
                      </button>
                      }
                    </div>
                  </div>
                ))
              }
                <button onClick={() => this.gotoView()}
                  className='btn btn-sm bg-blue'>Done
              </button>
              </main>

            </div>
          </div>
          */}

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
    page_connected: (state.pagesInfo.page_connected)
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
