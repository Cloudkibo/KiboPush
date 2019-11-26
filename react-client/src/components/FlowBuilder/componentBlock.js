import React from "react"
import PropTypes from 'prop-types'
import COMPONENTSAREA from './componentsArea'

class ComponentBlock extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      items: [],
      quickReplies: null
    }
  }

  render () {
    return (
      <div style={{borderRadius: '4px', width: '300px'}} className='card' onMouseEnter={() => this.props.changeMessage(this.props.currentId)}>
        <div style={{background: '#ccc'}} className='card-header'>
          <h6 style={{marginTop: '10px', textAlign: 'center'}}>
            <i className="flaticon-paper-plane"></i> Message Block
          </h6>
        </div>
        <div style={{border: '1px solid #ccc'}} className='card-body'>
          <COMPONENTSAREA
            currentId={this.props.currentId}
            showAddComponentModal={this.props.showAddComponentModal}
            items={this.props.getItems(this.props.currentId)}
          />
        </div>
      </div>
    )
  }
}

ComponentBlock.propTypes = {
  'showAddComponentModal': PropTypes.func.isRequired,
  'getComponent': PropTypes.func.isRequired,
  'getItems': PropTypes.func.isRequired,
  'linkedMessages': PropTypes.array.isRequired,
  'unlinkedMessages': PropTypes.array.isRequired,
  'currentId': PropTypes.string.isRequired,
  'changeMessage': PropTypes.func.isRequired
}

export default ComponentBlock
