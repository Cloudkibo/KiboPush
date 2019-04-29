/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class ColorPicker extends React.Component {
  render () {
    console.log('id in colorPicker', this.props.id)
    return (
      <div id={this.props.id} style={{display: 'inline-block'}} data-tip='emoticons'>
        <span onClick={() => this.props.showColorPicker(this.props.name)} >
          <span style={{border: '1px solid', height: '25px', width: '25px', borderRadius: '50%', display: 'inline-block', cursor: 'pointer', backgroundColor: this.props.backgroundColor}} />&nbsp;&nbsp;&nbsp;
          <span style={{cursor: 'pointer', verticalAlign: 'super'}}>{this.props.title}</span>
        </span>
      </div>
    )
  }
}

export default ColorPicker
