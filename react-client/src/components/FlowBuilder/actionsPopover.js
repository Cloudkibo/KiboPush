import React from "react"
import PropTypes from 'prop-types'
import { Popover, PopoverBody } from 'reactstrap'

class ActionsPopover extends React.Component {
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
            onClick={() => this.props.addActionItem('subscribe_to_sequence')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Subscribe to sequence
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.props.addActionItem('unsubscribe_from_sequence')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Unsubscribe from sequene
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.props.addActionItem('assign_tag')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Assign tag
          </button>
          <button
            style={{
              margin: '5px',
              border: '1px dashed #716aca',
              whiteSpace: 'normal',
              width: '235px'
            }}
            onClick={() => this.props.addActionItem('unassign_tag')}
            type="button"
            className="btn btn-outline-brand"
          >
              + Unassign Tag
          </button>
        </PopoverBody>
      </Popover>
    )
  }
}

ActionsPopover.propTypes = {
  'showPopover': PropTypes.bool.isRequired,
  'togglePopover': PropTypes.func.isRequired,
  'targetId': PropTypes.string.isRequired,
  'addActionItem': PropTypes.func.isRequired
}

export default ActionsPopover
