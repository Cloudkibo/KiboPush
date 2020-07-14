/* eslint-disable no-return-assign */

import React from 'react'
import PropTypes from 'prop-types'

class NewMessageButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.getStyle = this.getStyle.bind(this)
  }

  getStyle () {
    switch (this.props.position) {
      case 'bottom-right':
        return {
          position: 'fixed',
          bottom: '40px',
          right: '60px'
        }
      case 'bottom-left':
        return {
          position: 'fixed',
          bottom: '70px',
          left: '30px'
        }
      default:
        return {}
    }
  }

  render () {
    return (
			<div style={this.getStyle()} className="m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push" aria-expanded="true">
				<button data-toggle={this.props.dataToggle} data-target={this.props.dataTarget} style={{minWidth: '50px', minHeight: '50px'}} onClick={this.props.onClick} className="m-portlet__nav-link btn btn-lg btn-brand  m-btn m-btn--outline-2x m-btn--air m-btn--icon m-btn--icon-only m-btn--pill  m-dropdown__toggle">
					<i className="flaticon-comment" />
				</button>
			</div>
    )
  }
}

NewMessageButton.defaultProps = {
  'position': 'bottom-right'
}

NewMessageButton.propTypes = {
  'onClick': PropTypes.func,
  'position': PropTypes.string
}

export default NewMessageButton
