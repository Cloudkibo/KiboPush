/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import { updateChecks } from '../../redux/actions/wizard.actions'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import AlertContainer from 'react-alert'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import {
  addPages,
  enablePage,
  removePageInAddPage,
  loadMyPagesListNew
} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import {getCurrentProduct} from '../../utility/utils'

class AddPage extends React.Component {
  constructor (props) {
    super(props)
    props.loadMyPagesListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: ''}})
    props.getuserdetails()
    props.addPages()
    this.state = {
      counter: 0,
      showAlert: false,
      alertmsg: '',
      timeout: 2000,
      showWarning: false,
      descriptionMsg: (props.location.state && props.location.state.showMsg) ? props.location.state.showMsg : '',
      isShowingModal: !((props.location && props.location.state))
    }
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.goToNext = this.goToNext.bind(this)
    this.showError = this.showError.bind(this)
  }

  gotoView () {
    this.props.history.push({
      pathname: `/pages`

    })
    // this.props.history.push(`/pollResult/${poll._id}`)
  }
  showError () {
    this.msg.error('Please connect atleast one page')
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Add Pages`
    this.props.updateChecks({wizardSeen: true})
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    console.log('UNSAFE_componentWillReceiveProps in addpages', nextprops)
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
    console.log('props.pages', this.props.pages)
    if (this.props.pages && this.props.pages.length === 0) {
      this.msg.error('Please connect atleast one page')
    } else {
      this.props.history.push({
        pathname: `/inviteUsingLinkWizard`
      })
    }
  }
  onDismissAlert () {
    this.setState({showAlert: false, alertmsg: ''})
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
        <Header />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
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
                    <a href='#/' style={{color: 'white'}} onClick={this.closeDialog} className='btn btn-primary'>
                      Continue
                    </a>
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
          <div className='m-portlet m-portlet--full-height'>
            <div className='m-portlet__body m-portlet__body--no-padding'>
              <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                  <Sidebar history={this.props.history} step='1' pages={this.props.pages} showError={this.showError} user={this.props.user} stepNumber={getCurrentProduct() === 'KiboEngage' ? 6 : 5} />
                  <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', boxShadow: 'none'}}>
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
                      {
                        this.props.otherPages && this.props.otherPages.length > 0
                        ? <div className='form-group m-form__group row'>
                          <label style={{fontWeight: 'normal'}}>This page will help you connect your Facebook pages. You will not be able to use any of the features of KiboPush unless you connect any Facebook pages.
                          To connect the pages click on connect buttons.</label>
                        </div>
                        : <div className='form-group m-form__group row'>
                          <label style={{fontWeight: 'normal'}}>You are not admin of any Facebook page. In order to use the application you must need to create your own Facebook page and grow audience.</label>
                        </div>
                      }
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

                                              <a href='#/' onClick={() => this.props.removePageInAddPage(page)} className='m-widget4__icon'>
                                                <button type='button' className='btn m-btn--pill btn-danger btn-sm m-btn m-btn--custom'>Disconnect</button>
                                              </a>
                                                    }
                                              {(!page.connected) &&

                                              <a href='#/' onClick={() => this.props.enablePage(page)} className='m-widget4__icon'>
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
                            { /* this.props.otherPages && this.props.otherPages.length > 0
                           ? <Link to='/inviteUsingLinkWizard' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                             <span>
                               <span>Next</span>&nbsp;&nbsp;
                               <i className='la la-arrow-right' />
                             </span>
                           </Link> */}
                            <button onClick={this.goToNext} className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
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
    addPages: addPages,
    updateChecks: updateChecks,
    loadMyPagesListNew: loadMyPagesListNew
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPage)
