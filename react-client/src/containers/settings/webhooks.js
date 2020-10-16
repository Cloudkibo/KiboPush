/* eslint-disable no-useless-constructor */
import React from 'react'
import { loadWebhook, createEndpoint, editEndpoint, enabled } from '../../redux/actions/settings.actions'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { isWebURL } from './../../utility/utils'
import YouTube from 'react-youtube'

class Webhook extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      pageSelected: '',
      selectAllChecked: null,
      selectAllCheckedEdit: null,
      subscriptions: [
        {'name': 'New Subscriber', selected: false},
        {'name': 'New Chat Message', selected: false},
        {'name': 'Checkbox Opt-in', selected: false},
        {'name': 'New Poll', selected: false},
        {'name': 'Poll Response', selected: false},
        {'name': 'New Survey', selected: false},
        {'name': 'Survey Response', selected: false},
      ],
      url: '',
      token: '',
      urlEdit: '',
      subscriptionsEdit: [
        {'name': 'New Subscriber', selected: false},
        {'name': 'New Chat Message', selected: false},
        {'name': 'Checkbox Opt-in', selected: false},
        {'name': 'New Poll', selected: false},
        {'name': 'Poll Response', selected: false},
        {'name': 'New Survey', selected: false},
        {'name': 'Survey Response', selected: false},
      ],
      errorUrl: '',
      errorToken: false,
      pageEdit: '',
      id: '',
      openVideo: false
    }
    props.loadWebhook()
    props.loadMyPagesList()
    this.gotoView = this.gotoView.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialogEdit = this.closeDialogEdit.bind(this)
    this.showDialogEdit = this.showDialogEdit.bind(this)
    this.changePage = this.changePage.bind(this)
    this.updateURL = this.updateURL.bind(this)
    this.updateURLEdit = this.updateURLEdit.bind(this)
    this.updateToken = this.updateToken.bind(this)
    this.handleSubscriptionClick = this.handleSubscriptionClick.bind(this)
    this.handleSubscriptionClickEdit = this.handleSubscriptionClickEdit.bind(this)
    this.save = this.save.bind(this)
    this.cancel = this.cancel.bind(this)
    this.edit = this.edit.bind(this)
    this.saveEdited = this.saveEdited.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoWebhook.click()
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in webhooks', nextProps)
    if (nextProps.pages) {
      this.setState({pageSelected: nextProps.pages[0]._id})
    }
    if (nextProps.response) {
      if (nextProps.response === 'success') {
        this.msg.success('Webhook saved')
        var subscriptions = this.state.subscriptions
        for (var i = 0; i < this.state.subscriptions.length; i++) {
          subscriptions[i].selected = false
        }
        this.setState({url: '', token: '', errorToken: false, errorUrl: '', subscriptions: subscriptions, isShowingModal: false})
      }
    }
  }
  componentDidMount () {
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  showDialogEdit (webhook) {
    let subscriptionsEdit = this.state.subscriptionsEdit
    for (var i = 0; i < subscriptionsEdit.length; i++) {
      if (subscriptionsEdit[i].name === 'New Poll') {
        subscriptionsEdit[i].selected = webhook.optIn.POLL_CREATED
      } else if (subscriptionsEdit[i].name === 'Poll Response') {
        subscriptionsEdit[i].selected = webhook.optIn.POLL_RESPONSE
      } else if (subscriptionsEdit[i].name === 'New Survey') {
        subscriptionsEdit[i].selected = webhook.optIn.SURVEY_CREATED
      } else if (subscriptionsEdit[i].name === 'Survey Response') {
        subscriptionsEdit[i].selected = webhook.optIn.SURVEY_RESPONSE
      } else if (subscriptionsEdit[i].name === 'New Subscriber') {
        subscriptionsEdit[i].selected = webhook.optIn.NEW_SUBSCRIBER
      } else if (subscriptionsEdit[i].name === 'New Chat Message') {
        subscriptionsEdit[i].selected = webhook.optIn.NEW_CHAT_MESSAGE
      } else if (subscriptionsEdit[i].name === 'Checkbox Opt-in') {
        subscriptionsEdit[i].selected = webhook.optIn.CHECKBOX_OPT_IN
      }
    }
    for (var j = 0; j < this.props.pages.length; j++) {
      if (this.props.pages[j]._id === webhook.pageId) {
        this.setState({pageEdit: this.props.pages[j]})
      }
    }
    this.setState({id: webhook._id, urlEdit: webhook.webhook_url, pageSelectedEdit: webhook.pageId, subscriptionsEdit: subscriptionsEdit})
  }

  closeDialogEdit () {
    this.setState({errorUrl: '', errorToken: false})
  }
  updateURL (e) {
    this.setState({url: e.target.value, errorUrl: ''})
  }
  updateURLEdit (e) {
    this.setState({urlEdit: e.target.value, errorUrl: ''})
  }
  updateToken (e) {
    this.setState({token: e.target.value, errorToken: false})
  }
  changePage (e) {
    this.setState({pageSelected: e.target.value})
  }
  handleSubscriptionClick (e) {
    var subscriptions = this.state.subscriptions
    var subscriptionsAll = this.state.subscriptions
    if (e.target.value === 'All') {
      if (e.target.checked) {
        this.setState({
          selectAllChecked: true
        })
        for (var j = 0; j < this.state.subscriptions.length; j++) {
          subscriptions[j].selected = true
        }
      } else {
        this.setState({
          selectAllChecked: false
        })
        for (var m = 0; m < this.state.subscriptions.length; m++) {
          subscriptions[m].selected = false
        }
      }
      this.setState({subscriptions: subscriptions})
      this.setState({subscriptionsData: subscriptionsAll})
      return
    }
    if (e.target.value !== '') {
      if (e.target.checked) {
        for (var p = 0; p < this.state.subscriptions.length; p++) {
          if (subscriptions[p].name === e.target.value) {
            subscriptions[p].selected = true
          }
        }
        this.setState({subscriptions: subscriptions})
      } else {
        for (var q = 0; q < this.state.subscriptions.length; q++) {
          if (subscriptions[q].name === e.target.value) {
            subscriptions[q].selected = false
          }
        }
        // subscribers[e.target.value].selected = false
        this.setState({subscriptions: subscriptions})
        // this.setState({subscribersDataAll: subscribersAll})
      }
    }
  }
  handleSubscriptionClickEdit (e) {
    var subscriptions = this.state.subscriptionsEdit
    if (e.target.value === 'All') {
      if (e.target.checked) {
        this.setState({
          selectAllCheckedEdit: true
        })
        for (var j = 0; j < this.state.subscriptionsEdit.length; j++) {
          subscriptions[j].selected = true
        }
      } else {
        this.setState({
          selectAllCheckedEdit: false
        })
        for (var m = 0; m < this.state.subscriptionsEdit.length; m++) {
          subscriptions[m].selected = false
        }
      }
      this.setState({subscriptionsEdit: subscriptions})
      return
    }
    if (e.target.value !== '') {
      if (e.target.checked) {
        for (var p = 0; p < this.state.subscriptionsEdit.length; p++) {
          if (subscriptions[p].name === e.target.value) {
            subscriptions[p].selected = true
          }
        }
        this.setState({subscriptionsEdit: subscriptions})
      } else {
        for (var q = 0; q < this.state.subscriptionsEdit.length; q++) {
          if (subscriptions[q].name === e.target.value) {
            subscriptions[q].selected = false
          }
        }
        // subscribers[e.target.value].selected = false
        this.setState({subscriptionsEdit: subscriptions})
        // this.setState({subscribersDataAll: subscribersAll})
      }
    }
  }
  save () {
    let optIn = {}
    if (this.state.url === '') {
      this.setState({errorUrl: 'Please enter a URL'})
    } else if (!isWebURL(this.state.url)) {
      this.setState({errorUrl: 'Please enter a valid URL'})
    } else if (this.state.token === '') {
      this.setState({errorToken: true})
    } else {
      for (var i = 0; i < this.state.subscriptions.length; i++) {
        if (this.state.subscriptions[i].name === 'New Poll') {
          optIn['POLL_CREATED'] = this.state.subscriptions[i].selected
        } else if (this.state.subscriptions[i].name === 'Poll Response') {
          optIn['POLL_RESPONSE'] = this.state.subscriptions[i].selected
        } else if (this.state.subscriptions[i].name === 'New Survey') {
          optIn['SURVEY_CREATED'] = this.state.subscriptions[i].selected
        } else if (this.state.subscriptions[i].name === 'Survey Response') {
          optIn['SURVEY_RESPONSE'] = this.state.subscriptions[i].selected
        } else if (this.state.subscriptions[i].name === 'New Subscriber') {
          optIn['NEW_SUBSCRIBER'] = this.state.subscriptions[i].selected
        } else if (this.state.subscriptions[i].name === 'New Chat Message') {
          optIn['NEW_CHAT_MESSAGE'] = this.state.subscriptions[i].selected
        } else if (this.state.subscriptions[i].name === 'Checkbox Opt-in') {
          optIn['CHECKBOX_OPT_IN'] = this.state.subscriptions[i].selected
        }
      }
      this.refs.createModal.click()
      this.props.createEndpoint({pageId: this.state.pageSelected, webhook_url: this.state.url, token: this.state.token, optIn: optIn}, this.msg)
    }
  }
  cancel () {
    var subscriptions = this.state.subscriptions
    for (var i = 0; i < this.state.subscriptions.length; i++) {
      subscriptions[i].selected = false
    }
    this.setState({url: '', token: '', errorToken: false, errorUrl: '', subscriptions: subscriptions, isShowingModal: false})
  }
  edit (webhook) {
    // let subscriptionsEdit = this.state.subscriptionsEdit
    // for (var i = 0; i < subscriptionsEdit.length; i++) {
    //   if (subscriptionsEdit[i].name === 'New Poll') {
    //     subscriptionsEdit[i].selected = webhook.optIn.POLL_CREATED
    //   } else if (subscriptionsEdit[i].name === 'Poll Response') {
    //     subscriptionsEdit[i].selected = webhook.optIn.POLL_RESPONSE
    //   } else if (subscriptionsEdit[i].name === 'New Survey') {
    //     subscriptionsEdit[i].selected = webhook.optIn.SURVEY_CREATED
    //   } else if (subscriptionsEdit[i].name === 'Survey Response') {
    //     subscriptionsEdit[i].selected = webhook.optIn.SURVEY_RESPONSE
    //   } else if (subscriptionsEdit[i].name === 'New Subscriber') {
    //     subscriptionsEdit[i].selected = webhook.optIn.NEW_SUBSCRIBER
    //   } else if (subscriptionsEdit[i].name === 'Live Chat Actions') {
    //     subscriptionsEdit[i].selected = webhook.optIn.LIVE_CHAT_ACTIONS
    //   }
    // }
    // for (var j = 0; j < this.props.pages.length; j++) {
    //   if (this.props.pages[j].pageId === webhook.pageId) {
    //     this.setState({pageEdit: this.props.pages[j]})
    //   }
    // }
    // this.setState({id: webhook._id, urlEdit: webhook.webhook_url, pageSelectedEdit: webhook.pageId, subscriptionsEdit: subscriptionsEdit})
  }
  saveEdited () {
    let optIn = {}
    if (this.state.urlEdit === '') {
      this.setState({errorUrl: 'Please enter a URL'})
    } else if (!isWebURL(this.state.urlEdit)) {
      this.setState({errorUrl: 'Please enter a valid URL'})
    } else if (this.state.token === '') {
      this.setState({errorToken: true})
    } else {
      this.refs.editModal.click()
      for (var i = 0; i < this.state.subscriptionsEdit.length; i++) {
        if (this.state.subscriptionsEdit[i].name === 'New Poll') {
          optIn['POLL_CREATED'] = this.state.subscriptionsEdit[i].selected
        } else if (this.state.subscriptionsEdit[i].name === 'Poll Response') {
          optIn['POLL_RESPONSE'] = this.state.subscriptionsEdit[i].selected
        } else if (this.state.subscriptions[i].name === 'New Survey') {
          optIn['SURVEY_CREATED'] = this.state.subscriptionsEdit[i].selected
        } else if (this.state.subscriptionsEdit[i].name === 'Survey Response') {
          optIn['SURVEY_RESPONSE'] = this.state.subscriptionsEdit[i].selected
        } else if (this.state.subscriptionsEdit[i].name === 'New Subscriber') {
          optIn['NEW_SUBSCRIBER'] = this.state.subscriptionsEdit[i].selected
        } else if (this.state.subscriptionsEdit[i].name === 'New Chat Message') {
          optIn['NEW_CHAT_MESSAGE'] = this.state.subscriptionsEdit[i].selected
        } else if (this.state.subscriptionsEdit[i].name === 'Checkbox Opt-in') {
          optIn['CHECKBOX_OPT_IN'] = this.state.subscriptionsEdit[i].selected
        }
      }
      this.props.editEndpoint({_id: this.state.id, webhook_url: this.state.urlEdit, token: this.state.token, optIn: optIn}, this.msg)
    }
  }
  enabled (data, id) {
    this.props.enabled({_id: id, isEnabled: data}, this.msg)
  }
  gotoView (page) {
    this.props.history.push({
      pathname: `/viewWelcomeMessage`,
      state: {module: 'welcome', _id: page._id, payload: page}
    })
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='videoWebhook' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoWebhook">videoWebhook</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoWebhook" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Webhook Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })}}>
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                {this.state.openVideo && <YouTube
                  videoId='LxlrENo0vW8'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
                }
                </div>
              </div>
            </div>
          </div>
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Webhooks
                  </span>
                </li>
              </ul>
              <button ref='createModal' className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' data-toggle="modal" data-target="#endpoint" style={{marginTop: '15px'}}>
                <span>
                  <i className='la la-plus' />
                  <span>
                    Add Endpoint
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
                    <div className='m-portlet__body'>
                      <div className='form-group m-form__group'>
                        <div style={{textAlign: 'center'}} className='alert m-alert m-alert--default' role='alert'>
                        Need help in understanding Webhooks? Here is the <a href='http://kibopush.com/webhook/' target='_blank' rel='noopener noreferrer'>documentation</a>.
                        Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a> to understand this feature.
                        </div>
                      </div>
                      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="endpoint" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div style={{ display: 'block' }} className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">
                              Create Endpoint
								  	          </h5>
                              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">
                                  &times;
											          </span>
                              </button>
                            </div>
                            <div style={{ color: 'black' }} className="modal-body">
                            <div className='m-form'>
                              <div className='form-group m-form__group'>
                                <label className='control-label'>Select Page:&nbsp;&nbsp;&nbsp;</label>
                                <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                                  {
                                    this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                      <option key={i} value={page._id}>{page.pageName}</option>
                                    ))
                                  }
                                </select>
                                <div id='question' className='form-group m-form__group'>
                                  <label className='control-label'>Callback URL:</label>
                                  <input className='form-control'
                                    value={this.state.url} onChange={(e) => this.updateURL(e)} />
                                  {this.state.errorUrl &&
                                    <div id='email-error' style={{color: 'red'}}><bold>{this.state.errorUrl}</bold></div>
                                  }
                                </div>
                                <div id='question' className='form-group m-form__group'>
                                  <label className='control-label'>Verify Token:</label>
                                  <input className='form-control'
                                    value={this.state.token} placeholder='KiboPush will send back to you for callback URL verification' onChange={(e) => this.updateToken(e)} />
                                  {this.state.errorToken &&
                                    <div id='email-error' style={{color: 'red'}}><bold>Please enter token</bold></div>
                                    }
                              </div>
                              </div>
                              <div className='form-group m-form__group'>
                                <label className='control-label'>Filter Events:</label>&nbsp;&nbsp;&nbsp;
                                <span style={{width: '30px', overflow: 'inherit'}}>
                                  <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllChecked} onChange={this.handleSubscriptionClick} />&nbsp;&nbsp;Select All</span>&nbsp;&nbsp;
                                <br />
                                {this.state.subscriptions.map(subscription => (
                                  <div className='row'>
                                    <div className='col-md-2' />
                                    <div className='col-md-10'>
                                      <span style={{marginLeft: '13px'}}>
                                        <input type='checkbox' value={subscription.name} onChange={this.handleSubscriptionClick} checked={subscription.selected} />&nbsp;&nbsp;
                                        {subscription.name}
                                      </span>
                                    </div>
                                    <br />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{'overflow': 'auto', marginTop: '30px'}}>
                              <div className='m-form__actions' style={{'float': 'right'}}>
                                <button className='btn btn-primary'
                                  onClick={this.save}> Save
                                </button>
                                <button
                                  className='btn btn-secondary'
                                  style={{'margin-left': '10px'}}
                                  onClick={this.cancel}
                                  data-dismiss='modal'>
                                  Cancel
                                </button>
                              </div>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="editEndpoint" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div style={{ display: 'block' }} className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">
                                Edit Endpoint
									            </h5>
                              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">
                                  &times;
											          </span>
                              </button>
                            </div>
                            <div style={{ color: 'black' }} className="modal-body">
                              <div className='m-form'>
                                <div className='form-group m-form__group'>
                                  <label className='control-label'>Page:&nbsp;&nbsp;&nbsp;</label>
                                  <span>
                                    <img alt='pic' style={{ height: '30px' }} src={(this.state.pageEdit.pagePic) ? this.state.pageEdit.pagePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} />&nbsp;&nbsp;
                                  <span>{this.state.pageEdit.pageName}</span>
                                  </span>
                                  <div id='question' className='form-group m-form__group'>
                                    <label className='control-label'>Callback URL:</label>
                                    <input className='form-control'
                                      value={this.state.urlEdit} onChange={(e) => this.updateURLEdit(e)} />
                                      {this.state.errorUrl &&
                                        <div id='email-error' style={{ color: 'red'}}><bold>Please enter a callback URL</bold></div>
                                      }
                                  </div>
                                  <div id='question' className='form-group m-form__group'>
                                    <label className='control-label'>Verify Token:</label>
                                    <input className='form-control'
                                      placeholder='KiboPush will send back to you for callback URL verification'
                                      value={this.state.token} onChange={(e) => this.updateToken(e)} />
                                    {this.state.errorToken &&
                                      <div id='email-error' style={{ color: 'red'}}><bold>Please enter token</bold></div>
                                    }
                                  </div>
                                </div>
                                <div className='form-group m-form__group'>
                                  <label className='control-label'>Filter Events:</label>&nbsp;&nbsp;&nbsp;
                                <span style={{ width: '30px', overflow: 'inherit' }}>
                                    <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllCheckedEdit} onChange={this.handleSubscriptionClickEdit} />&nbsp;&nbsp;Select All</span>
                                  <br />
                                  {this.state.subscriptionsEdit.map(subscription => (
                                    <div className='row'>
                                      <div className='col-md-2' />
                                      <div className='col-md-10'>
                                        <span style={{ marginLeft: '13px' }}>
                                          <input type='checkbox' value={subscription.name} onChange={this.handleSubscriptionClickEdit} checked={subscription.selected} />&nbsp;&nbsp;
                                        {subscription.name}
                                        </span>
                                      </div>
                                      <br />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div style={{ 'overflow': 'auto', marginTop: '30px' }}>
                                <div className='m-form__actions' style={{ 'float': 'right' }}>
                                  <button className='btn btn-primary'
                                    onClick={this.saveEdited}> Save
                                </button>
                                  <button onClick={this.closeDialogEdit}
                                    className='btn btn-secondary' style={{ 'margin-left': '10px' }}
                                    data-dismiss='modal'>
                                    Cancel
                                </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='tab-content'>
                        <div className='tab-pane active m-scrollable' role='tabpanel'>
                          <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                            <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                              <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                                <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                                  <div className='tab-pane active' id='m_widget4_tab1_content'>
                                    {
                                      this.props.webhooks && this.props.webhooks.length > 0
                                    ? <div className='m-widget4' >
                                      {this.props.webhooks.map((webhook, i) => (
                                        <div className='m-widget4__item' key={i}>
                                          <div className='m-widget4__info'>
                                            <span className='m-widget4__title'>
                                              <i className='la la-link' />&nbsp;&nbsp;&nbsp;
                                              <span>
                                                {webhook.webhook_url}
                                              </span>
                                            </span>
                                            <br />
                                          </div>
                                          <div className='m-widget4__ext'>
                                            <button ref='editModal' className='m-btn m-btn--pill m-btn--hover-brand btn btn-secondary' style={{borderColor: '#5867dd', color: '#5867dd', marginRight: '10px'}} data-toggle="modal" data-target="#editEndpoint" onClick={() => this.showDialogEdit(webhook)}>
                                             Edit
                                           </button>
                                          </div>
                                          <div className='m-widget4__ext'>
                                            {webhook.isEnabled
                                            ? <button className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' style={{borderColor: '#f4516c', color: '#f4516c', marginRight: '10px'}} onClick={() => this.enabled(false, webhook._id)}>
                                            Disable
                                          </button>
                                          : <button className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}} onClick={() => this.enabled(true, webhook._id)}>
                                          Enable
                                        </button>
                                      }
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                      : <div>
                                          You haven't connected any endpoint yet. Please click on Add endpoint button to add your URL.
                                         </div>
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
  console.log('state in webhook', state)
  return {
    webhooks: (state.settingsInfo.webhook),
    response: (state.settingsInfo.response),
    pages: (state.pagesInfo.pages)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadWebhook: loadWebhook,
    loadMyPagesList: loadMyPagesList,
    createEndpoint: createEndpoint,
    editEndpoint: editEndpoint,
    enabled: enabled
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Webhook)
