import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { createautoposting, clearAlertMessages } from '../../redux/actions/autoposting.actions'

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
      showWordPressGuide: false
    }
    this.onSelectItem = this.onSelectItem.bind(this)
    this.createAutoposting = this.createAutoposting.bind(this)
    this.closeGuide = this.closeGuide.bind(this)
    this.viewGuide = this.viewGuide.bind(this)
  }
  closeGuide () {
    this.setState({
      showWordPressGuide: false
    })
  }
  viewGuide () {
    this.setState({
      showWordPressGuide: true
    })
  }
  createAutoposting (type) {
    var autopostingData = {}

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
    this.props.clearAlertMessages()
    this.props.createautoposting(autopostingData)
    this.props.onClose()
  }

  onSelectItem (value) {
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
        {
        this.state.showWordPressGuide &&
        <ModalContainer style={{width: '500px', top: '80px'}}
          onClose={this.closeGuide}>
          <ModalDialog style={{width: '500px', top: '80px'}}
            onClose={this.closeGuide}>
            <h4>Guielines for integrating WordPress blogs</h4>
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
                      Add our webhook endpoint: 'https://app.kibopush.com/webhooks/wordpress/webhook'
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
                    <p>On self-hosted wordpress sites, install a plug-in 'Notification by Bracket-Space' and follow the steps below to allow autoposting</p>
                    <ul>
                      <li>
                      Choose Trigger: 'Post publised'
                      </li>
                      <li>
                      Choose Notifications: 'webhook'
                      </li>
                      <li>
                      Add our webhook endpoint: 'https://app.kibopush.com/api/autoposting/wordpress'
                      </li>
                      <li>
                      Add arguments: 'post_id', 'post_permalink' and 'post_title'
                      </li>
                      <li>
                      Save your notification.
                      </li>
                    </ul>
                    <p> Once you have added our webhook on WORDPRESS.ORG through Notifications plug-in, our endpoint will be notified whenever a new post is published.
                    Your blog post details will be automatically broadcasted to your subscribers </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalDialog>
        </ModalContainer>
        }
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
          </div>
          <button style={{float: 'right', marginTop: '10px'}}
            onClick={this.viewGuide}
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
