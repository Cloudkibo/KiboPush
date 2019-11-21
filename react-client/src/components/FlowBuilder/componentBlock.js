import React from "react"
// import PropTypes from 'prop-types'
import COMPONENTSAREA from './componentsArea'

class ComponentBlock extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div style={{borderRadius: '4px'}} className='card'>
        <div style={{background: '#ccc'}} className='card-header'>
          <h6 style={{marginTop: '10px'}}>
            <i className="flaticon-paper-plane"></i> Message Block
          </h6>
        </div>
        <div style={{border: '1px solid #ccc'}} className='card-body'>
          <COMPONENTSAREA
            targetId='message-block-add-component'
          />
        </div>
      </div>
    )
  }
}

ComponentBlock.propTypes = {

}

export default ComponentBlock
