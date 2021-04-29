import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from '../../wizard/header'
import AlertContainer from 'react-alert'
import SIDEBAR from '../sidebar'
import {
  addPages,
  enablePage,
  removePageInAddPage,
  loadMyPagesList
} from '../../../redux/actions/pages.actions'
import { RingLoader } from 'halogenium'
import { Link } from 'react-router-dom'

class ConnectPages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loadingPages: true,
      loading: false
    }
    this.nextBtnAction = this.nextBtnAction.bind(this)
    this.handleAddPagesResponse = this.handleAddPagesResponse.bind(this)
    this.handleDisconnectPageResponse = this.handleDisconnectPageResponse.bind(this)
    this.handleEnablePageResponse = this.handleEnablePageResponse.bind(this)
    props.addPages(this.handleAddPagesResponse)
  }

  handleAddPagesResponse () {
    this.setState({loadingPages: false})
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Connect Facebook Page(s)`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    $('#headerDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  nextBtnAction () {
    if (this.props.pages && this.props.pages.length === 0) {
      this.msg.error('Please connect a page first')
    } else {
      this.props.history.push({
        pathname: '/whatsAppProvidersScreen'
      })
    }
  }

  handleEnablePageResponse (res) {
    this.setState({loading: false})
    if (res.type === 'invalid_permissions') {
      this.refs.permissions.click()
    } else if (res.status === 'failed') {
      this.msg.error(res.description)
    } else if (res.payload && res.payload.msg) {
      this.msg.error(res.payload)
    } else if (res.payload.adminError) {
      this.msg.error(res.payload.adminError)
    }
  }

  handleDisconnectPageResponse (res) {
    this.setState({loading: false})
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <Header showTitle hideMessages hideSettings />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin"
        style={{ height: 'calc(100vh - 130px)', margin: '30px'}}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <SIDEBAR 
            heading='Configure Facebook Messenger Channel'
            description='Get connected with you Facebook Messenger audience!'
          />
          <a href='#/' style={{ display: 'none' }} ref='permissions' data-toggle="modal" data-target="#permissions">Permissions</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="permissions" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    <i style={{ fontSize: '1.75rem' }} className='fa fa-exclamation-triangle' aria-hidden='true' /> Error:
                    </h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
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
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            <div style={{height: '30px'}}>
              <h2> Step 4: Choose your Facebook Page(s) </h2>
            </div>
            <div style={{height: 'calc(100% - 70px)'}}>
              {this.state.loadingPages
              ? <div className='form-group m-form__group m--margin-top-30'>
                  <center>
                    <RingLoader color='#FF5E3A' />
                  </center>
                </div>
              : this.props.otherPages && this.props.otherPages.length === 0
              ? <div className='form-group m-form__group m--margin-top-30'>
                <label style={{fontWeight: 'normal'}} className='control-label'>
                  Please make sure you are admin of atleast one facebook page from <a href='https://www.facebook.com/bookmarks/pages/' target='_blank' rel='noopener noreferrer'>Facebook Pages</a>.</label>
                <br /><br />
                <label style={{fontWeight: 'normal'}} className='control-label'>
                  If you are not an admin of any page, <a href='https://www.facebook.com/pages/creation/' target='_blank' rel='noopener noreferrer'>Create A New Facebook Page</a> and then
                  <a href='/auth/facebook/' target='_blank' rel='noopener noreferrer'> Re-Connect</a> kibopush app with your facebook account.</label>
                <br /><br />
                <label style={{fontWeight: 'normal'}} className='control-label'>
                  If you have facebook page, please make sure you have approved kibopush to manage atleast one of your facebook pages. Do check <a href='https://kibopush.com/allow_kibopush_manage_facebook_pages' target='_blank' rel='noopener noreferrer'> Documentation</a> for furthure assistance.
                </label>
               </div>
              : <div style={{overflowY: 'scroll', height: 'calc(100% - 25px)', marginTop: '15px'}}>
                  <div className='m-widget4'>
                    {this.props.otherPages && this.props.otherPages.map((page, i) => (
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
                          {page.connected &&
                            <button
                              onClick={() => {
                                this.setState({loading: page._id})
                                this.props.removePageInAddPage(page, this.msg, this.handleDisconnectPageResponse)
                              }}
                              className={`btn m-btn--pill btn-danger btn-sm m-btn m-btn--custom ${this.state.loading === page._id && 'm-loader m-loader--light m-loader--right'}`}>
                                Disconnect
                            </button>
                          }
                          {!page.connected &&
                            <button
                              onClick={() => {
                                this.setState({loading: page._id})
                                this.props.enablePage(page, null, this.msg, this.handleEnablePageResponse)
                              }}
                              className={`m-widget4__icon btn m-btn--pill btn-primary btn-sm m-btn m-btn--custom ${this.state.loading === page._id && 'm-loader m-loader--light m-loader--right'}`}>
                              Connect
                            </button>
                          }
                        </div>
                      </div>
                      ))
                    }
                  </div>
                </div>
              }
            </div>
            <div className='row'>
              <div className='col-lg-6 m--align-left'>
                <Link to='/connectFbScreen' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                  <span>
                    <i className='la la-arrow-left' />
                    <span>Back</span>&nbsp;&nbsp;
                  </span>
                </Link>
              </div>
              <div className='col-lg-6 m--align-right'>
                <button disabled={this.props.otherPages && this.props.otherPages.length === 0}
                  className='btn btn-success m-btn m-btn--custom m-btn--icon'
                  onClick={this.nextBtnAction}>
                  <span>
                    <span>Next</span>&nbsp;&nbsp;
                    <i className='la la-arrow-right' />
                  </span>
                </button>
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
    otherPages: (state.pagesInfo.otherPages),
    page_connected: (state.pagesInfo.page_connected),
    message: (state.pagesInfo.message),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    enablePage,
    removePageInAddPage,
    addPages,
    loadMyPagesList
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectPages)
