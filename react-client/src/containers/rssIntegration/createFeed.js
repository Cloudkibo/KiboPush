import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import { isWebURL, isRssUrl } from './../../utility/utils'
import { createRssFeed, updateFeed } from '../../redux/actions/rssIntegration.actions'

class CreateFeed extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      feedUrl: '',
      isActive: true,
      feedTitle: '',
      storiesCount: '5',
      isDefault: true,
      selectedPage: '',
      saveEnabled: false,
      inValidUrlMsg: '',
      pageName: ''
    }
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
  }

  pageChange (event) {
    if (event.target.value !== -1) {
        this.setState({
          selectedPage: event.target.value,
          pageName: event.target.selectedOptions[0].label
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
      selectedPage: ''
    })

    var pageSelected = ''
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].gotPageSubscriptionPermission) {
        pageSelected = this.props.pages[i]
        break
      }
    }
    this.setState({
      selectedPage: pageSelected._id,
      pageName: pageSelected.pageName
    })
  }
  handleSave () {
    var rssPayload = {
      feedUrl: this.state.feedUrl,
	    title: this.state.feedTitle,
	    storiesCount: parseInt(this.state.storiesCount),
	    defaultFeed: this.state.isDefault,
	    isActive: this.state.isActive,
	    pageId: this.state.selectedPage
    }
    if (!this.props.currentFeed) {
      this.props.createRssFeed(rssPayload, this.msg, this.resetFields)
    } else {
      var data = {
        feedId: this.props.currentFeed._id,
        updatedObject: rssPayload
      }
      this.props.updateFeed(data, this.msg, false)
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
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].gotPageSubscriptionPermission) {
          pageSelected = this.props.pages[i]
          break
        }
      }
      this.setState({
        selectedPage: pageSelected._id,
        pageName: pageSelected.pageName
      })
    }
  }

  setCurrentFeed (feed) {
    this.setState({
      feedUrl: feed.feedUrl,
      isActive: feed.isActive,
      feedTitle: feed.title,
      storiesCount: feed.storiesCount.toString(),
      isDefault: feed.defaultFeed,
      selectedPage: feed.pageId,
      saveEnabled: true,
      inValidUrlMsg: ''
    })
    var selectedPage = ''
    for (let i = 0; i < this.props.pages.length; i++) {
      if (feed.pageId === this.props.pages[i]._id) {
        selectedPage = this.props.pages[i]
        break
      }
    }
    this.setState({
      selectedPage: selectedPage._id,
      pageName: selectedPage.pageName
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
                        this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                          page.connected && page.gotPageSubscriptionPermission &&
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
  <p style={{fontSize:'0.85rem', marginLeft: '10px'}}>Subscribers will recieve daily news updates from the default feed. There can be only one default feed for a single news page. Uncheck if you donot want to make this as your default feed for Page: <b>{this.state.pageName}</b></p>
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
    pages: (state.pagesInfo.pages),
    rssFeeds: (state.feedsInfo.rssFeeds),
    count: (state.feedsInfo.count),
    currentFeed: (state.feedsInfo.currentFeed)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      createRssFeed: createRssFeed,
      updateFeed: updateFeed
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateFeed)
