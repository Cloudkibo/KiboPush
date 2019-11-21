import React from "react"
import PropTypes from 'prop-types'
import { Popover, PopoverBody } from 'reactstrap'

class ComponentsPopover extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
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
            type="button" className="btn btn-outline-brand"
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
            type="button"
            className="btn btn-outline-brand"
          >
              + Add Media Component
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
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
            type="button"
            className="btn btn-outline-brand"
          >
              + Add Audio Component
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            type="button"
            className="btn btn-outline-brand"
          >
              + Add File Component
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
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
            type="button"
            className="btn btn-outline-brand"
          >
              + Add Link Carousel Component
          </button>
        </PopoverBody>
      </Popover>
    )
  }
}

ComponentsPopover.propTypes = {
  'showPopover': PropTypes.bool.isRequired,
  'togglePopover': PropTypes.func.isRequired,
  'targetId': PropTypes.string.isRequired
}

export default ComponentsPopover
