/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
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
  constructor(props) {
    super(props)
    props.getuserdetails()
    props.addPages()
    this.state = {
      counter: 0,
      showAlert: false,
      alertmsg: '',
      timeout: 2000,
      descriptionMsg: (props.location.state && props.location.state.showMsg) ? props.location.state.showMsg : ''
    }
    this.onDismissAlert = this.onDismissAlert.bind(this)
    this.showErrorDialog = this.showErrorDialog.bind(this)
  }

  gotoView() {
    this.props.history.push({
      pathname: `/pages`

    })
    // browserHistory.push(`/pollResult/${poll._id}`)
  }

  showErrorDialog() {
    this.refs.permission.click()
  }

  componentDidMount() {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Add Pages`
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.message && nextprops.message !== '') {
      this.setState({ showAlert: true, alertmsg: nextprops.message })
    } else if (nextprops.page_connected && nextprops.page_connected !== '') {
      this.setState({ showAlert: true, alertmsg: nextprops.page_connected })

    } else {
      this.setState({ showAlert: false, alertmsg: '' })
    }
    if (nextprops.otherPages && nextprops.otherPages.length === 0) {
      this.refs.notAdmin.click()
    }
  }
  gotoSettings() {
    browserHistory.push({
      pathname: `/settings`,
      state: { module: 'addPages' }
    })
  }
  onDismissAlert() {
    this.props.addPages()
  }
  render() {
    console.log('addPage props', this.props)
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#' style={{ display: 'none' }} ref='permission' data-toggle="modal" data-target="#permission">permission</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="permission" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <i style={{ fontSize: '1.75rem' }} className='fa fa-exclamation-triangle' aria-hidden='true' /> Error:                  <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Looks like you have not granted permissions for this page. Permissions must be granted to connect this page.</p>
                <a style={{ float: 'right' }} href='/auth/facebook/' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                  <span>
                    <i className='fa fa-facebook' />
                    <span>Grant Permissions</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Pages</h3>
            </div>
          </div>

          <a href='#' style={{ display: 'none' }} ref='notAdmin' data-toggle="modal" data-target="#notAdmin">notAdmin</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="notAdmin" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <i style={{ fontSize: '1.75rem' }} className='fa fa-exclamation-triangle' aria-hidden='true' /> Warning:
                  <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
                    </span>
                  </button>
                </div>
                <div style={{ color: 'black' }} className="modal-body">
                  <div>
                    <p>You are not admin of any Facebook page. In order to use the application you must need to create your own Facebook page and grow audience.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {this.props.user && !this.props.user.facebookInfo
            ? <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation m--font-brand' />
              </div>
              <div className='m-alert__text'>
                This page will help you connect your Facebook pages. To connect Facebook Pages, facebook account must be connected by at least one of your team admins or by you. Click <Link onClick={() => this.gotoSettings()} style={{ color: 'blue', cursor: 'pointer' }}>here</Link> to connect with facebook or Click <Link to='/newInvitation' style={{ color: 'blue', cursor: 'pointer' }}>here</Link> to invite admins to your company.
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
                this.msg.error(this.state.alertmsg) ?
                this.onDismissAlert() : null
              }
              <div className='m-portlet m-portlet--full-height '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Connect Pages
                          </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                      <li className='nav-item m-tabs__item'>
                        {this.props.location.state && this.props.location.state.module === 'page'
                          ? <Link to='/pages' className='btn m-btn--pill btn-success'>
                            Done
                            </Link>
                          : <Link to='/dashboard' className='btn m-btn--pill btn-success'>
                            Done
                              </Link>
                        }
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

                              <a onClick={() => this.props.removePageInAddPage(page)} className='m-widget4__icon'>
                                <button type='button' className='btn m-btn--pill btn-danger btn-sm m-btn m-btn--custom'>Disconnect</button>
                              </a>
                            }
                            {(!page.connected) &&

                              <a onClick={() => this.props.enablePage(page, this.showErrorDialog)} className='m-widget4__icon'>
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
    )
  }
}

function mapStateToProps(state) {
  return {
    user: (state.basicInfo.user),
    otherPages: (state.pagesInfo.otherPages),
    page_connected: (state.pagesInfo.page_connected),
    message: (state.pagesInfo.message)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getuserdetails: getuserdetails,
    enablePage: enablePage,
    removePageInAddPage: removePageInAddPage,
    addPages: addPages
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPage)
