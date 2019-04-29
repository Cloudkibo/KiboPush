/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { SketchPicker } from 'react-color'
import { Popover, PopoverBody } from 'reactstrap'

class PopOver extends React.Component {
  render () {
    console.log('this.props.color', this.props.color)
    return (
      <Popover placement='left' isOpen={this.props.isOpen} className='greetingPopover' target={this.props.target} toggle={() => this.props.toggle(this.props.title)}>
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

export default PopOver
