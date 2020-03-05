import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import { updateNewsFeed, previewNewsFeed } from '../../redux/actions/rssIntegration.actions'
import { getFbAppId, getAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
import { isWebURL } from './../../utility/utils'
import { RingLoader } from 'halogenium'
import { registerAction } from '../../utility/socketio'
import { urlMetaData } from '../../redux/actions/convos.actions'
var MessengerPlugin = require('react-messenger-plugin').default

class UpdateStories extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      stories:  [{url: '', valid: false, loadingUrl: false, linkMsg: 'Please enter a valid website link'}],
      loading: false,
      saveEnabled: this.props.currentFeed && this.props.currentFeed.stories && this.props.currentFeed.stories.length > 0 ? true: false,
      fbPageId: this.props.newsPages.filter((page) => page._id === this.props.currentFeed.pageIds[0])[0].pageId
    }
    props.getFbAppId()
    props.getAdminSubscriptions()
    this.addMoreStories = this.addMoreStories.bind(this)
    this.preview = this.preview.bind(this)
    this.removeStory = this.removeStory.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
    this.validateStories = this.validateStories.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleUrlMetaData = this.handleUrlMetaData.bind(this)
    this.defaultErrorMsg = props.defaultErrorMsg ? props.defaultErrorMsg : 'Please enter a valid website link'
  }
  componentDidMount () {
    var compProp = this.props
    var comp = this
    registerAction({
      event: 'admin_subscriber',
      action: function (data) {
        compProp.getAdminSubscriptions()
        comp.msg.success('Subscribed successfully. Click on the `Preview in Messenger` button again to test')
        comp.refs.messengerModal.click()
      }
    })
    if (this.props.currentFeed && this.props.currentFeed.stories && this.props.currentFeed.stories.length > 0) {
      var stories = []
      for (var i = 0; i < this.props.currentFeed.stories.length; i++) {
        var story = {url: this.props.currentFeed.stories[i], valid: true, loadingUrl: false, linkMsg: 'Link is valid' }
        stories.push(story)
      }
      this.setState({
        stories: stories
      })
    }
  }
  handleUrlMetaData (data, index) {
    console.log('url meta data retrieved', data)
    var stories = this.state.stories
    if (!data || !data.ogTitle) {
      let linkMsg = ''
      if (!data) {
        linkMsg = 'Invalid website link'
      } else if (!data.ogTitle) {
        linkMsg = 'Not enough metadata present in link'
      }
      if (stories[index]) {
        stories[index] = {url: stories[index].url, loadingUrl: false, valid: false, linkMsg }
        this.setState({ stories })
      }
    } else {
      if (stories[index]) {
        stories[index] = {url: stories[index].url, loadingUrl: false, valid: true, linkMsg: 'Link is valid' }
        this.setState({ stories })
      }
    }
    this.validateStories(stories)
  }

  preview () {
    let pageSelected = this.props.currentFeed.pageIds[0]
    if (this.props.adminPageSubscription && this.props.adminPageSubscription.length > 0) {
      var check = this.props.adminPageSubscription.filter((obj) => { return obj.pageId === pageSelected })
      if (check.length <= 0) {
        if(this.props.fbAppId && this.props.fbAppId !== '') {
          this.refs.messengerModal.click()
        }
        return
      }
    } else {
      if(this.props.fbAppId && this.props.fbAppId !== '') {
        this.refs.messengerModal.click()
      }
      return
    }
    var stories = []
    for (var i = 0; i < this.state.stories.length; i++) {
      stories.push(this.state.stories[i].url)
    }
    var payload = {
      title: this.props.currentFeed.title,
      defaultFeed: this.props.currentFeed.defaultFeed,
      isActive: this.props.currentFeed.isActive,
      pageIds: this.props.currentFeed.pageIds,
      integrationType: 'manual',
      stories: stories
    }
    if (this.props.currentFeed && this.props.currentFeed._id) {
      payload.feedId = this.props.currentFeed._id
    }
    this.setState({
      loading: true
    })
    this.props.previewNewsFeed(payload, this.msg, () => {this.setState({loading: false})})
  }
  handleSave () {
    var stories = []
    for (var i = 0; i < this.state.stories.length; i++) {
      stories.push(this.state.stories[i].url)
    }
    var payload = {
      title: this.props.currentFeed.title,
      defaultFeed: this.props.currentFeed.defaultFeed,
      isActive: this.props.currentFeed.isActive,
      pageIds: this.props.currentFeed.pageIds,
      integrationType: 'manual',
      stories: stories
    }
    var data = {
      feedId: this.props.currentFeed._id,
      updatedObject: payload
    }
    this.props.updateNewsFeed(data, this.msg, false, () => {this.setState({ loading: false})})
  }

  addMoreStories (e) {
    var stories = this.state.stories
    stories.push({url: '', valid: false, loadingUrl: false, linkMsg: 'Please enter a valid website link'})
    this.validateStories(stories)
    this.setState({
      stories: stories
    })
  }
  removeStory (index) {
    var stories = this.state.stories
    stories.splice(index, 1)
    this.validateStories(stories)
    this.setState({
      stories: stories
    })
  }
  validateStories (stories) {
    var isValid = true
    if (stories.length > 0) {
      for (var i = 0 ; i < stories.length; i++) {
        if (!stories[i].valid || stories[i].loadingUrl) {
          isValid = false
          break
        }
      }
    }
    this.setState({
      saveEnabled: isValid
    })
  }
  changeUrl (index, e) {
    var stories = this.state.stories
    if (isWebURL(e.target.value)) {
      stories[index] = {url: e.target.value, valid: true, loadingUrl: true, linkMsg: 'Retrieving webpage meta data'}
      this.props.urlMetaData(e.target.value, (data) => this.handleUrlMetaData(data, index))
    } else {
      stories[index] = {url: e.target.value, valid: false, loading: false, linkMsg: 'Please enter a valid website link'}
    }
    this.validateStories(stories)
    this.setState({
      stories: stories
    })
  }
  render () {
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
        { this.state.loading &&
        <div style={{ width: '100vw', height: '100vh', background: 'rgba(33, 37, 41, 0.6)', position: 'fixed', zIndex: '99999', top: '0px' }}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
              className='align-center'>
              <center><RingLoader color='#716aca' /></center>
            </div>
          </div>

        }
        <a href='#/' style={{ display: 'none' }} ref='messengerModal' data-toggle="modal" data-target="#messengerModal">messengerModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="messengerModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Connect to Messenger:
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <MessengerPlugin
                  appId={this.props.fbAppId}
                  pageId={this.state.fbPageId}
                  size='large'
                  passthroughParams={`${this.props.user._id}__kibopush_test_broadcast_`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Update Stories for {this.props.currentFeed.title}
                  </h3>
                </div>
              </div>
            </div>
            <form className='m-form m-form--label-align-right'>
              <div className='m-portlet__body'>
                <div className='m-form__section m-form__section--first'>
                  { this.state.stories.length > 0 && this.state.stories.map((story, index) => (
                    <div key={index} className='form-group m-form__group row'>
                      <label className='col-lg-2 col-form-label'>
                        {`Story ${index + 1} URL`}
                      </label>
                      <div className='col-lg-6'>
                        <input className='form-control m-input' style={{borderColor: story.valid && !story.loadingUrl ? 'green' : 'red'}} placeholder='Enter a story url' defaultValue='' onChange={(e) => {this.changeUrl(index, e)}} value={story.url} />
                        <span className='m-form__help'>
                        <span style={{ color: story.valid && !story.loadingUrl ? 'green' : 'red', fontSize: 'small'}}>{`*${story.linkMsg}`}</span>
                      </span>
                      </div>
                      { this.state.stories.length > 1 &&
                      <div className='col-lg-1'>
                        <div onClick={() => {this.removeStory(index)}} style={{textAlign: 'center', background: 'lightgray', width: '30px', height: '28px', borderRadius: '25px', cursor: 'pointer'}}>
                          <i className='fa fa-close' />
                        </div>
                      </div>
                      }
                    </div>
                  ))
                  }
                  { this.state.stories.length <= 9 &&
                   <div className='form-group m-form__group row'>
                      <div className='col-lg-8' style={{textAlign: 'right'}}>
                        <button type='button' className='btn m-btn--pill btn-focus' onClick={this.addMoreStories}>Add More</button>
                      </div>
                      <div className='col-lg-8' style={{textAlign: 'right'}}>
                        <span style={{fontWeight: 'lighter', fontSize: '0.8rem'}} >Upto 10 allowed</span>
                      </div>
                   </div>
                  }
                </div>
              </div>
            </form>
            <div className='m-portlet__foot m-portlet__foot--fit'>
              <div className='col-11' style={{textAlign: 'right', paddingTop: '30px', paddingBottom: '30px'}}>
                <Link to='/newsIntegration'>
                  <button className='btn btn-secondary'>
                    Back
                  </button>
                </Link>
                <span>&nbsp;&nbsp;</span>
                <button className='btn btn-primary' type='button' disabled={!this.state.saveEnabled} onClick={this.preview} >
                  Preview in Messenger
                </button>
                <span>&nbsp;&nbsp;</span>
                <button className='btn btn-primary' type='button' disabled={!this.state.saveEnabled} onClick={this.handleSave} >
                  Save
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
  console.log('state from news section', state)
  return {
    pages: (state.pagesInfo.pages),
    rssFeeds: (state.feedsInfo.rssFeeds),
    count: (state.feedsInfo.count),
    currentFeed: (state.feedsInfo.currentFeed),
    newsPages: (state.feedsInfo.newsPages),
    adminPageSubscription: (state.basicInfo.adminPageSubscription),
    user: (state.basicInfo.user),
    fbAppId: (state.basicInfo.fbAppId)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      updateNewsFeed: updateNewsFeed,
      previewNewsFeed: previewNewsFeed,
      getFbAppId: getFbAppId,
      getAdminSubscriptions: getAdminSubscriptions,
      urlMetaData: urlMetaData
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateStories)
