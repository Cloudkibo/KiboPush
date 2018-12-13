/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Popover from './popover'
import ColorPicker from './colorPicker'

class InitialState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      headingColor: '#000',
      descriptionColor: '#000',
      backgroundColor: '#000',
      showHeadingPicker: false,
      showDescriptionPicker: false,
      showBackgroundPicker: false
    }
    this.showColorPicker = this.showColorPicker.bind(this)
    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
  }

  handleColorChange (color, value) {
    console.log('color.hex', color.hex)
    if (value === 'heading') {
      this.setState({headingColor: color.hex})
    } else if (value === 'description') {
      this.setState({descriptionColor: color.hex})
    } else if (value === 'background') {
      this.setState({backgroundColor: color.hex})
    }
  }

  showColorPicker (value) {
    if (value === 'heading') {
      this.setState({showHeadingPicker: true})
      this.setState({showDescriptionPicker: false})
      this.setState({showBackgroundPicker: false})
    } else if (value === 'description') {
      this.setState({showHeadingPicker: false})
      this.setState({showDescriptionPicker: true})
      this.setState({showBackgroundPicker: false})
    } else if (value === 'background') {
      this.setState({showHeadingPicker: false})
      this.setState({showDescriptionPicker: false})
      this.setState({showBackgroundPicker: true})
    }
  }

  toggleColorPicker (value) {
    if (value === 'heading') {
      this.setState({showHeadingPicker: !this.state.showHeadingPicker})
    } else if (value === 'description') {
      this.setState({showDescriptionPicker: !this.state.showDescriptionPicker})
    } else if (value === 'background') {
      this.setState({showBackgroundPicker: !this.state.showBackgroundPicker})
    }
  }
  render () {
    return (
      <div>
        <Popover isOpen={this.state.showHeadingPicker} target='heading' toggle={this.toggleColorPicker} color={this.state.headingColor} onChangeComplete={this.handleColorChange} />
        <Popover isOpen={this.state.showDescriptionPicker} target='description' toggle={this.toggleColorPicker} color={this.state.descriptionColor} onChangeComplete={this.handleColorChange} />
        <Popover isOpen={this.state.showBackgroundPicker} target='background' toggle={this.toggleColorPicker} color={this.state.backgroundColor} onChangeComplete={this.handleColorChange} />
        <label>Page Template:</label>
        <div className='row' style={{marginLeft: '5px'}}>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <div className='radio'>
              <input id='text'
                type='radio'
                value='text'
                name='text' />
              <label>Text & Media</label>
            </div>
          </div>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <div className='radio'>
              <input id='background'
                type='radio'
                value='background'
                name='background' />
              <label>Media Background</label>
            </div>
          </div>
        </div>
        <br />
        <label>Colors:</label><br />
        <div className='row'>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <ColorPicker id='heading' showColorPicker={this.showColorPicker} backgroundColor={this.state.headingColor} title='Heading' />
          </div>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <ColorPicker id='description' showColorPicker={this.showColorPicker} backgroundColor={this.state.descriptionColor} title='Description' />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <ColorPicker id='background' showColorPicker={this.showColorPicker} backgroundColor={this.state.backgroundColor} title='Background' />
          </div>
        </div>
        <br />
        <label>Image:</label><br />
        <div className='row'>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
              <div className='ui-block hoverborder' style={{minHeight: 100, maxWidth: 400, padding: 25}}>
                <div>
                  <input
                    ref='file'
                    type='file'
                    name='user[image]'
                    multiple='true'
                    accept='image/*'
                    title=' '
                    onChange={this._onChange} style={{position: 'absolute', opacity: 0, minHeight: 150, margin: -25, zIndex: 5, cursor: 'pointer'}} />
                  <div className='align-center'>
                    <img src='https://cdn.cloudkibo.com/public/icons/picture.png' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} alt='Text' />
                    <h4 style={{pointerEvents: 'none', zIndex: -1}}> Upload Image </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InitialState
