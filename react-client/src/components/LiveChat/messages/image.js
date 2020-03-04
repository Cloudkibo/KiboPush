import React from 'react'
import PropTypes from 'prop-types'

class Image extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <img
        alt=''
        src={this.props.image.fileurl.url || this.props.image.fileurl}
        style={{maxWidth: '150px', maxHeight: '85px'}}
      />
    )
  }
}

Image.propTypes = {
  'image': PropTypes.object.isRequired
}

export default Image
