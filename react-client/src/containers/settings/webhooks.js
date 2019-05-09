/* eslint-disable no-useless-constructor */
import React from 'react'
import { browserHistory } from 'react-router'
import { loadWebhook, createEndpoint, editEndpoint, enabled } from '../../redux/actions/settings.actions'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import { isWebURL } from './../../utility/utils'
import YouTube from 'react-youtube'

class Webhook extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      isShowingModalEdit: false,
      pageSelected: '',
      selectAllChecked: null,
      selectAllCheckedEdit: null,
      subscriptions: [{name: 'New Poll', selected: false}, {'name': 'Poll Response', selected: false}, {'name': 'New Survey', selected: false}, {'name': 'Survey Response', selected: false}, {'name': 'New Subscriber', selected: false},
      {'name': 'Live Chat Actions', selected: false}, {'name': 'Checkbox Opt-in', selected: false}],
      url: '',
      token: '',
      urlEdit: '',
      subscriptionsEdit: [{name: 'New Poll', selected: false}, {'name': 'Poll Response', selected: false}, {'name': 'New Survey', selected: false}, {'name': 'Survey Response', selected: false}, {'name': 'New Subscriber', selected: false},
      {'name': 'Live Chat Actions', selected: false}, {'name': 'Checkbox Opt-in', selected: false}],
      errorUrl: '',
      errorToken: false,
      pageEdit: '',
      id: '',
      showVideo: false
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
  }
  componentWillReceiveProps (nextProps) {
    console.log('nextProps in webhooks', nextProps)
    if (nextProps.pages) {
      this.setState({pageSelected: nextProps.pages[0].pageId})
    }
    if (nextProps.response) {
      if (nextProps.response === 'success') {
        this.msg.success('Webhook saved')
        var subscriptions = this.state.subscriptions
        for (var i = 0; i < this.state.subscriptions.length; i++) {
          subscriptions[i].selected = false
        }
        this.setState({url: '', token: '', errorToken: false, errorUrl: '', subscriptions: subscriptions, isShowingModal: false, isShowingModalEdit: false})
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
      } else if (subscriptionsEdit[i].name === 'Live Chat Actions') {
        subscriptionsEdit[i].selected = webhook.optIn.LIVE_CHAT_ACTIONS
      } else if (subscriptionsEdit[i].name === 'Checkbox Opt-in') {
        subscriptionsEdit[i].selected = webhook.optIn.CHECKBOX_OPTIN
      }
    }
    for (var j = 0; j < this.props.pages.length; j++) {
      if (this.props.pages[j].pageId === webhook.pageId) {
        this.setState({pageEdit: this.props.pages[j]})
      }
    }
    this.setState({id: webhook._id, urlEdit: webhook.webhook_url, pageSelectedEdit: webhook.pageId, subscriptionsEdit: subscriptionsEdit, isShowingModalEdit: true})
  }

  closeDialogEdit () {
    this.setState({isShowingModalEdit: false, errorUrl: '', errorToken: false})
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
        } else if (this.state.subscriptions[i].name === 'Live Chat Actions') {
          optIn['LIVE_CHAT_ACTIONS'] = this.state.subscriptions[i].selected
        } else if (this.state.subscriptions[i].name === 'Checkbox Opt-in') {
          optIn['CHECKBOX_OPTIN'] = this.state.subscriptions[i].selected
        }
      }
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
        } else if (this.state.subscriptionsEdit[i].name === 'Live Chat Actions') {
          optIn['LIVE_CHAT_ACTIONS'] = this.state.subscriptionsEdit[i].selected
        } else if (this.state.subscriptionsEdit[i].name === 'Checkbox Opt-in') {
          optIn['CHECKBOX_OPTIN'] = this.state.subscriptionsEdit[i].selected
        }
      }
      this.props.editEndpoint({_id: this.state.id, webhook_url: this.state.urlEdit, token: this.state.token, optIn: optIn}, this.msg)
    }
  }
  enabled (data, id) {
    this.props.enabled({_id: id, isEnabled: data}, this.msg)
  }
  gotoView (page) {
    browserHistory.push({
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
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='LxlrENo0vW8'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
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
              <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog} style={{marginTop: '15px'}} data-toggle='modal' data-target='#m_modal_1_2'>
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
                        Need help in understanding Webhooks? Here is the <a href='http://kibopush.com/webhook/' target='_blank'>documentation</a>.
                        Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a> to understand this feature.
                        </div>
                      </div>
                      {
                        this.state.isShowingModal &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialog}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialog}>
                            <h3>Create Endpoint</h3>
                            <div className='m-form'>
                              <div className='form-group m-form__group'>
                                <label className='control-label'>Select Page:&nbsp;&nbsp;&nbsp;</label>
                                <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                                  {
                                    this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                      <option key={i} value={page.pageId}>{page.pageName}</option>
                                    ))
                                  }
                                </select>
                                <div id='question' className='form-group m-form__group'>
                                  <label className='control-label'>Callback URL</label>
                                  {this.state.errorUrl &&
                                    <div id='email-error' style={{color: 'red', fontWeight: 'bold'}}><bold>{this.state.errorUrl}</bold></div>
                                    }
                                  <input className='form-control'
                                    value={this.state.url} onChange={(e) => this.updateURL(e)} />
                                </div>
                                <div id='question' className='form-group m-form__group'>
                                  <label className='control-label'>Verify Token:</label>
                                  {this.state.errorToken &&
                                    <div id='email-error' style={{color: 'red', fontWeight: 'bold'}}><bold>Please enter token</bold></div>
                                    }
                                  <input className='form-control'
                                    value={this.state.token} onChange={(e) => this.updateToken(e)} />
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
                            <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                              <div className='m-form__actions' style={{'float': 'right'}}>
                                <button className='btn btn-primary'
                                  onClick={this.save}> Save
                                </button>
                                <button
                                  className='btn btn-secondary' style={{'margin-left': '10px'}} onClick={this.cancel}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </ModalDialog>
                        </ModalContainer>
                      }
                      {
                        this.state.isShowingModalEdit &&
                        <ModalContainer style={{width: '500px'}}
                          onClose={this.closeDialogEdit}>
                          <ModalDialog style={{width: '500px'}}
                            onClose={this.closeDialogEdit}>
                            <h3>Edit Endpoint</h3>
                            <div className='m-form'>
                              <div className='form-group m-form__group'>
                                <label className='control-label'>Page:&nbsp;&nbsp;&nbsp;</label>
                                <span>
                                  <img alt='pic' style={{height: '30px'}} src={(this.state.pageEdit.pagePic) ? this.state.pageEdit.pagePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} />&nbsp;&nbsp;
                                  <span>{this.state.pageEdit.pageName}</span>
                                </span>
                                <div id='question' className='form-group m-form__group'>
                                  <label className='control-label'>Callback URL</label>
                                  {this.state.errorUrl &&
                                    <div id='email-error' style={{color: 'red', fontWeight: 'bold'}}><bold>Please enter a callback URL</bold></div>
                                    }
                                  <input className='form-control'
                                    value={this.state.urlEdit} onChange={(e) => this.updateURLEdit(e)} />
                                </div>
                                <div id='question' className='form-group m-form__group'>
                                  <label className='control-label'>Verify Token:</label>
                                  {this.state.errorToken &&
                                    <div id='email-error' style={{color: 'red', fontWeight: 'bold'}}><bold>Please enter token</bold></div>
                                    }
                                  <input className='form-control'
                                    value={this.state.token} onChange={(e) => this.updateToken(e)} />
                                </div>
                              </div>
                              <div className='form-group m-form__group'>
                                <label className='control-label'>Filter Events:</label>&nbsp;&nbsp;&nbsp;
                                <span style={{width: '30px', overflow: 'inherit'}}>
                                  <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllCheckedEdit} onChange={this.handleSubscriptionClickEdit} />&nbsp;&nbsp;Select All</span>
                                <br />
                                {this.state.subscriptionsEdit.map(subscription => (
                                  <div className='row'>
                                    <div className='col-md-2' />
                                    <div className='col-md-10'>
                                      <span style={{marginLeft: '13px'}}>
                                        <input type='checkbox' value={subscription.name} onChange={this.handleSubscriptionClickEdit} checked={subscription.selected} />&nbsp;&nbsp;
                                        {subscription.name}
                                      </span>
                                    </div>
                                    <br />
                                  </div>
                                  ))}
                              </div>
                            </div>
                            <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                              <div className='m-form__actions' style={{'float': 'right'}}>
                                <button className='btn btn-primary'
                                  onClick={this.saveEdited}> Save
                                </button>
                                <button onClick={this.closeDialogEdit}
                                  className='btn btn-secondary' style={{'margin-left': '10px'}}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </ModalDialog>
                        </ModalContainer>
                      }
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
                                            <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-secondary' style={{borderColor: '#5867dd', color: '#5867dd', marginRight: '10px'}} onClick={() => this.showDialogEdit(webhook)}>
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
