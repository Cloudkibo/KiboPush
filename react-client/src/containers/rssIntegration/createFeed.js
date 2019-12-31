import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import { isWebURL, isRssUrl } from './../../utility/utils'
import { createRssFeed } from '../../redux/actions/rssIntegration.actions'

class CreateFeed extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      feedUrl: '',
      isActive: true,
      feedTitle: '',
      storiesCount: '5',
      isDefault: props.rssFeeds && props.rssFeeds.length > 1 ? false:true,
      selectedPages: [],
      saveEnabled: false,
      inValidUrlMsg: ''
    }
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.feedUrlChange = this.feedUrlChange.bind(this)
    this.feedTitleChange = this.feedTitleChange.bind(this)
    this.handleStoryChange = this.handleStoryChange.bind(this)
    this.defaultFeedChange = this.defaultFeedChange.bind(this)
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.isValidIntegration = this.isValidIntegration.bind(this)
    this.isValidRssUrl = this.isValidRssUrl.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.resetFields = this.resetFields.bind(this)
  }
  resetFields () {
    this.setState({
      feedUrl: '',
      isActive: true,
      feedTitle: '',
      storiesCount: '5',
      isDefault: false,
      saveEnabled: false,
      inValidUrlMsg: ''
    })
    /* eslint-disable */
    $('#selectPage').val('').trigger('change')
    /* eslint-enable */
    var newsPages = []
    var selectedPages = []
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].gotPageSubscriptionPermission) {
        newsPages.push({text: this.props.pages[i].pageName, id: this.props.pages[i]._id})
        selectedPages.push(this.props.pages[i]._id)
      }
    }
    this.setState({
      selectedPages: selectedPages
    })
    this.initializePageSelect(newsPages)
  }
  handleSave () {
    var rssPayload = {
      feedUrl: this.state.feedUrl,
	    title: this.state.feedTitle,
	    storiesCount: parseInt(this.state.storiesCount),
	    defaultFeed: this.state.isDefault,
	    isActive: this.state.isActive,
	    pageIds: this.state.selectedPages
    }
    this.props.createRssFeed(rssPayload, this.msg, this.resetFields)
  }

  isValidRssUrl(feedUrl) {
    if (feedUrl !== '' && (!isWebURL(feedUrl) || !isRssUrl(feedUrl))) {
      this.setState({inValidUrlMsg: 'Please enter a valid Rss feed url'})
    } else {
      this.setState({inValidUrlMsg: ''})
    }
  }
  isValidIntegration (feedUrl, title) {
    var isValid = false
    if (feedUrl !== '' && title !== '' && isWebURL(feedUrl) && isRssUrl(feedUrl)) {
      isValid = true
    } else {
      isValid = false
    }
    this.setState({
      saveEnabled: isValid
    })
  }
  defaultFeedChange (e) {
    this.isValidIntegration(this.state.feedUrl, this.state.feedTitle)
    this.setState({
      isDefault: e.target.checked
    })
  }
  handleStatusChange (e) {
    this.isValidIntegration(this.state.feedUrl, this.state.feedTitle)
    this.setState({
      isActive: e.target.value === 'true' ? true : false
    })
  }
  handleStoryChange (e) {
    this.isValidIntegration(this.state.feedUrl, this.state.feedTitle)
    this.setState({
      storiesCount: e.target.value
    })
  }
  feedTitleChange (e) {
    this.isValidIntegration(this.state.feedUrl, e.target.value)
    this.setState({
      feedTitle: e.target.value
    })
  }
  feedUrlChange (e) {
    this.isValidIntegration(e.target.value, this.state.feedTitle)
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
      var newsPages = []
      var selectedPages = []
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].gotPageSubscriptionPermission) {
          newsPages.push({text: this.props.pages[i].pageName, id: this.props.pages[i]._id})
          selectedPages.push(this.props.pages[i]._id)
        }
      }
      this.setState({
        selectedPages: selectedPages
      })
      this.initializePageSelect(newsPages)
    }
  }
  setCurrentFeed (feed) {
    this.setState({
      feedUrl: feed.feedUrl,
      isActive: feed.isActive,
      feedTitle: feed.title,
      storiesCount: feed.storiesCount.toString(),
      isDefault: feed.defaultFeed,
      selectedPages: feed.pageIds,
      saveEnabled: true,
      inValidUrlMsg: ''
    })
    var selectedPages = []
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].gotPageSubscriptionPermission) {
        var isSelected = false
        for (let j = 0; j < feed.pageIds.length; j++) {
          if (this.props.pages[i]._id === feed.pageIds[j]) {
            selectedPages.push({text: this.props.pages[i].pageName, id: this.props.pages[i]._id, selected: true})
            isSelected = true
            break
          }
        }
        if (!isSelected) {
          selectedPages.push({text: this.props.pages[i].pageName, id: this.props.pages[i]._id})
        }
      }
    }
    this.setState({
      selectedPages: selectedPages
    })
    this.initializePageSelect(selectedPages)
  }
  initializePageSelect (pageOptions) {
    var self = this
    /* eslint-disable */
    $('#selectPage').select2({
    /* eslint-enable */
      data: pageOptions,
      placeholder: 'Select Pages (Default: All)',
      allowClear: true,
      multiple: true,
      tags: true
    })
    /* eslint-disable */
    $('#selectPage').on('change', function (e) {
    /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ selectedPages: selected })
      }
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
                      <select id='selectPage' />
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
                      <input name='defaultFeed' value={this.state.isDefault} type='checkbox' checked={this.state.isDefault} onChange={this.defaultFeedChange} disabled={this.props.rssFeeds && this.props.rssFeeds.length < 1}/>
                      <span>&nbsp;&nbsp;Set Default Feed</span>
                    </label>                  
                    <p style={{fontSize:'0.85rem', marginLeft: '10px'}}>Subscribers will recieve daily news updates from the default feed. There can be only one default feed. Click on the checkbox if you want to make this feed your default feed.</p>
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
      createRssFeed: createRssFeed
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateFeed)
