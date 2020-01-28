import React from "react"
import PropTypes from 'prop-types'
import { Popover, PopoverBody } from 'reactstrap'

class ButtonActionsPopover extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  performAction (action) {
    action()
    this.props.togglePopover()
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
            {
                this.props.buttonActions.map((action) => {
                    return (
                        <button
                        style={{
                          margin: '5px',
                          border: '1px dashed #716aca',
                          whiteSpace: 'normal',
                          width: '235px'
                        }}
                        onClick={() => this.performAction(action.action)}
                        type="button"
                        className="btn btn-outline-brand"
                      >
                          {action.title}
                      </button>
                    )
                })
            }
        </PopoverBody>
      </Popover>
    )
  }
}

ButtonActionsPopover.propTypes = {
  'showPopover': PropTypes.bool.isRequired,
  'togglePopover': PropTypes.func.isRequired,
  'targetId': PropTypes.string.isRequired,
  'buttonActions': PropTypes.array.isRequired
}

export default ButtonActionsPopover
