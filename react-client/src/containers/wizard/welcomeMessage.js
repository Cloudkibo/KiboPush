/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { connect } from 'react-redux'
import {
  createbroadcast,
  loadBroadcastsList,
  updatefileuploadStatus,
  uploadBroadcastfile,
  sendBroadcast
} from '../../redux/actions/broadcast.actions'
import { Link } from 'react-router-dom'
import { loadCustomerLists } from '../../redux/actions/customerLists.actions'
import { loadBroadcastDetails, saveBroadcastInformation } from '../../redux/actions/templates.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { createWelcomeMessage, isWelcomeMessageEnabled } from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import ViewMessage from '../../components/ViewMessage/viewMessage'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import {getCurrentProduct} from '../../utility/utils'
import { validateFields } from '../convo/utility'

class EditTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      buttonActions: ['open website', 'open webview'],
      convoTitle: 'Welcome Message',
      broadcast: [],
      pageValue: '',
      previewMessage: '',
      welcomeMessage: false,
      pageId: this.props.pages.filter((page) => page._id === this.props.pages[0]._id)[0].pageId
    }
    props.getuserdetails()
    props.loadSubscribersList()
    props.loadCustomerLists()
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.viewGreetingMessage = this.viewGreetingMessage.bind(this)
    this.closePreviewDialog = this.closePreviewDialog.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEnableWelMessage = this.handleEnableWelMessage.bind(this)
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    if (this.state.pageValue === '') {
      this.setState({pageValue: nextprops.pages[0]._id, welcomeMessage: nextprops.pages[0].isWelcomeMessageEnabled, broadcast: nextprops.pages[0].welcomeMessage })
    }
  }
  handleEnableWelMessage (pageId, enable) {
    if (enable === true) {
      this.props.isWelcomeMessageEnabled({_id: pageId, isWelcomeMessageEnabled: true})
    } else {
      this.props.isWelcomeMessageEnabled({_id: pageId, isWelcomeMessageEnabled: false})
    }
  }

  pageChange (event) {
    if (event === null) {
      this.setState({pageValue: event})
      return
    }

    var pageId = this.props.pages.filter((page) => page._id === event.target.value)[0].pageId
    this.setState({pageValue: event.target.value, pageId: pageId})
    for (var i = 0; i < this.props.pages.length; i++) {
      if (event.target.value === this.props.pages[i]._id) {
        this.setState({welcomeMessage: this.props.pages[i].isWelcomeMessageEnabled, broadcast: this.props.pages[i].welcomeMessage})
      }
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

    document.title = `${title} | Welcome Message`
    let options = []
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
    }

    this.setState({page: {options: options}})
  }

  handleChange (broadcast) {
    this.setState(broadcast)
  }

  sendConvo () {
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    this.props.createWelcomeMessage({_id: this.state.pageValue, welcomeMessage: this.state.broadcast}, this.msg)
  }

  initializePageSelect (pageOptions) {
    var self = this
    /* eslint-disable */
    $('#selectPage').select2({
   /* eslint-enable */
      data: pageOptions,
      placeholder: 'Select Pages',
      allowClear: true
    })
    // this.setState({pageValue: pageOptions[0].id})
    // console.log("Setting pageValue in InitPage Select", this.state.pageValue)
    /* eslint-disable */
    $('#selectPage').on('change', function (e) {
    /* eslint-enable */
      // var selectedIndex = e.target.selectedIndex
      // if (selectedIndex !== '-1') {
      var selectedOptions = e.target.selectedOptions[0].value
      // var selected = []
      // for (var i = 0; i < selectedOptions.length; i++) {
      //   var selectedOption = selectedOptions[i].value
      //   selected.push(selectedOption)
      // }
      self.setState({ pageValue: selectedOptions })
      for (var i = 0; i < self.props.pages.length; i++) {
        if (selectedOptions === self.props.pages[i].pageId) {
          this.setState({broadcast: this.props.pages[0].welcomeMessage})
        }
      }
    })
  }
  viewGreetingMessage (e) {
    this.setState({showPreview: true})
  }
  closePreviewDialog () {
    this.setState({showPreview: false})
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
      <div style={{marginLeft: '-255px'}} className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                Welcome Message Preview
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
										</span>
                </button>
              </div>
              <div style={{color: 'black'}} className="modal-body">
              {  this.state.showPreview && <ViewMessage user={this.props.user} payload={this.state.broadcast} />}
              </div>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-portlet m-portlet--full-height'>
            <div className='m-portlet__body m-portlet__body--no-padding'>
              <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                  <Sidebar history={this.props.history} step='3' user={this.props.user} stepNumber={getCurrentProduct() === 'KiboEngage' ? 5 : 4} />
                  <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Step 3: Welcome Message
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='form-group m-form__group row'>
                        <label style={{fontWeight: 'normal'}}>This page will help you setup welcome message for your page. Welcome message is sent when a subscriber starts the conversation with you by tapping getting started on messenger. We have set a default message for you. Click on "See how it looks" to see how it would look on messenger. Modify it and create your desired welcome message for your messenger susbcribers. Here you can set a welcome message using text component only but you can set a weclome message using image, audio, video, file, cards, and gallery later from our settings page.</label>
                      </div>
                      <br />
                      <div className='form-group m-form__group row'>
                        <label className='col-3 col-form-label' style={{textAlign: 'left'}}>Change Page</label>
                        <div className='col-8 input-group'>
                          <select
                            className='form-control m-input'
                            placeholder='Select a page...'
                            onChange={this.pageChange}
                            style={{width: 'inherit'}}>
                            { this.props.pages.map((page, i) => (
                            (
                              page.connected &&
                              <option
                                value={page._id} name={page.pageName} key={page.pageId} selected={page._id === this.state.pageValue}>{page.pageName}</option>
                            )
                          ))
                          }
                          </select>
                        </div>
                      </div>
                      <br />
                      <center>
                        <GenericMessage
                          noDefaultHeight
                          pageId={this.state.pageId}
                          broadcast={this.state.broadcast}
                          handleChange={this.handleChange}
                          convoTitle={this.state.convoTitle}
                          buttonActions={this.state.buttonActions} />
                      </center>
                      <div className='row'>
                        <div className='col-lg-6 m--align-left' >
                          {
                            <div className='row'>
                              <label className='col- col-form-label' style={{fontWeight: 'normal', marginRight: '15px', marginTop: '8px'}}>Enable Welcome Message</label>
                              <div className='col-3'>
                                <span className='m-switch m-switch--outline m-switch--icon m-switch--success' style={{marinTop: '10px'}}>
                                  <label>
                                    <input type='checkbox' data-switch='true' checked={this.state.welcomeMessage} onChange={() => { this.handleEnableWelMessage(this.state.pageValue, !this.state.welcomeMessage)}} />
                                    <span></span>
                                  </label>
                                </span>
                              </div>
                            </div>
                          }
                        </div>
                        <div className='col-lg-6 m--align-right'>
                          <a href='#/' className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer', margin: '10px', display: 'inline-block'}} data-toggle="modal" data-target="#preview" onClick={this.viewGreetingMessage}>See how it looks </a>
                          <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.sendConvo}>Save</button>
                        </div>
                      </div>
                    </div>
                    <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                      <div className='m-form__actions'>
                        <div className='row'>
                          <div className='col-lg-6 m--align-left' >
                            <Link to='/greetingTextWizard' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                              <span>
                                <i className='la la-arrow-left' />
                                <span>Back</span>&nbsp;&nbsp;
                              </span>
                            </Link>
                          </div>
                          <div className='col-lg-6 m--align-right'>
                            <Link to={getCurrentProduct() === 'KiboEngage' ||  getCurrentProduct() === 'localhost' ? '/autopostingWizard' : '/menuWizard'} className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
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
    broadcasts: (state.broadcastsInfo.broadcasts),
    showFileUploading: (state.broadcastsInfo.showFileUploading),
    pages: (state.pagesInfo.pages),
    fileInfo: (state.convosInfo.fileInfo),
    user: (state.basicInfo.user),
    broadcastDetails: (state.templatesInfo.broadcastDetails),
    currentBroadcast: (state.templatesInfo.currentBroadcast),
    customerLists: (state.listsInfo.customerLists),
    subscribers: (state.subscribersInfo.subscribers)

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBroadcastsList: loadBroadcastsList,
      uploadBroadcastfile: uploadBroadcastfile,
      createbroadcast: createbroadcast,
      updatefileuploadStatus: updatefileuploadStatus,
      sendBroadcast: sendBroadcast,
      getuserdetails: getuserdetails,
      loadBroadcastDetails: loadBroadcastDetails,
      saveBroadcastInformation: saveBroadcastInformation,
      createWelcomeMessage: createWelcomeMessage,
      loadCustomerLists: loadCustomerLists,
      loadSubscribersList: loadSubscribersList,
      isWelcomeMessageEnabled: isWelcomeMessageEnabled,
      loadMyPagesList: loadMyPagesList
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate)
