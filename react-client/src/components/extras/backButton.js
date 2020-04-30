/* eslint-disable no-return-assign */
/**
 * Created by imran on 26/12/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

class BackButton extends React.Component {
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
          bottom: '60px',
          right: '60px'
        }
      case 'bottom-left':
        return {
          position: 'fixed',
          bottom: '60px',
          left: '60px'
        }
      default:
        return {}
    }
  }

  render () {
    return (
			<div style={this.getStyle()} className="m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push" aria-expanded="true">
				<button href="#/" onClick={this.props.onBack} className="m-portlet__nav-link btn btn-lg btn-primary  m-btn m-btn--outline-2x m-btn--air m-btn--icon m-btn--icon-only m-btn--pill  m-dropdown__toggle">
					<i className="la la-arrow-left" />
				</button>
			</div>
    )
  }
}

BackButton.defaultProps = {
  'position': 'bottom-right'
}

BackButton.propTypes = {
  'onBack': PropTypes.func.isRequired,
  'position': PropTypes.string
}

export default BackButton
