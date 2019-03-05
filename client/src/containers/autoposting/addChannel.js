import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createautoposting, clearAlertMessages } from '../../redux/actions/autoposting.actions'
import { isWebURL, isFacebookPageUrl, isTwitterUrl, testUserName } from './../../utility/utils'

class AddChannel extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      facebookColor: '#ff5e3a',
      twitterColor: '',
      youtubeColor: '',
      wordPressColor: '',
      facebookForeGroundColor: 'white',
      twitterForeGroundColor: 'black',
      youtubeForeGroundColor: 'black',
      wordPressForeGroundColor: 'black',
      showWordPressGuide: false,
      errorMessage: '',
      type: ''
    }
    this.onSelectItem = this.onSelectItem.bind(this)
    this.createAutoposting = this.createAutoposting.bind(this)
  }
  createAutoposting (type) {
    var autopostingData = {}
    var isWebUrl
    var incorrectUrl = false
    this.setState({
      type: type
    })
    if (type === 'facebook') {
      isWebUrl = isWebURL(this.facebookSubscriptionUrl.value)
      var isFacebookPage = isFacebookPageUrl(this.facebookSubscriptionUrl.value)
      if (!isWebUrl || !isFacebookPage) {
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
      var isTwitterPage = isTwitterUrl(this.twitterSubscriptionUrl.value)
      if (!isWebUrl || !isTwitterPage) {
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
    } else if (type === 'wordpress') {
      if (!isWebURL(this.wordpressSubscriptionUrl.value)) {
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
          isSegmented: false,
          segmentationPageIds: [],
          segmentationGender: '',
          segmentationLocale: ''
        }
        break
      case 'twitter':
        autopostingData = {
          subscriptionUrl: this.twitterSubscriptionUrl.value,
          subscriptionType: type,
          accountTitle: 'Twitter Account',
          isSegmented: false,
          segmentationPageIds: [],
          segmentationGender: '',
          segmentationLocale: ''
        }
        break
      case 'youtube':
        autopostingData = {
          subscriptionUrl: this.youtubeSubscriptionUrl.value,
          subscriptionType: type,
          accountTitle: 'YouTube Channel',
          isSegmented: false,
          segmentationPageIds: [],
          segmentationGender: '',
          segmentationLocale: ''
        }
        break
      case 'wordpress':
        autopostingData = {
          subscriptionUrl: this.wordpressSubscriptionUrl.value,
          subscriptionType: type,
          accountTitle: 'WordPress Channel',
          isSegmented: false,
          segmentationPageIds: [],
          segmentationGender: '',
          segmentationLocale: ''
        }
        break
    }
    if (!incorrectUrl) {
      this.props.clearAlertMessages()
      this.setState({
        errorMessage: ''
      })
      this.props.createautoposting(autopostingData)
      this.props.onClose()
    } else {
      this.setState({
        errorMessage: 'Incorrect Url'
      })
    }
  }

  onSelectItem (value) {
    this.setState({
      errorMessage: ''
    })
    switch (value) {
      case 'facebook':
        this.setState({
          facebookColor: '#ff5e3a',
          twitterColor: '',
          youtubeColor: '',
          wordPressColor: '',
          facebookForeGroundColor: 'white',
          twitterForeGroundColor: 'black',
          youtubeForeGroundColor: 'black',
          wordPressForeGroundColor: 'black'
        })
        break
      case 'twitter':
        this.setState({
          facebookColor: '',
          twitterColor: '#ff5e3a',
          youtubeColor: '',
          wordPressColor: '',
          facebookForeGroundColor: 'black',
          twitterForeGroundColor: 'white',
          youtubeForeGroundColor: 'black',
          wordPressForeGroundColor: 'black'
        })
        break
      case 'youtube':
        this.setState({
          facebookColor: '',
          twitterColor: '',
          youtubeColor: '#ff5e3a',
          wordPressColor: '',
          facebookForeGroundColor: 'black',
          twitterForeGroundColor: 'black',
          youtubeForeGroundColor: 'white',
          wordPressForeGroundColor: 'black'
        })
        break
      case 'wordpress':
        this.setState({
          facebookColor: '',
          twitterColor: '',
          youtubeColor: '',
          wordPressColor: '#ff5e3a',
          facebookForeGroundColor: 'black',
          twitterForeGroundColor: 'black',
          youtubeForeGroundColor: 'black',
          wordPressForeGroundColor: 'white'
        })
        break
    }
  }

  render () {
    let facebookColor = this.state.facebookColor
    let twitterColor = this.state.twitterColor
    let wordPressColor = this.state.wordPressColor
    let youtubeColor = this.state.youtubeColor
    let facebookForeGroundColor = this.state.facebookForeGroundColor
    let twitterForeGroundColor = this.state.twitterForeGroundColor
    let wordPressForeGroundColor = this.state.wordPressForeGroundColor
    // let youtubeForeGroundColor = this.state.youtubeForeGroundColor
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
            <button onClick={() => this.onSelectItem('wordpress')} style={{backgroundColor: wordPressColor, color: wordPressForeGroundColor}} className='btn'>
              <i className='fa fa-wordpress fa-2x' aria-hidden='true' />
              <br />WordPress
            </button>
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
            className='btn btn-primary btn-sm'>Add Facebook Account
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
            className='btn btn-primary btn-sm'>Add Twitter Account
          </button>
        </div>
        }
        { youtubeColor !== '' &&
        <div>
          <div>
            <label> YouTube Channel Url </label>
            <input ref={(c) => { this.youtubeSubscriptionUrl = c }} type='text' className='form-control' />
            { this.state.type === 'youtube' &&
              <span style={{color: 'red'}}>{this.state.errorMessage}</span>
            }
          </div>
          <button style={{float: 'right', margin: '10px'}}
            onClick={() => this.createAutoposting('youtube')}
            className='btn btn-primary btn-sm'>Add YouTube Account
          </button>
        </div>
        }
        { wordPressColor !== '' &&
        <div>
          <div>
            <label> WordPress Channel Url </label>
            <input ref={(c) => { this.wordpressSubscriptionUrl = c }} type='text' className='form-control' />
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
    autopostingData: (state.autopostingInfo.autopostingData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createautoposting: createautoposting,
    clearAlertMessages: clearAlertMessages
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddChannel)
