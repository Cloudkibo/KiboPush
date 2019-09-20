/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { loadAutopostingList, deleteautoposting } from '../../redux/actions/autoposting.actions'
import AddChannel from './addChannel'
import ListItem from './ListItem'
import YouTube from 'react-youtube'
import { registerAction } from '../../utility/socketio'
import AlertContainer from 'react-alert'
import SubscriptionPermissionALert from '../../components/alertMessages/subscriptionPermissionAlert'

class Autoposting extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowingModal: false,
      isShowingModalDelete: false,
      showListItems: true,
      deleteid: '',
      showWordPressGuide: false,
      newsPageIndex: props.pages.filter((component) => { return (component.gotPageSubscriptionPermission) })
    }
    props.loadAutopostingList()
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.gotoSettings = this.gotoSettings.bind(this)
    this.gotoMessages = this.gotoMessages.bind(this)
    this.updateDeleteID = this.updateDeleteID.bind(this)
    this.closeGuide = this.closeGuide.bind(this)
    this.viewGuide = this.viewGuide.bind(this)
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Autoposting`;
    this.scrollToTop()
    var compProp = this.props
    registerAction({
      event: 'autoposting_created',
      action: function (data) {
        compProp.loadAutopostingList()
      }
    })
  }
  viewGuide () {
    this.setState({
      showWordPressGuide: true
    })
  }
  closeGuide () {
    this.setState({
      showWordPressGuide: false
    })
  }
  componentWillReceiveProps (nextProps) {}

  updateDeleteID (id) {
    this.setState({deleteid: id})
    this.showDialogDelete()
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  showDialogDelete () {
    this.setState({isShowingModalDelete: true})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  gotoSettings (item) {
    this.props.history.push({
      pathname: `/autopostingItemSettings`,
      state: item
    })
  }

  gotoMessages (item) {
    this.props.history.push({
      pathname: `/autopostingMessages`,
      state: item
    })
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <SubscriptionPermissionALert />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
        this.state.showWordPressGuide &&
        <ModalContainer style={{width: '500px', top: '80px'}}
          onClose={this.closeGuide}>
          <ModalDialog style={{width: '500px', top: '80px'}}
            onClose={this.closeGuide}>
            <h4>Guidelines for integrating WordPress blogs</h4>
            <div className='panel-group accordion' id='accordion1'>
              <div className='panel panel-default'>
                <div className='panel-heading guidelines-heading'>
                  <h4 className='panel-title'>
                    <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>WordPress.com</a>
                  </h4>
                </div>
                <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                  <div className='panel-body'>
                    <p>If you have admin rights on WordPress, follow the steps below to create a webhook</p>
                    <ul>
                      <li>
                      Go to Settings -> Webhooks on WordPress dashboard
                      </li>
                      <li>
                      Choose Action: 'Publish_Post'
                      </li>
                      <li>
                      Select all the fields
                      </li>
                      <li>
                      Add our webhook endpoint: 'https://webhook.cloudkibo.com/webhooks/wordpress'
                      </li>
                      <li>
                      Click on 'Add new webhook'
                      </li>
                    </ul>
                    <p> Once you have added our webhook on WORDPRESS.COM, our endpoint will be notified whenever a new post is published.
                    Your blog post details will be automatically broadcasted to your subscribers </p>
                  </div>
                </div>
              </div>
              <div className='panel panel-default'>
                <div className='panel-heading guidelines-heading'>
                  <h4 className='panel-title'>
                    <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>WordPress.org (self-hosted version).</a>
                  </h4>
                </div>
                <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                  <div className='panel-body'>
                    <p>On self-hosted wordpress sites, Download and install our Plugin <a href={'api/autoposting/plugin'} download target='_blank'>HookPress by KiboPush</a> and follow the steps below to allow autoposting</p>
                    <ul>
                      <li>
                      Go to Settings -> Webhooks on WordPress dashboard
                      </li>
                      <li>
                      Choose Action: 'Publish_Post'
                      </li>
                      <li>
                      Select All the fields
                      </li>
                      <li>
                      Add our webhook endpoint: 'https://webhook.cloudkibo.com/webhooks/wordpressk'
                      </li>
                      <li>
                      Click on 'Add new webhook'
                      </li>
                    </ul>
                    <p> Once you have added our webhook on WORDPRESS.ORG through HookPress plug-in, our endpoint will be notified whenever a new post is published.
                    Your blog post details will be automatically broadcasted to your subscribers </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalDialog>
        </ModalContainer>
        }
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='vXN_lF7ivJY'
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
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Auto Posting</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
      { this.state.newsPageIndex.length > 0 &&
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Auto Posting? Here is the <a href='https://kibopush.com/autoposting/' target='_blank'>documentation</a>.
              Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
            </div>
          </div>
        }
        { this.state.newsPageIndex.length > 0 &&
          <div
            className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
            role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              Connect several feeds and information sources to send
              updates to your subscribers
            </div>
          </div>
        }
        { this.state.newsPageIndex.length === 0 &&
          <div
            className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
            role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              Autoposting is available for pages registered with Facebook's News Page Index (NPI) only. To register for NPI follow the link: <a href='https://www.facebook.com/help/publisher/377680816096171' target='_blank'>Register to News Page Index</a>.
              Click here to review <a href='https://developers.facebook.com/docs/messenger-platform/policy/page-subscription-messaging' target='_blank'>Facebook's Subcription Messaging Policy</a>
            </div>
          </div>
        }
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Connected Feeds
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
              {
                this.state.newsPageIndex.length > 0?
                <Link onClick={this.showDialog}>
                  <button
                    className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                    <span>
                      <i className='la la-plus' />
                      <span>
                        Add Feed
                      </span>
                    </span>
                  </button>
                </Link>
                : <Link>
                  <button
                    className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled={(this.state.newsPageIndex.length === 0)}>
                    <span>
                      <i className='la la-plus' />
                      <span>
                        Add Feed
                      </span>
                    </span>
                  </button>
                </Link>
              }
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='col-12'>
                <p> <b>Note:</b> Subscribers who are engaged in live chat with an agent, will receive autoposts after 30 mins of ending the conversation.</p>
              </div>
              <div
                className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                <div className='row align-items-center'>
                  <div className='col-xl-8 order-2 order-xl-1' />
                  <div
                    className='col-xl-4 order-1 order-xl-2 m--align-right'>
                    {
                      this.state.isShowingModal &&
                      <ModalContainer style={{width: '500px'}}
                        onClose={this.closeDialog}>
                        <ModalDialog style={{width: '500px'}}
                          onClose={this.closeDialog}>
                          <AddChannel msg={this.msg} onClose={this.closeDialog} openGuidelines={this.viewGuide} />
                        </ModalDialog>
                      </ModalContainer>
                    }
                    {
                      this.state.isShowingModalDelete &&
                      <ModalContainer style={{width: '500px'}}
                        onClose={this.closeDialogDelete}>
                        <ModalDialog style={{width: '500px'}}
                          onClose={this.closeDialogDelete}>
                          <h3>Delete Integration</h3>
                          <p>Are you sure you want to delete this integration?</p>
                          <button style={{float: 'right'}}
                            className='btn btn-primary btn-sm'
                            onClick={() => {
                              this.props.deleteautoposting(this.state.deleteid)
                              this.closeDialogDelete()
                            }}>Delete
                          </button>
                        </ModalDialog>
                      </ModalContainer>
                    }
                    <div
                      className='m-separator m-separator--dashed d-xl-none' />
                  </div>
                </div>
              </div>
              {
                this.props.autopostingData && this.props.autopostingData.length > 0
                  ? this.props.autopostingData.map((item, i) => (
                    <div className='m-widget5'>
                      <ListItem key={item._id} updateDeleteID={this.updateDeleteID} openSettings={this.gotoSettings} gotoMessages={this.gotoMessages} type={item.subscriptionType} title={item.accountTitle} username={item.userId} item={item} marginState={false} openGuidelines={this.viewGuide} />
                    </div>
                ))
                  : <p>Currently, you do not have any feeds. Click on Add Feed button to add new feeds. </p>
              }
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
    autopostingData: (state.autopostingInfo.autopostingData),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadAutopostingList: loadAutopostingList,
    deleteautoposting: deleteautoposting
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Autoposting)
