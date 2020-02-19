import React from 'react'
import PropTypes from 'prop-types'

class ButtonItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render () {
    console.log('props in button item side panel', this.props)
    return (
      <button
        onClick={this.props.onButtonClick}
        style={{border: '1px dashed #36a3f7', cursor: 'pointer'}}
        type="button"
        className="btn m-btn--pill btn-outline-info btn-sm m-btn m-btn--custom"
      >
        {this.props.title}
      </button>
    )
  }
}

ButtonItem.propTypes = {
  'title': PropTypes.string.isRequired,
  'onButtonClick': PropTypes.func.isRequired
}

export default ButtonItem
