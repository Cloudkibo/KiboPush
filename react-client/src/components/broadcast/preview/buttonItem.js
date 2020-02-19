import React from 'react'
import PropTypes from 'prop-types'

class ButtonItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render () {
    console.log('props in button item preview', this.props)
    return (
      <button
        type="button"
        className="btn btn-outline-info btn-sm"
        style={{border: '1px solid #36a3f7'}}
      >
        {this.props.title.length > 20 ? `${this.props.title.substring(0, 20)}...` : this.props.title}
      </button>
    )
  }
}

ButtonItem.propTypes = {
  'title': PropTypes.string.isRequired
}

export default ButtonItem
