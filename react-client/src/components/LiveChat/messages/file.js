import React from 'react'
import PropTypes from 'prop-types'

class File extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <a
        download={this.props.file.fileName}
        target='_blank'
        rel='noopener noreferrer'
        href={this.props.file.fileurl.url}
      >
        <h6 style={{wordBreak: 'break-all', color: this.props.textColor}}>
          <i className='fa fa-file-text-o' /> {this.props.file.fileName || this.props.file.fileurl.name}
        </h6>
      </a>
    )
  }
}

File.propTypes = {
  'file': PropTypes.object.isRequired,
  'textColor': PropTypes.string
}

export default File
