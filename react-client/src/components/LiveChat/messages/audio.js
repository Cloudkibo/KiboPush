import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'

class Audio extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <ReactPlayer
        url={this.props.audio.fileurl.url}
        controls
        width='200px'
        height='60px'
      />
    )
  }
}

Audio.propTypes = {
  'audio': PropTypes.object.isRequired
}

export default Audio
