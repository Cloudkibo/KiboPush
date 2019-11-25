import React from "react"
import PropTypes from 'prop-types'
import COMPONENTSAREA from './componentsArea'

class StartingStep extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      items: [],
      quickReplies: null
    }
    this.getItems = this.getItems.bind(this)
  }

  componentDidMount () {
    this.getItems()
  }

  getItems () {
    let items = []
    for (let i = 0; i < this.props.linkedMessages[0].messageContent.length; i++) {
      let component = this.props.getComponent(this.props.linkedMessages[0].messageContent[i]).component
      items.push({content: component})
    }
    if (items.length > 0) {
      if (!this.state.quickReplies) {
        let quickReplies = this.props.getQuickReplies()
        this.setState({quickReplies})
        items.push(quickReplies)
      } else {
        items.push(this.state.quickReplies)
      }
    }
    this.setState({items})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.getItems()
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
            items={this.state.items}
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
