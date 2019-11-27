import React from "react"
import PropTypes from 'prop-types'
import COMPONENTSAREA from './componentsArea'
import { actions } from "@mrblenny/react-flow-chart"

class ComponentBlock extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      items: [],
      quickReplies: null
    }
    console.log('component block actions', actions)
    this.removeMessage = this.removeMessage.bind(this)
  }

  removeMessage (e) {
    let element = document.getElementById('componentBlock'+this.props.currentId)
    console.log('removing message', element)
    element.click()
    element.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 46, bubbles: true, cancelable: true}))
    this.props.removeMessage()
  }

  render () {
    return (
      <div id={'componentBlock'+this.props.currentId} style={{borderRadius: '4px', width: '300px'}} className='card' onMouseEnter={() => this.props.changeMessage(this.props.currentId)}>
        <div style={{background: '#ccc'}} className='card-header'>
          <h6 style={{marginTop: '10px', textAlign: 'center'}}>
            <i className="flaticon-paper-plane"></i> Message Block

            <span role='img' aria-label='times' style={{float: 'right', cursor: 'pointer'}} onClick={this.removeMessage}>❌</span>
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
  'changeMessage': PropTypes.func.isRequired,
  'removeMessage': PropTypes.func.isRequired
}

export default ComponentBlock
