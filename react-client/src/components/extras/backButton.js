/* eslint-disable no-return-assign */
/**
 * Created by imran on 26/12/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

class BackButton extends React.Component {
  render () {
    return (
			<div style={{position: 'fixed', bottom: '40px', right: '60px'}} className="m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push" aria-expanded="true">
				<button href="#/" onClick={this.props.onBack} className="m-portlet__nav-link btn btn-lg btn-primary  m-btn m-btn--outline-2x m-btn--air m-btn--icon m-btn--icon-only m-btn--pill  m-dropdown__toggle">
					<i className="la la-arrow-left" />
				</button>
			</div>
    )
  }
}

BackButton.propTypes = {
  'onBack': PropTypes.func.isRequired
}

export default BackButton
