import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createautoposting } from '../../redux/actions/autoposting.actions'
import { isWebURL, isWebViewUrl, isFacebookPageUrl, isTwitterUrl, testUserName, isRssUrl } from './../../utility/utils'

class AddChannel extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      facebookColor: '#716aca',
      twitterColor: '',
      rssColor: '',
      wordPressColor: '',
      facebookForeGroundColor: 'white',
      twitterForeGroundColor: 'black',
      rssForeGroundColor: 'black',
      wordPressForeGroundColor: 'black',
      showWordPressGuide: false,
      errorMessage: '',
      type: '',
      selectedPages: [],
      defaultPages: []
    }
    this.onSelectItem = this.onSelectItem.bind(this)
    this.createAutoposting = this.createAutoposting.bind(this)
    this.handleCreateAutopostingResponse = this.handleCreateAutopostingResponse.bind(this)
    this.initializePageSelect = this.initializePageSelect.bind(this)
  }
  componentDidMount () {
    let options = []
    let selectedPageIds = []
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].gotPageSubscriptionPermission) {
        options.push({text: this.props.pages[i].pageName, id: this.props.pages[i].pageId})
        selectedPageIds.push(this.props.pages[i].pageId)
      }
    }
    this.setState({page: {options: options}})
    this.setState({selectedPages: selectedPageIds, defaultPages: selectedPageIds})
    this.initializePageSelect(options)
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
  createAutoposting (type) {
    var autopostingData = {}
    var isWebUrl
    var isWebViewURL  = false
    var incorrectUrl = false
    this.setState({
      type: type
    })
    if (type === 'facebook') {
      isWebUrl = isWebURL(this.facebookSubscriptionUrl.value)
      isWebViewURL = isWebViewUrl(this.facebookSubscriptionUrl.value)
      var isFacebookPage = isFacebookPageUrl(this.facebookSubscriptionUrl.value)
      if (!isWebUrl || !isFacebookPage || !isWebViewURL) {
        incorrectUrl = true
      }
      if (!incorrectUrl) {
        if (this.facebookSubscriptionUrl.value.substring(this.facebookSubscriptionUrl.value.length - 1) === '/') {
          this.facebookSubscriptionUrl.value = this.facebookSubscriptionUrl.value.substring(0, (this.facebookSubscriptionUrl.value.length - 1))
        }
        var usernameFacebook = this.facebookSubscriptionUrl.value.substr(this.facebookSubscriptionUrl.value.lastIndexOf('/') + 1)
        if (!testUserName(usernameFacebook)) {
          incorrectUrl = true
        }
      }
    } else if (type === 'twitter') {
      isWebUrl = isWebURL(this.twitterSubscriptionUrl.value)
      isWebViewURL = isWebViewUrl(this.twitterSubscriptionUrl.value)
      var isTwitterPage = isTwitterUrl(this.twitterSubscriptionUrl.value)
      if (!isWebUrl || !isTwitterPage || !isWebViewURL) {
        incorrectUrl = true
      }
      if (!incorrectUrl) {
        if (this.twitterSubscriptionUrl.value.substring(this.twitterSubscriptionUrl.value.length - 1) === '/') {
          this.twitterSubscriptionUrl.value = this.twitterSubscriptionUrl.value.substring(0, (this.twitterSubscriptionUrl.value.length - 1))
        }
        var userNameTwitter = this.twitterSubscriptionUrl.value.substr(this.twitterSubscriptionUrl.value.lastIndexOf('/') + 1)
        if (!testUserName(userNameTwitter)) {
          incorrectUrl = true
        }
      }
    } else if (type === 'rss') {
      isWebUrl = isWebURL(this.rssSubscriptionUrl.value)
      isWebViewURL = isWebViewUrl(this.rssSubscriptionUrl.value)
      var RssURL = isRssUrl(this.rssSubscriptionUrl.value)
      if (!isWebUrl || !isWebViewURL || !RssURL) {
        incorrectUrl = true
      }
    } else if (type === 'wordpress') {
      isWebUrl = isWebURL(this.wordpressSubscriptionUrl.value)
      isWebViewURL = isWebViewUrl(this.wordpressSubscriptionUrl.value)
      if (!isWebUrl || !isWebViewURL) {
        incorrectUrl = true
      }
      if (!incorrectUrl) {
        if (this.wordpressSubscriptionUrl.value.includes('facebook.com') || this.wordpressSubscriptionUrl.value.includes('twitter.com')) {
          incorrectUrl = true
        }
      }
    }
    switch (type) {
      case 'facebook':
        autopostingData = {
          subscriptionUrl: this.facebookSubscriptionUrl.value,
          subscriptionType: type,
          accountTitle: 'Facebook Page',
          isSegmented: true,
          segmentationPageIds: this.state.selectedPages.length > 0 ?  this.state.selectedPages: this.state.defaultPages,
          segmentationGender: '',
          segmentationLocale: ''
        }
        break
      case 'twitter':
        autopostingData = {
          subscriptionUrl: this.twitterSubscriptionUrl.value,
          subscriptionType: type,
          accountTitle: 'Twitter Account',
          isSegmented: true,
          segmentationPageIds: this.state.selectedPages.length > 0 ?  this.state.selectedPages: this.state.defaultPages,
          segmentationGender: '',
          segmentationLocale: ''
        }
        break
      case 'rss':
        autopostingData = {
          subscriptionUrl: this.rssSubscriptionUrl.value,
          subscriptionType: type,
          accountTitle: 'RSS Feed',
          isSegmented: true,
          segmentationPageIds: this.state.selectedPages.length > 0 ?  this.state.selectedPages: this.state.defaultPages,
          segmentationGender: '',
          segmentationLocale: ''
        }
        break
      case 'wordpress':
        autopostingData = {
          subscriptionUrl: this.wordpressSubscriptionUrl.value,
          subscriptionType: type,
          accountTitle: 'WordPress Channel',
          isSegmented: true,
          segmentationPageIds: this.state.selectedPages.length > 0 ?  this.state.selectedPages: this.state.defaultPages,
          segmentationGender: '',
          segmentationLocale: ''
        }
        break
      default:
        break
    }
    if (!incorrectUrl) {
      this.setState({
        errorMessage: ''
      })
      this.props.addFeedClose.click()
      this.props.createautoposting(autopostingData, this.handleCreateAutopostingResponse)
    } else {
      var errorMsg = ''
      if(isWebViewURL){
         errorMsg =  'Incorrect Url'
      }else{
         errorMsg =  'Incorrect Url. Please make sure it includes http(s)'
      }
      this.setState({
        errorMessage: errorMsg
      })
    }
  }

  handleCreateAutopostingResponse (response) {
    if (response.status === 'success') {
      this.props.msg.success('Changes saved successfully!')
    } else {
      if (typeof response.description === 'string' || response.description instanceof String) {
        this.props.msg.error(response.description)

      }
      else {
        this.props.msg.error('Failed to create autoposting')
      }
    }
  }

  onSelectItem (value) {
    this.setState({
      errorMessage: ''
    })
    switch (value) {
      case 'facebook':
        this.setState({
          facebookColor: '#716aca',
          twitterColor: '',
          rssColor: '',
          wordPressColor: '',
          facebookForeGroundColor: 'white',
          twitterForeGroundColor: 'black',
          rssForeGroundColor: 'black',
          wordPressForeGroundColor: 'black'
        })
        break
      case 'twitter':
        this.setState({
          facebookColor: '',
          twitterColor: '#716aca',
          rssColor: '',
          wordPressColor: '',
          facebookForeGroundColor: 'black',
          twitterForeGroundColor: 'white',
          rssForeGroundColor: 'black',
          wordPressForeGroundColor: 'black'
        })
        break
      case 'rss':
        this.setState({
          facebookColor: '',
          twitterColor: '',
          rssColor: '#716aca',
          wordPressColor: '',
          facebookForeGroundColor: 'black',
          twitterForeGroundColor: 'black',
          rssForeGroundColor: 'white',
          wordPressForeGroundColor: 'black'
        })
        break
      case 'wordpress':
        this.setState({
          facebookColor: '',
          twitterColor: '',
          rssColor: '',
          wordPressColor: '#716aca',
          facebookForeGroundColor: 'black',
          twitterForeGroundColor: 'black',
          rssForeGroundColor: 'black',
          wordPressForeGroundColor: 'white'
        })
        break
      default:
        break
    }
  }

  render () {
    let facebookColor = this.state.facebookColor
    let twitterColor = this.state.twitterColor
    let wordPressColor = this.state.wordPressColor
    let rssColor = this.state.rssColor
    let facebookForeGroundColor = this.state.facebookForeGroundColor
    let twitterForeGroundColor = this.state.twitterForeGroundColor
    let wordPressForeGroundColor = this.state.wordPressForeGroundColor
    let rssForeGroundColor = this.state.rssForeGroundColor
    return (
      <div>
        <h3>Connect Feed</h3>
        <div style={{width: '100%', textAlign: 'center'}}>
          <div style={{display: 'inline-block', padding: '5px'}}>
            <button onClick={() => this.onSelectItem('facebook')} style={{backgroundColor: facebookColor, color: facebookForeGroundColor}} className='btn'>
              <i className='fa fa-facebook fa-2x' aria-hidden='true' />
              <br />Facebook
            </button>
          </div>
          <div style={{display: 'inline-block', padding: '5px'}}>
            <button onClick={() => this.onSelectItem('twitter')} style={{backgroundColor: twitterColor, color: twitterForeGroundColor}} className='btn'>
              <i className='fa fa-twitter fa-2x' aria-hidden='true' />
              <br />Twitter
            </button>
          </div>
          <div style={{display: 'inline-block', padding: '5px'}}>
            <button onClick={() => this.onSelectItem('rss')} style={{backgroundColor: rssColor, color: rssForeGroundColor}} className='btn'>
              <i className='fa fa-feed fa-2x' aria-hidden='true' />
              <br />RSS Feed
            </button>
          </div>
          <div style={{display: 'inline-block', padding: '5px'}}>
            <button onClick={() => this.onSelectItem('wordpress')} style={{backgroundColor: wordPressColor, color: wordPressForeGroundColor}} className='btn'>
              <i className='fa fa-wordpress fa-2x' aria-hidden='true' />
              <br />WordPress
            </button>
          </div>
          <div style={{textAlign: 'left', marginTop: '15px', marginBottom: '10px'}}>
            <label>Select Page</label>
            <div>
              <select id='selectPage' />
            </div>
          </div>
        </div>
        { facebookColor !== '' &&
          <div>
            <div>
              <label> Facebook Page Url </label>
              <input placeholder='Enter FB url' ref={(c) => { this.facebookSubscriptionUrl = c }} type='text' className='form-control' />
              { this.state.type === 'facebook' &&
                <span style={{color: 'red'}}>{this.state.errorMessage}</span>
              }
            </div>
            <button style={{float: 'right', margin: '10px'}}
              onClick={() => this.createAutoposting('facebook')}
              className='btn btn-primary btn-sm'>Add Facebook Feed
            </button>
          </div>
        }
        { twitterColor !== '' &&
          <div>
            <div>
              <label> Twitter Account Url </label>
              <input placeholder='Enter Twitter handle' ref={(c) => { this.twitterSubscriptionUrl = c }} type='text' className='form-control' />
              { this.state.type === 'twitter' &&
                <span style={{color: 'red'}}>{this.state.errorMessage}</span>
              }
            </div>
            <button style={{float: 'right', margin: '10px'}}
              onClick={() => this.createAutoposting('twitter')}
              className='btn btn-primary btn-sm'>Add Twitter Feed
            </button>
          </div>
        }
        { rssColor !== '' &&
          <div>
            <div>
              <label> RSS Feed Url </label>
              <input placeholder='Enter RSS Feed url' ref={(c) => { this.rssSubscriptionUrl = c }} type='text' className='form-control' />
              { this.state.type === 'rss' &&
                <span style={{color: 'red'}}>{this.state.errorMessage}</span>
              }
            </div>
            <button style={{float: 'right', margin: '10px'}}
              onClick={() => this.createAutoposting('rss')}
              className='btn btn-primary btn-sm'>Add RSS Feed
            </button>
          </div>
        }
        { wordPressColor !== '' &&
          <div>
            <div>
              <label> WordPress Channel Url </label>
              <input placeholder='Enter WordPress Channel url' ref={(c) => { this.wordpressSubscriptionUrl = c }} type='text' className='form-control' />
              { this.state.type === 'wordpress' &&
                <span style={{color: 'red'}}>{this.state.errorMessage}</span>
              }
            </div>
            <button style={{float: 'right', marginTop: '10px'}}
              onClick={this.props.openGuidelines}
              className='btn btn-primary btn-sm'>View Integration Guidelines
            </button>
            <button style={{float: 'right', marginTop: '10px', marginRight: '10px'}}
              onClick={() => this.createAutoposting('wordpress')}
              className='btn btn-primary btn-sm'>Add WordPress Channel
            </button>
          </div>
        }
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
    createautoposting: createautoposting
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddChannel)
