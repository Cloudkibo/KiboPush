import React from 'react'
import PropTypes from 'prop-types'

class Sidebar extends React.Component {
	constructor (props, context) {
		super(props, context)
		this.state = {
		}
	}

  render () {
	return (
			<div className="m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1	m-login__content" style={{backgroundImage: 'url(https://cdn.cloudkibo.com/public/assets/app/media/img//bg/bg-4.jpg)'}}>
				<div className="m-grid__item m-grid__item--middle">
					<h3 className="m-login__welcome" style={{fontSize: 'xx-large'}}>
						{this.props.heading}
					</h3>
					<p className="m-login__msg">
						{this.props.description}
					</p>
				</div>
			</div>
	)
  }
}
Sidebar.propTypes = {
	'heading': PropTypes.string.isRequired,
	'description': PropTypes.string.isRequired
}

  export default Sidebar