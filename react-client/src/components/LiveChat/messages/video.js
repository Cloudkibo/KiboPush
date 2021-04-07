import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import TEXT from './text'

class Video extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      videoError:false,
      errorMessage:  {
        text : 'Media is not available'
      }
    }
    this.onError = this.onError.bind(this)
  }

  onError(e) {
    console.log('onError', e)
    this.setState({videoError : true})
  }

  
  render() {
    console.log('this.state.videoError', this.state.videoError)
    return (
      <div>
      { this.state.videoError === false ?
      <ReactPlayer
        url={this.props.video.fileurl.url}
        controls
        width='200px'
        height='100%'
        onError={e => this.onError(e)}
        onDuration={e => console.log('onDuration', e)}
      />
      :
      <TEXT
      text={this.state.errorMessage}
      color='white'
    />
    }
    </div>
    )
  }
}

Video.propTypes = {
  'video': PropTypes.object.isRequired
}

export default Video
