/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { loadAutopostingList, deleteautoposting } from '../../redux/actions/autoposting.actions'
import AddChannel from './addChannel'
import ListItem from './ListItem'
import YouTube from 'react-youtube'
import { registerAction } from '../../utility/socketio'
import AlertContainer from 'react-alert'

class Autoposting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showListItems: true,
      deleteid: '',
      openVideo: false
    }
    props.loadAutopostingList()
    this.gotoSettings = this.gotoSettings.bind(this)
    this.gotoMessages = this.gotoMessages.bind(this)
    this.updateDeleteID = this.updateDeleteID.bind(this)
    this.viewGuide = this.viewGuide.bind(this)
    this.gotoRssIntegration = this.gotoRssIntegration.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoAutoposting.click()
  }

  gotoRssIntegration() {
    this.props.history.push({
      pathname: `/rssIntegration`
    })
  }

  scrollToTop() {
    this.top.scrollIntoView({ behavior: 'instant' })
  }
  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
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

  viewGuide() {
    this.refs.guide.click()
  }
  UNSAFE_componentWillReceiveProps(nextProps) {

  }

  updateDeleteID(id) {
    this.setState({ deleteid: id })
  }

  gotoSettings(item) {
    this.props.history.push({
      pathname: `/autopostingItemSettings`,
      state: item
    })
  }

  gotoMessages(item) {
    this.props.history.push({
      pathname: `/autopostingMessages`,
      state: item
    })
  }

  render() {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    console.log('autoposting history', this.props.location)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='guide' data-toggle="modal" data-target="#guide">guide</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)', zIndex: 9999 }} className="modal fade" id="guide" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Guidelines for integrating WordPress blogs
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div className='panel-group accordion' id='accordion1'>
                  <div className='panel panel-default'>
                    <div className='panel-heading guidelines-heading'>
                      <h4 className='panel-title'>
                        <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>WordPress.com</a>
                      </h4>
                    </div>
                    <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
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
                    <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
                      <div className='panel-body'>
                        <p>On self-hosted wordpress sites, Download and install our Plugin <a href={'api/autoposting/plugin'} download target='_blank' rel='noopener noreferrer'>HookPress by KiboPush</a> and follow the steps below to allow autoposting</p>
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
              </div>
            </div>
          </div>
        </div>
        <div style={{ float: 'left', clear: 'both' }}
          ref={(el) => { this.top = el }} />
        <a href='#/' style={{ display: 'none' }} ref='videoAutoposting' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoAutoposting">videoMessengerRefModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoAutoposting" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Autoposting Video Tutorial
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
              <div style={{ color: 'black' }} className="modal-body">
              {this.state.openVideo && <YouTube
                  videoId='Rt4uOwG9vQE'
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

        <AddChannel msg={this.msg} openGuidelines={this.viewGuide} gotoRssIntegration={this.gotoRssIntegration} />

        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="deleteFeed" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Integration
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to delete this integration?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deleteautoposting(this.state.deleteid, this.msg)
                  }}
                  data-dismiss='modal'>Delete
                          </button>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Auto Posting</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
            <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-technology m--font-accent' />
              </div>
              <div className='m-alert__text'>
                Need help in understanding Auto Posting? Here is the <a href='https://kibopush.com/autoposting/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
              </div>
            </div>
            <div
              className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
              role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation m--font-brand' />
              </div>
              <div className='m-alert__text'>
              Connect several feeds and information sources to send updates to your subscribers. Your page must have Facebook's News Page Index (NPI) permission to successfully reach all subscribers. otherwise, only those subscribers will receive updates who has an active conversation with you in last 24 hours.              <br/>
              To register for NPI follow the link: <a href='https://www.facebook.com/help/publisher/377680816096171' target='_blank' rel='noopener noreferrer'>Register to News Page Index</a>.
            </div>
            </div>
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
                    <Link data-toggle="modal" data-target="#addFeed">
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
                      <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
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

function mapStateToProps(state) {
  console.log(state)
  return {
    autopostingData: (state.autopostingInfo.autopostingData),
    pages: (state.pagesInfo.pages),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadAutopostingList: loadAutopostingList,
    deleteautoposting: deleteautoposting
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Autoposting)
