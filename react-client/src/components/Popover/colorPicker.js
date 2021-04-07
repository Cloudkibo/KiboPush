import React from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'
import { Popover, PopoverBody } from 'reactstrap'

class ColorPicker extends React.Component {
  render () {
    return (
      <Popover placement='right' isOpen={this.props.isOpen} className='greetingPopover' target={this.props.target} toggle={() => this.props.toggle(this.props.title)}>
        <PopoverBody style={{padding: '0'}}>
          <div>
            <SketchPicker
              color={this.props.color}
              onChangeComplete={(e) => this.props.onChangeComplete(e, this.props.title)} />
          </div>
        </PopoverBody>
      </Popover>
    )
  }
}
ColorPicker.propTypes = {
  'isOpen': PropTypes.bool.isRequired,
  'target': PropTypes.string.isRequired,
  'toggle': PropTypes.func.isRequired,
  'title': PropTypes.string.isRequired,
  'color': PropTypes.string.isRequired,
}

export default ColorPicker
