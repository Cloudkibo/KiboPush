import React from "react"
// import PropTypes from 'prop-types'
import COMPONENTSAREA from './componentsArea'

class StartingStep extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{borderRadius: '4px'}} className='card'>
        <div style={{background: '#34bfa3', color: 'white'}} className='card-header'>
          <h6 style={{marginTop: '10px'}}>
            Starting Step
          </h6>
        </div>
        <div style={{border: '1px solid #34bfa3'}} className='card-body'>
          <COMPONENTSAREA
            targetId='starting-step-add-component'
          />
        </div>
      </div>
    )
  }
}

StartingStep.propTypes = {

}

export default StartingStep
