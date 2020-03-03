import React from 'react'
import PropTypes from 'prop-types'

class File extends React.Component {
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
          <a
            download={this.props.message.payload.fileName}
            target='_blank'
            rel='noopener noreferrer'
            href={this.props.message.payload.fileurl.url}
          >
            <h6 style={{color: 'white'}}>
              <i className='fa fa-file-text-o' /> {this.props.message.payload.fileName}
            </h6>
          </a>
        </div>
        {this.props.seenElement}
      </div>
    )
  }
}

File.propTypes = {
  'message': PropTypes.object.isRequired,
  'repliedByMessage': PropTypes.string.isRequired,
  'seenElement': PropTypes.element.isRequired
}

export default File
