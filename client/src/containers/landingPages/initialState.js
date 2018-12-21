/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Popover from './popover'
import ColorPicker from './colorPicker'
import Footer from './footer'
import { uploadImage } from '../../redux/actions/convos.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class InitialState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      headingColor: '#000',
      descriptionColor: '#000',
      backgroundColor: '#fff',
      showHeadingPicker: false,
      showDescriptionPicker: false,
      showBackgroundPicker: false,
      selectedRadio: 'text',
      mediaPlacement: 'aboveHeadline',
      imgSrc: ''
    }
    this.showColorPicker = this.showColorPicker.bind(this)
    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.handleMediaPlacement = this.handleMediaPlacement.bind(this)
    this._onChange = this._onChange.bind(this)
    this.handleImage = this.handleImage.bind(this)
  }

  componentDidMount () {
    this.props.setInitialState(this.state.selectedRadio, this.state.backgroundColor, this.state.headingColor, this.state.descriptionColor, this.state.imgSrc, this.state.mediaPlacement)
  }

  handleImage (obj) {
    console.log('handleImage', obj)
    this.setState(imgSrc: obj.image_url)
    this.props.setInitialState(this.state.selectedRadio, this.state.backgroundColor, this.state.headingColor, this.state.descriptionColor, obj.image_url, this.state.mediaPlacement)
  }

  _onChange (images) {
  // Assuming only image
    var file = this.refs.file.files[0]
    if (file) {
      if (file && file.type !== 'image/bmp' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
        return
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = function (e) {
        this.setState({
          imgSrc: [reader.result]
        })
      }.bind(this)
      this.props.uploadImage(file, this.props.pages, 'image', {
        id: this.props.id,
        componentType: 'image',
        fileName: file.name,
        fileurl: '',
        image_url: '',
        type: file.type, // jpg, png, gif
        size: file.size
      }, this.handleImage)
    }
  }

  handleMediaPlacement (e) {
    this.setState({mediaPlacement: e.target.value})
    this.props.setInitialState(this.state.selectedRadio, this.state.backgroundColor, this.state.headingColor, this.state.descriptionColor, this.state.imgSrc, e.target.value)
  }

  handleNext () {
    // this.props.setInitialState(this.state.selectedRadio, this.state.backgroundColor, this.state.headingColor, this.state.descriptionColor, this.state.imgSrc, this.state.mediaPlacement)
  }

  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    this.props.setInitialState(e.target.value, this.state.backgroundColor, this.state.headingColor, this.state.descriptionColor, this.state.imgSrc, this.state.mediaPlacement)
  }

  handleColorChange (color, value) {
    console.log('color.hex', color.hex)
    if (value === 'heading') {
      this.setState({headingColor: color.hex})
      this.props.setInitialState(this.state.selectedRadio, this.state.backgroundColor, color.hex, this.state.descriptionColor, this.state.imgSrc, this.state.mediaPlacement)
    } else if (value === 'description') {
      this.setState({descriptionColor: color.hex})
      this.props.setInitialState(this.state.selectedRadio, this.state.backgroundColor, this.state.headingColor, color.hex, this.state.imgSrc, this.state.mediaPlacement)
    } else if (value === 'background') {
      this.setState({backgroundColor: color.hex})
      this.props.setInitialState(this.state.selectedRadio, color.hex, this.state.headingColor, this.state.descriptionColor, this.state.imgSrc, this.state.mediaPlacement)
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
        {!this.props.submittedState &&
          <div>
            <label>Page Template:</label>
            <div className='row' style={{marginLeft: '5px'}}>
              <div className='col-md-6 col-lg-6 col-sm-6'>
                <div className='radio'>
                  <input id='text'
                    type='radio'
                    value='text'
                    name='text'
                    onChange={this.handleRadioButton}
                    checked={this.state.selectedRadio === 'text'} />
                  <label>Text & Media</label>
                </div>
              </div>
              <div className='col-md-6 col-lg-6 col-sm-6'>
                <div className='radio'>
                  <input id='background'
                    type='radio'
                    value='background'
                    name='background'
                    onChange={this.handleRadioButton}
                    checked={this.state.selectedRadio === 'background'} />
                  <label>Media Background</label>
                </div>
              </div>
            </div>
            <br />
            </div>
          }
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
          <div className='col-md-12 col-lg-12 col-sm-12'>
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
                  {this.state.imgSrc === ''
                ? <div className='align-center'>
                    <img src='https://cdn.cloudkibo.com/public/icons/picture.png' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} alt='Text' />
                    <h4 style={{pointerEvents: 'none', zIndex: -1}}> Upload Image </h4>
                    </div>
                  : <img style={{width: '300px', height: '100px', margin: 'auto', display: 'block', marginBottom: '10px'}} src={this.state.imgSrc} />
                }
              </div>
              </div>
            </div>
          </div>
        </div>
        <label>Image Placement:</label><br />
        <div className='row'>
          <div className='col-md-12 col-lg-12 col-sm-12'>
            <select className='custom-select' id='m_form_status' value={this.state.mediaPlacement} onChange={this.handleMediaPlacement} style={{width: '100%'}}>
              <option key='aboveHeadline' value='aboveHeadline'>Above Headline</option>
              <option key='aboveDescription' value='aboveDescription'>Above Description</option>
              <option key='belowDescription' value='belowDescription'>Below Description</option>
              <option key='contentLeftSide' value='contentLeftSide'>Content Left Side</option>
              <option key='contentRightSide' value='contentRightSide'>Content Right Side</option>
            </select>
          </div>
        </div>
        <br />
        {!this.props.submittedState &&
          <Footer page='initialState' handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadImage: uploadImage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InitialState)
