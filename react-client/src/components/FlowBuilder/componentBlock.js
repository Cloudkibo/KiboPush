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
    this.getItems = this.getItems.bind(this)
  }

  getItems () {
    let items = []
    let messages = this.props.linkedMessages.concat(this.props.unlinkedMessages)
    let components = messages.filter((m) => m.id.toString() === this.props.currentId.toString())
    if (components[0].messageContent.length > 0) {
      for (let i = 0; i < components[0].messageContent.length; i++) {
        let component = this.props.getComponent(components[0].messageContent[i]).component
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
    }
    this.setState({items})
  }

  UNSAFE_componentWillReceiveProps () {
    this.getItems()
  }

  render () {
    return (
      <div style={{borderRadius: '4px', width: '300px'}} className='card'>
        <div style={{background: '#ccc'}} className='card-header'>
          <h6 style={{marginTop: '10px', textAlign: 'center'}}>
            <i className="flaticon-paper-plane"></i> Message Block
          </h6>
        </div>
        <div style={{border: '1px solid #ccc'}} className='card-body'>
          <COMPONENTSAREA
            targetId='message-block-add-component'
            showAddComponentModal={this.props.showAddComponentModal}
            items={this.state.items}
          />
        </div>
      </div>
    )
  }
}

ComponentBlock.propTypes = {
  'showAddComponentModal': PropTypes.func.isRequired,
  'getQuickReplies': PropTypes.func.isRequired,
  'getComponent': PropTypes.func.isRequired,
  'linkedMessages': PropTypes.array.isRequired,
  'unlinkedMessages': PropTypes.array.isRequired,
  'currentId': PropTypes.string.isRequired
}

export default ComponentBlock
