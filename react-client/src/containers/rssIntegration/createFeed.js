import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import { isWebURL, isRssUrl } from './../../utility/utils'
import { createRssFeed, updateFeed, previewRssFeed } from '../../redux/actions/rssIntegration.actions'
import { getuserdetails, getFbAppId, getAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
import { registerAction } from '../../utility/socketio'
import { RingLoader } from 'halogenium'
var MessengerPlugin = require('react-messenger-plugin').default

class CreateFeed extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      feedUrl: '',
      isActive: true,
      feedTitle: '',
      storiesCount: '5',
      isDefault: false,
      selectedPage: '',
      saveEnabled: false,
      inValidUrlMsg: '',
      defaultMessage: '',
      fbPageId: '',
      loading: false
    }
    props.getFbAppId()
    props.getuserdetails()
    props.getAdminSubscriptions()
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.feedUrlChange = this.feedUrlChange.bind(this)
    this.feedTitleChange = this.feedTitleChange.bind(this)
    this.handleStoryChange = this.handleStoryChange.bind(this)
    this.defaultFeedChange = this.defaultFeedChange.bind(this)
    this.isValidIntegration = this.isValidIntegration.bind(this)
    this.isValidRssUrl = this.isValidRssUrl.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.resetFields = this.resetFields.bind(this)
    this.pageChange = this.pageChange.bind(this)
    this.pageHasDefaultFeed = this.pageHasDefaultFeed.bind(this)
    this.previewRssFeed = this.previewRssFeed.bind(this)
  }

  previewRssFeed () {
    let pageSelected = this.state.selectedPage
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
    var rssPayload = {
      feedUrl: this.state.feedUrl,
	    title: this.state.feedTitle,
	    storiesCount: parseInt(this.state.storiesCount),
	    pageIds: [this.state.selectedPage],
      integrationType: 'rss'
    }
    if (this.props.currentFeed && this.props.currentFeed._id) {
      rssPayload.feedId = this.props.currentFeed._id
    }
    this.setState({
      loading: true
    })
    this.props.previewRssFeed(rssPayload, this.msg, () => {this.setState({loading: false})})
  }

  pageHasDefaultFeed (pageId) {
    var defaultFeed = true
    for (var i = 0; i < this.props.rssFeeds.length; i++) {
      if (this.props.rssFeeds[i].pageIds[0] === pageId && this.props.rssFeeds[i].defaultFeed) {
        defaultFeed = false
        break
      }
    }
    return defaultFeed
  }
  pageChange (event) {
    if (event.target.value !== -1) {
        if(!this.props.currentFeed) {
          var defaultFeed = this.pageHasDefaultFeed(event.target.value)
          this.setState({
            isDefault: defaultFeed,
            defaultMessage: defaultFeed ? `Currently you have no default feeds for the selected page: ${event.target.selectedOptions[0].label}`: `You already have a default feed for the selected page: ${event.target.selectedOptions[0].label}. Click on the checkbox if you want to make this feed as default`,
          })
        }
        this.setState({
          selectedPage: event.target.value,
          fbPageId: this.props.newsPages.filter((page) => page._id === event.target.value)[0].pageId
        })
      } else {
        this.setState({
          selectedPage: ''
        })
      }
  }

  resetFields () {
    this.setState({
      feedUrl: '',
      isActive: true,
      feedTitle: '',
      storiesCount: '5',
      isDefault: false,
      saveEnabled: false,
      inValidUrlMsg: '',
      selectedPage: '',
      defaultMessage: '',
      loading: false
    })

    var pageSelected = ''
    for (let i = 0; i < this.props.newsPages.length; i++) {
        pageSelected = this.props.newsPages[i]
        break
    }
    this.setState({
      selectedPage: pageSelected._id,
    })
  }
  handleSave () {
    this.setState({
      loading: true
    })
    var rssPayload = {
      feedUrl: this.state.feedUrl,
	    title: this.state.feedTitle,
	    storiesCount: parseInt(this.state.storiesCount),
	    defaultFeed: this.state.isDefault,
	    isActive: this.state.isActive,
	    pageIds: [this.state.selectedPage],
      integrationType: 'rss'
    }
    if (!this.props.currentFeed) {
      this.props.createRssFeed(rssPayload, this.msg, this.resetFields, () => {this.setState({ loading: false})})
    } else {
      var data = {
        feedId: this.props.currentFeed._id,
        updatedObject: rssPayload
      }
      this.props.updateFeed(data, this.msg, false, () => {this.setState({ loading: false})})
    }
  }

  isValidRssUrl(feedUrl) {
    if (feedUrl !== '' && (!isWebURL(feedUrl) || !isRssUrl(feedUrl))) {
      this.setState({inValidUrlMsg: 'Please enter a valid Rss feed url'})
    } else {
      this.setState({inValidUrlMsg: ''})
    }
  }
  isValidIntegration (feedUrl, title, selectedPage) {
    var isValid = false
    if (feedUrl !== '' && title !== '' && isWebURL(feedUrl) && isRssUrl(feedUrl) && selectedPage !== '') {
      isValid = true
    } else {
      isValid = false
    }
    this.setState({
      saveEnabled: isValid
    })
  }
  defaultFeedChange (e) {
    this.isValidIntegration(this.state.feedUrl, this.state.feedTitle, this.state.selectedPage)
    this.setState({
      isDefault: e.target.checked
    })
  }
  handleStatusChange (e) {
    this.isValidIntegration(this.state.feedUrl, this.state.feedTitle, this.state.selectedPage)
    this.setState({
      isActive: e.target.value === 'true' ? true : false
    })
  }
  handleStoryChange (e) {
    this.isValidIntegration(this.state.feedUrl, this.state.feedTitle, this.state.selectedPage)
    this.setState({
      storiesCount: e.target.value
    })
  }
  feedTitleChange (e) {
    this.isValidIntegration(this.state.feedUrl, e.target.value, this.state.selectedPage)
    this.setState({
      feedTitle: e.target.value
    })
  }
  feedUrlChange (e) {
    this.isValidIntegration(e.target.value, this.state.feedTitle, this.state.selectedPage)
    this.setState({
      feedUrl: e.target.value,
      inValidUrlMsg: ''
    })
  }

  componentDidMount () {
    let title = ''
    document.title = `${title} | Rss Feeds`
    if (this.props.currentFeed) {
      this.setCurrentFeed(this.props.currentFeed)
    } else {
      var pageSelected = ''
      for (let i = 0; i < this.props.newsPages.length; i++) {
        pageSelected = this.props.newsPages[i]
        break
      }
      var defaultFeed = this.pageHasDefaultFeed(pageSelected._id)
      this.setState({
        isDefault: defaultFeed,
        fbPageId: pageSelected.pageId,
        defaultMessage: defaultFeed ? `Currently you have no default feeds for the selected page: ${pageSelected.pageName}`: `You already have a default feed for the selected page: ${pageSelected.pageName}. Click on the checkbox if you want to make this feed as default`,
        selectedPage: pageSelected._id
      })
    }
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
  }

  setCurrentFeed (feed) {
    this.setState({
      feedUrl: feed.feedUrl,
      isActive: feed.isActive,
      feedTitle: feed.title,
      storiesCount: feed.storiesCount.toString(),
      isDefault: feed.defaultFeed,
      selectedPage: feed.pageIds[0],
      saveEnabled: true,
      inValidUrlMsg: ''
    })
    var selectedPage = ''
    for (let i = 0; i < this.props.newsPages.length; i++) {
      if (feed.pageIds[0] === this.props.newsPages[i]._id) {
        selectedPage = this.props.newsPages[i]
        break
      }
    }
    this.setState({
      fbPageId: selectedPage.pageId,
      selectedPage: selectedPage._id
    })
  }

  UNSAFE_componentWillReceiveProps () {
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
                    Rss Feed
                  </h3>
                </div>
              </div>
            </div>
            <form className='m-form m-form--label-align-right'>
              <div className='m-portlet__body'>
                <div className='m-form__section m-form__section--first'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Info
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Rss Feed Url
                    </label>
                    <div className='col-lg-6'>
                      <input className='form-control m-input' placeholder='Input Url'
                        onChange={this.feedUrlChange}
                        onBlur={(e) => this.isValidRssUrl(e.target.value)}
                        defaultValue=''
                        value={this.state.feedUrl} />
                    </div>
                    { this.state.inValidUrlMsg !== '' &&
                      <span className='m-form__help'>
                        <span style={{color: 'red'}}>{this.state.inValidUrlMsg}</span>
                      </span>
                    }
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Rss Feed Title
                    </label>
                    <div className='col-lg-6'>
                      <input className='form-control m-input' placeholder='title'
                        onChange={this.feedTitleChange}
                        defaultValue=''
                        value={this.state.feedTitle} />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Status
                    </label>
                    <div className='col-lg-6' id='rules'>
                      <select className='form-control m-input' onChange={this.handleStatusChange} value={this.state.isActive}>
                        <option value='true'>Enable</option>
                        <option value='false'>Disable</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='m-form__section m-form__section--last'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Settings
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Select Pages
                    </label>
                    <div className='col-lg-6'>
                      <select className='form-control m-input' value={this.state.selectedPage} onChange={this.pageChange}>
                      {
                        this.props.newsPages && this.props.newsPages.length > 0 && this.props.newsPages.map((page, i) => (
                          <option key={page._id} value={page._id} selected={page._id === this.state.selectedPage}>{page.pageName}</option>
                        ))
                      }
                    </select>
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Show no more than
                    </label>
                    <div className='col-lg-6'>
                      <select className='form-control m-input' onChange={this.handleStoryChange} value={this.state.storiesCount}>
                        <option value='1'>1 story</option>
                        <option value='2'>2 stories</option>
                        <option value='3'>3 stories</option>
                        <option value='4'>4 stories</option>
                        <option value='5'>5 stories</option>
                        <option value='6'>6 stories</option>
                        <option value='7'>7 stories</option>
                        <option value='8'>8 stories</option>
                        <option value='9'>9 stories</option>
                        <option value='10'>10 stories</option>
                      </select>
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2'>
                      <input name='defaultFeed' value={this.state.isDefault} type='checkbox' checked={this.state.isDefault} onChange={this.defaultFeedChange} />
                      <span>&nbsp;&nbsp;Set Default Feed</span>
                    </label>
                    <p className='col-12' style={{fontSize:'0.85rem', marginLeft: '10px'}}>Subscribers will receive daily news updates from the default feed. There can be only one default feed for a single news page. {this.state.defaultMessage}</p>
                  </div>
                </div>
              </div>
            </form>
            <div className='m-portlet__foot m-portlet__foot--fit'>
              <div className='col-12' style={{textAlign: 'right', paddingTop: '30px', paddingBottom: '30px'}}>
                <Link to='/rssIntegration'>
                  <button className='btn btn-secondary'>
                    Back
                  </button>
                </Link>
                <span>&nbsp;&nbsp;</span>
                <button className='btn btn-primary' type='button' disabled={!this.state.saveEnabled} onClick={this.previewRssFeed} >
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
  console.log('state from rss feed', state)
  return {
    adminPageSubscription: (state.basicInfo.adminPageSubscription),
    pages: (state.pagesInfo.pages),
    rssFeeds: (state.feedsInfo.rssFeeds),
    count: (state.feedsInfo.count),
    currentFeed: (state.feedsInfo.currentFeed),
    user: (state.basicInfo.user),
    fbAppId: (state.basicInfo.fbAppId),
    newsPages: (state.feedsInfo.newsPages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      createRssFeed: createRssFeed,
      previewRssFeed: previewRssFeed,
      updateFeed: updateFeed,
      getuserdetails: getuserdetails,
      getFbAppId: getFbAppId,
      getAdminSubscriptions: getAdminSubscriptions
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateFeed)
