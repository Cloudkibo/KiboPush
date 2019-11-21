import React from "react"
// import PropTypes from 'prop-types'
import ACTIONSAREA from './actionsArea'

class ActionBlock extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{borderRadius: '4px'}} className='card'>
        <div style={{background: '#ccc'}} className='card-header'>
          <h6 style={{marginTop: '10px'}}>
            <i className="flaticon-interface-9"></i> Actions Block
          </h6>
        </div>
        <div style={{border: '1px solid #ccc'}} className='card-body'>
          <ACTIONSAREA />
        </div>
      </div>
    )
  }
}

ActionBlock.propTypes = {

}

export default ActionBlock
