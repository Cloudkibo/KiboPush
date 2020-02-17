import React from 'react'
import PropTypes from 'prop-types'
import TEXT from './text'
import ATTACHMENTS from './attachments'
import GALLERY from './gallery'

class Preview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeComponent: ''
    }
    this.getComponent = this.getComponent.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.editComponent = this.editComponent.bind(this)
  }

  getComponent (item, lastItem) {
    const type = item.componentName
    switch (type) {
      case 'text':
        return <TEXT
          lastItem={lastItem}
          itemPayload={item}
          profilePic={this.props.profilePic}
          removeComponent={this.removeComponent}
          editComponent={this.editComponent}
          isActive={(item.id === this.state.activeComponent)}
        />
      case 'attachments':
        return <ATTACHMENTS
          lastItem={lastItem}
          itemPayload={item}
          profilePic={this.props.profilePic}
          removeComponent={this.removeComponent}
          editComponent={this.editComponent}
          isActive={(item.id === this.state.activeComponent)}
        />
      case 'file':
        return <ATTACHMENTS
          lastItem={lastItem}
          itemPayload={item}
          profilePic={this.props.profilePic}
          removeComponent={this.removeComponent}
          editComponent={this.editComponent}
          isActive={(item.id === this.state.activeComponent)}
        />
      case 'audio':
        return <ATTACHMENTS
          lastItem={lastItem}
          itemPayload={item}
          profilePic={this.props.profilePic}
          removeComponent={this.removeComponent}
          editComponent={this.editComponent}
          isActive={(item.id === this.state.activeComponent)}
        />
      case 'media':
        return <ATTACHMENTS
          lastItem={lastItem}
          itemPayload={item}
          profilePic={this.props.profilePic}
          removeComponent={this.removeComponent}
          editComponent={this.editComponent}
          isActive={(item.id === this.state.activeComponent)}
        />
      case 'gallery':
        return <GALLERY
          lastItem={lastItem}
          itemPayload={item}
          profilePic={this.props.profilePic}
          removeComponent={this.removeComponent}
          editComponent={this.editComponent}
          isActive={(item.id === this.state.activeComponent)}
          updateBroadcastData={this.props.updateBroadcastData}
          blockId={this.props.blockId}
        />
      default:
        return null
    }
  }

  removeComponent (componentId) {
    this.props.updateBroadcastData(this.props.blockId, componentId, 'delete')
  }

  editComponent (data) {
    this.props.handleSidePanel(true, this.props.sidePanelStyle, this.props.blockId, data.componentName, 'Edit', data)
    this.setState({activeComponent: data.id})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps in preview main', nextProps)
    if (nextProps.activeComponent !== this.state.activeComponent) {
      this.setState({activeComponent: nextProps.activeComponent})
    }
  }

  render () {
     return (
      <div className="m-messenger m-messenger--message-arrow m-messenger--skin-light">
        <div className="m-messenger__messages mCustomScrollbar _mCS_7 mCS-autoHide">
          {
            this.props.items.map((item, index) => (
              this.getComponent(item, (this.props.items.length - 1) === index)
            ))
          }
        </div>
      </div>
    )
  }
}

Preview.propTypes = {
  'items': PropTypes.array.isRequired,
  'profilePic': PropTypes.string.isRequired,
  'blockId': PropTypes.string.isRequired,
  'updateBroadcastData': PropTypes.func.isRequired,
  'handleSidePanel': PropTypes.func.isRequired,
  'sidePanelStyle': PropTypes.object.isRequired
}

export default Preview
