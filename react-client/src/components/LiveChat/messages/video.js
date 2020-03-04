import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'

class Video extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <ReactPlayer
        url={this.props.video.fileurl.url}
        controls
        width='200px'
        height='100%'
      />
    )
  }
}

Video.propTypes = {
  'video': PropTypes.object.isRequired
}

export default Video
