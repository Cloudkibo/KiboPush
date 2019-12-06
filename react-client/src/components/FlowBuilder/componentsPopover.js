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
            onClick={() => this.props.showAddComponentModal('text')}
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
            onClick={() => this.props.showAddComponentModal('media')}
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
            onClick={() => this.props.showAddComponentModal('card')}
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
            onClick={() => this.props.showAddComponentModal('audio')}
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
            onClick={() => this.props.showAddComponentModal('file')}
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
            onClick={() => this.props.showAddComponentModal('video')}
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
            onClick={() => this.props.showAddComponentModal('link')}
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
  'targetId': PropTypes.string.isRequired,
  'showAddComponentModal': PropTypes.func.isRequired
}

export default ComponentsPopover
