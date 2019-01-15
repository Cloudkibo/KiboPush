import React from 'react'
import ViewMessage from '../../components/ViewMessage/viewMessage'
import { Link } from 'react-router'

class ViewBroadcastTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.onTestURLAudio = this.onTestURLAudio.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | View Broadcast Template`;
  }

  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  onTestURLAudio (url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-4'>
              <h3>Title: {this.props.location.state.title}</h3>
              <p>Category: {this.props.location.state.category.join(',')}</p>
              <Link to='/templates' style={{float: 'left', lineHeight: 2.5}} className='btn btn-secondary btn-sm'> Back </Link>
            </div>
            <div className='col-xl-6'>
              <ViewMessage payload={this.props.location.state.payload} />
            </div>
            <div className='col-xl-2' />
          </div>
        </div>
      </div>
    )
  }
}

export default ViewBroadcastTemplate
