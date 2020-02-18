import React from "react"
import PropTypes from 'prop-types'
import { Popover, PopoverBody } from 'reactstrap'

class ComponentsPopover extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.onItemClick = this.onItemClick.bind(this)
  }

  onItemClick (component) {
    this.props.togglePopover()
    this.props.handleSidePanel(true, this.props.sidePanelStyle, this.props.currentId, component, 'Add')
  }

  render () {
    return (
      <Popover
        trigger='click hover'
        placement='auto'
        isOpen={this.props.showPopover}
        toggle={this.props.togglePopover}
        target={this.props.targetId}
      >
        <PopoverBody>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.onItemClick('text')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Add Text Component
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.onItemClick('attachments')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Add Attachments Component
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.onItemClick('gallery')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Add Gallery Component
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.onItemClick('YouTube video')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Add YouTube Video Component
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.onItemClick('links carousel')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Add Link Carousel Component
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.onItemClick('user input')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Add User Input Component
          </button>
        </PopoverBody>
      </Popover>
    )
  }
}

ComponentsPopover.propTypes = {
  'showPopover': PropTypes.bool.isRequired,
  'togglePopover': PropTypes.func.isRequired,
  'targetId': PropTypes.string.isRequired,
  'showAddComponentModal': PropTypes.func.isRequired,
  'sidePanelStyle': PropTypes.object.isRequired,
  'handleSidePanel': PropTypes.func.isRequired,
  'currentId': PropTypes.string.isRequired
}

export default ComponentsPopover
