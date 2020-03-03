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
      <div>
        <div className='m-messenger__message-content'>
          <div className='m-messenger__message-username'>
            {this.props.repliedByMessage}
          </div>
          <ReactPlayer
            url={this.props.message.payload.fileurl.url}
            controls
            width='200px'
            height='60px'
          />
        </div>
        {this.props.seenElement}
      </div>
    )
  }
}

Audio.propTypes = {
  'message': PropTypes.object.isRequired,
  'repliedByMessage': PropTypes.string.isRequired,
  'seenElement': PropTypes.element.isRequired
}

export default Audio
