/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import RssFeed from './RssFeed'
import { registerAction } from '../../utility/socketio'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import { fetchRssFeed, deleteRssFeed } from '../../redux/actions/rssIntegration.actions'

class RssIntegrations extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newsPages: [],
      deleteId: ''
    }
    props.fetchRssFeed()
    this.gotoSettings = this.gotoSettings.bind(this)
    this.gotoMessages = this.gotoMessages.bind(this)
    this.setDeleteId = this.setDeleteId.bind(this)
    this.viewGuide = this.viewGuide.bind(this)
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  setDeleteId (id) {
    this.setState({deleteId: id})
  }
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Rss Integration for News Publishers`;
    this.scrollToTop()
    // var compProp = this.props
    registerAction({
      event: 'autoposting_created',
      action: function (data) {
        // compProp.loadAutopostingList()
      }
    })
    if(this.props.pages){
      let newsPages = this.props.pages.filter((component) => { return (component.gotPageSubscriptionPermission)})
      this.setState({newsPages: newsPages})
    }
  }
  viewGuide () {
    this.refs.guide.click()
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if(nextProps.pages !== this.props.pages) {
      this.setState({newsPages: nextProps.pages.filter((component) => { return (component.gotPageSubscriptionPermission) })})
    }
  }

  updateDeleteID (id) {
    this.setState({deleteid: id})
  }

  gotoSettings (item) {
    this.props.history.push({
      pathname: `/editFeed`,
      state: item
    })
  }

  gotoMessages (item) {
    this.props.history.push({
      pathname: `/feedPosts`,
      state: item
    })
  }

  render () {
    console.log('this.state.newsPages.length', this.state.newsPages.length)
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}} ref={(el) => { this.top = el }} />
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Autoposting Video Tutorial
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{color: 'black'}} className="modal-body">
                <YouTube
                  videoId='Rt4uOwG9vQE'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
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
                <p>Are you sure you want to delete this Rss Feed Integration?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deleteRssFeed(this.state.deleteid)
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
              <h3 className='m-subheader__title'>Rss Integration</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Rss Integration? Here is the <a href='https://kibopush.com/autoposting/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' data-toggle="modal" data-target="#video">video tutorial</a>
            </div>
          </div>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <span className='m-portlet__head-icon'>
                    <i className='fa fa-feed' style={{color: '#365899'}} />
                  </span>
                  <h3 className='m-portlet__head-text'>
                    Connected Rss Feeds
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <button
                  className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                  <span>
                    <i className='la la-plus' />
                    <span>
                      Add Feed
                    </span>
                  </span>
                </button>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='col-12'>
                <p>A daily update will be sent to your subscribers from default news feed. Your subscribers can choose to subscribe from the Rss feeds you have enabled.</p>
              </div>
              <div className='col-12'>
                <p> <b>Note:</b> Subscribers who are engaged in live chat with an agent, will receive autoposts after 30 mins of ending the conversation.</p>
              </div>
              <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                <div className='row align-items-center'>
                  <div className='col-xl-8 order-2 order-xl-1' />
                  <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                    <div className='m-separator m-separator--dashed d-xl-none' />
                  </div>
                </div>
              </div>
              <div className='m-widget5'>
                { this.props.feeds && this.props.feeds.length > 0 
                ? this.props.rssFeeds.map((feed, i) => (
                  <RssFeed feed={feed} 
                    openSettings={this.props.gotoSettings} 
                    gotoMessages={this.props.gotoMessages}
                    setDeleteId={this.props.setDeleteId}
                  />
                ))
                : <div>You have no connected Rss Feeds</div>
                }
                </div>
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
    pages: (state.pagesInfo.pages),
    rssFeeds: (state.feedsInfo.rssFeeds)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchRssFeed: fetchRssFeed,
    deleteRssFeed: deleteRssFeed
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(RssIntegrations)
