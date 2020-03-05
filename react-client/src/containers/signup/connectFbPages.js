/**
 * Created by imran on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  addPages,
  enablePage,
  removePageInAddPage,
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import $ from 'jquery'

class AddPage extends React.Component {
  constructor (props) {
    super(props)
    props.addPages()
    this.state = {
      showAlert: false,
      alertmsg: '',
      showWarning: false,
      showErrorDialog: false
    }
    console.log('AddPage props constructor', props)
    if (!props.pages) {
      props.loadMyPagesList()
    }
    this.closeDialog = this.closeDialog.bind(this)
    this.showErrorDialog = this.showErrorDialog.bind(this)
    this.closeErrorDialog = this.closeErrorDialog.bind(this)
  }

  UNSAFE_componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  showErrorDialog () {
    this.setState({showErrorDialog: true})
    this.refs.permissions.click()
  }

  closeErrorDialog () {
    this.setState({showErrorDialog: false})
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    console.log('in componentDidMount', document.getElementsByTagName('body')[0].className)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
    console.log('in componentDidMount', document.getElementsByTagName('body')[0])
    document.title = `${title} | Add Pages`
    /* eslint-disable */
     $('#sidebarDiv').addClass('hideSideBar')
     /* eslint-enable */
  }

  closeDialog () {
    this.setState({showWarning: false})
  }

  UNSAFE_componentWillReceiveProps (nextprops) {
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

  onDismissAlert () {
    this.setState({showAlert: false, alertmsg: ''})
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <a href='#/' style={{ display: 'none' }} ref='permissions' data-toggle="modal" data-target="#permissions">Permissions</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="permissions" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  <i style={{fontSize: '1.75rem'}} className='fa fa-exclamation-triangle' aria-hidden='true' /> Error:
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Looks like you have not granted permissions for this page. Permissions must be granted to connect this page.</p>
              <a style={{float: 'right'}} href='/auth/facebook/' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
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
        </div>
        <div className='m-content'>
          <div className='row'>
            {this.state.showWarning
            ? <div className='m-portlet m-portlet--full-height col-12'>
                  <div className='m-portlet__body'>
                  <div>
                    <strong>
                      <i style={{fontSize: '22px'}} className='fa fa-warning' /> <span style={{fontSize: '22px'}}>Something Went Wrong</span>
                    </strong>
                    </div>
                  <div style={{paddingLeft:'50px'}}>
                    <span style={{fontSize: '16px', lineHeight: '70px'}}>Try:</span>
                    <ul>
                      <li>Please make sure you are admin of atleast one facebook page from  <a href='https://www.facebook.com/bookmarks/pages/' target='_blank' rel='noopener noreferrer'>Facebook Pages</a>.
                      If you are not admin of any page <a href='https://www.facebook.com/pages/creation/' target='_blank' rel='noopener noreferrer'>Create A New Facebook Page</a> and then
                      <a href='/auth/facebook/' target='_blank' rel='noopener noreferrer'> ReConnect</a> kibopush app with your facebook account.</li>
                      <li>If you have facebook page, please make sure you have approved kibopush to manage atleast one of your facebook pages. Do check </li>
                      <a href='https://kibopush.com/allow_kibopush_manage_facebook_pages' target='_blank' rel='noopener noreferrer'> Documentation</a> for furthure assistance.
                    </ul>
                  </div>
                  </div>
                </div>
            : <div className='col-xl-12'>
              {
                this.state.showAlert === true &&
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
                        Connect Facebook Pages
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                      <li className='nav-item m-tabs__item'>
                        {this.props.pages && this.props.pages.length > 0
                        ? <Link to={{pathname: '/dashboard', state: {loadScript: true}}} className='btn m-btn--pill btn-success'>
                          Done
                        </Link>
                        : <Link className='btn m-btn--pill btn-success' disabled>
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
                            {
                              (page.connected) &&
                              <a href='#/' onClick={() => this.props.removePageInAddPage(page)} className='m-widget4__icon'>
                                <button type='button' className='btn m-btn--pill btn-danger btn-sm m-btn m-btn--custom'>Disconnect</button>
                              </a>
                            }
                            {
                              (!page.connected) &&
                              <a href='#/' onClick={() => this.props.enablePage(page, this.showErrorDialog)} className='m-widget4__icon'>
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
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state', state)
  return {
    user: (state.basicInfo.user),
    otherPages: (state.pagesInfo.otherPages),
    page_connected: (state.pagesInfo.page_connected),
    message: (state.pagesInfo.message),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    enablePage: enablePage,
    removePageInAddPage: removePageInAddPage,
    addPages: addPages,
    loadMyPagesList: loadMyPagesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPage)
