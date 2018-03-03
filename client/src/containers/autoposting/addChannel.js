import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createautoposting, clearAlertMessages } from '../../redux/actions/autoposting.actions'

class AddChannel extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      facebookColor: '#ff5e3a',
      twitterColor: '',
      youtubeColor: '',
      facebookForeGroundColor: 'white',
      twitterForeGroundColor: 'black',
      youtubeForeGroundColor: 'black'
    }
    this.onSelectItem = this.onSelectItem.bind(this)
    this.createAutoposting = this.createAutoposting.bind(this)
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
          facebookForeGroundColor: 'white',
          twitterForeGroundColor: 'black',
          youtubeForeGroundColor: 'black'
        })
        break
      case 'twitter':
        this.setState({
          facebookColor: '',
          twitterColor: '#ff5e3a',
          youtubeColor: '',
          facebookForeGroundColor: 'black',
          twitterForeGroundColor: 'white',
          youtubeForeGroundColor: 'black'
        })
        break
      case 'youtube':
        this.setState({
          facebookColor: '',
          twitterColor: '',
          youtubeColor: '#ff5e3a',
          facebookForeGroundColor: 'black',
          twitterForeGroundColor: 'black',
          youtubeForeGroundColor: 'white'
        })
        break
    }
  }

  render () {
    let facebookColor = this.state.facebookColor
    let twitterColor = this.state.twitterColor
    let youtubeColor = this.state.youtubeColor
    let facebookForeGroundColor = this.state.facebookForeGroundColor
    let twitterForeGroundColor = this.state.twitterForeGroundColor
    let youtubeForeGroundColor = this.state.youtubeForeGroundColor
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
          {/* <div style={{display: 'inline-block', padding: '5px'}}> */}
          {/* <button onClick={() => this.onSelectItem('youtube')} style={{backgroundColor: youtubeColor, color: youtubeForeGroundColor}} className='btn'> */}
          {/* <i className='fa fa-youtube fa-2x' aria-hidden='true' /> */}
          {/* <br />YouTube */}
          {/* </button> */}
          {/* </div> */}
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
