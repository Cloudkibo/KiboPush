import React from 'react'
import PropTypes from 'prop-types'

class Image extends React.Component {
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
          <img
            alt=''
            src={this.props.message.payload.fileurl.url || this.props.message.payload.fileurl}
            style={{maxWidth: '150px', maxHeight: '85px'}}
          />
        </div>
        {this.props.seenElement}
      </div>
    )
  }
}

Image.propTypes = {
  'message': PropTypes.object.isRequired,
  'repliedByMessage': PropTypes.string.isRequired,
  'seenElement': PropTypes.element.isRequired
}

export default Image
