import React from "react"
import PropTypes from 'prop-types'
import COMPONENTSAREA from './componentsArea'

class StartingStep extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.getItems = this.getItems.bind(this)
  }

  getItems () {
    let items = []
    for (let i = 0; i < this.props.linkedMessages[0].messageContent.length; i++) {
      let component = this.props.getComponent(this.props.linkedMessages[0].messageContent[i]).component
      items.push({content: component})
    }
    if (items.length > 0) {
      items.push(this.props.getQuickReplies())
    }
    return items
  }

  render () {
    return (
      <div style={{borderRadius: '4px', width: '300px'}} className='card'>
        <div style={{background: '#34bfa3', color: 'white'}} className='card-header'>
          <h6 style={{textAlign: 'center', marginTop: '10px'}}>
            Starting Step
          </h6>
        </div>
        <div style={{border: '1px solid #34bfa3'}} className='card-body'>
          <COMPONENTSAREA
            targetId='starting-step-add-component'
            showAddComponentModal={this.props.showAddComponentModal}
            getItems={this.getItems}
          />
        </div>
      </div>
    )
  }
}

StartingStep.propTypes = {
  'showAddComponentModal': PropTypes.func.isRequired,
  'getQuickReplies': PropTypes.func.isRequired,
  'getComponent': PropTypes.func.isRequired,
  'linkedMessages': PropTypes.array.isRequired,
  'unlinkedMessages': PropTypes.array.isRequired
}

export default StartingStep
