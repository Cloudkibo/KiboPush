import React from 'react'
import PropTypes from 'prop-types'

class PlanItem extends React.Component {
	constructor (props, context) {
		super(props, context)
		this.state = {
		}
		this.getContentColor = this.getContentColor.bind(this)
	}

	getContentColor () {
		return ({color: this.props.planInfo._id === this.props.selectedPlan ? 'white' : 'black'})
	}

  render () {
    return (
			<div
				className="sequence-box" 
				style={{height: 'auto', backgroundColor: `${this.props.planInfo._id === this.props.selectedPlan ? '#34bfa3' : 'white'}`, cursor: 'pointer'}}
				key={this.props.planInfo._id}
				onClick={() => this.props.updateState({ selectedPlan: this.props.planInfo._id })}>
				<span>
					<span className="sequence-name"
					style={this.getContentColor()}>
						{this.props.planInfo.name}
					</span>
					<br />
					<span>
						<span style={this.getContentColor()}>
							{this.props.description}
						</span>
					</span>
				</span>
				<span className="sequence-text sequence-centered-text" style={{position: 'absolute', left: '77%', top: '25%'}}>
					<span className="sequence-number"
						style={this.getContentColor()}>
						{this.props.planInfo.amount ? `$${this.props.planInfo.amount}` : ''}
					</span>
				</span>
			</div>
    )
  }
}
PlanItem.propTypes = {
	'planInfo': PropTypes.object.isRequired,
	'description': PropTypes.string.isRequired,
	'selectedPlan': PropTypes.string.isRequired,
	'updateState': PropTypes.func.isRequired
}
  
  export default PlanItem