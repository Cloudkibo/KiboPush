/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Popover from './popover'
import ColorPicker from './colorPicker'
import Footer from './footer'
import { RingLoader } from 'halogenium'
import { uploadImage } from '../../redux/actions/convos.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateLandingPageData } from '../../redux/actions/landingPages.actions'

class InitialState extends React.Component {
  constructor (props) {
    console.log('props in constructor', props.initialState)
    super(props)
    this.state = {
      showHeadingPicker: false,
      showDescriptionPicker: false,
      showBackgroundPicker: false,
      showImagePlacement: false,
      loading: false
    }
    this.showColorPicker = this.showColorPicker.bind(this)
    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.handleMediaPlacement = this.handleMediaPlacement.bind(this)
    this._onChange = this._onChange.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.removeImage = this.removeImage.bind(this)
  }

  componentDidMount () {
  }

  handleImage (obj) {
    console.log('handleImage', obj)
    this.setState({showImagePlacement: true, loading: false})
    if (this.props.landingPage.currentTab === 'initialState') {
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'mediaLink', obj.image_url)
    } else {
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'state', obj.image_url, 'mediaLink')
    }
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
          // imgSrc: [reader.result]
        })
      }.bind(this)
      this.setState({loading: true})
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

  removeImage () {
    console.log('clicked')

    this.setState({showImagePlacement:false})
    if (this.props.landingPage.currentTab === 'initialState') {
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'mediaLink', '')
    } else {
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'state', '', 'mediaLink')
    }
  }

  handleMediaPlacement (e) {
    if (this.props.landingPage.currentTab === 'initialState') {
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'mediaPlacement', e.target.value)
    } else {
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'state', e.target.value, 'mediaPlacement')
    }
  }

  handleRadioButton (e) {
    if (this.props.landingPage.currentTab === 'initialState') {
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'pageTemplate', e.target.value)
    } else {
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'state', e.target.value, 'pageTemplate')
    }
  }

  handleColorChange (color, value) {
    console.log('color.hex', color.hex)
    if (value === 'heading') {
      if (this.props.landingPage.currentTab === 'initialState') {
        this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'titleColor', color.hex)
      } else {
        this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'state', color.hex, 'titleColor')
      }
    } else if (value === 'description') {
      if (this.props.landingPage.currentTab === 'initialState') {
        this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'descriptionColor', color.hex)
      } else {
        this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'state', color.hex, 'descriptionColor')
      }
    } else if (value === 'background') {
      if (this.props.landingPage.currentTab === 'initialState') {
        this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'backgroundColor', color.hex)
      } else {
        this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'state', color.hex, 'backgroundColor')
      }
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.initialState && nextProps.initialState.mediaLink) {
      this.setState({showImagePlacement: true})
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
    console.log('render in initialState.js', this.props.initialState)
    return (
      <div>
        <Popover isOpen={this.state.showHeadingPicker} target={`${this.props.landingPage.currentTab}heading`} title='heading' toggle={this.toggleColorPicker} color={this.props.initialState.titleColor} onChangeComplete={this.handleColorChange} />
        <Popover isOpen={this.state.showDescriptionPicker} target={`${this.props.landingPage.currentTab}description`} title='description' toggle={this.toggleColorPicker} color={this.props.initialState.descriptionColor} onChangeComplete={this.handleColorChange} />
        <Popover isOpen={this.state.showBackgroundPicker} target={`${this.props.landingPage.currentTab}background`} title='background' toggle={this.toggleColorPicker} color={this.props.initialState.backgroundColor} onChangeComplete={this.handleColorChange} />
        {this.props.landingPage.currentTab !== 'submittedState' &&
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
                    checked={this.props.initialState.pageTemplate === 'text'} />
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
                    checked={this.props.initialState.pageTemplate === 'background'} />
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
            <ColorPicker id={`${this.props.landingPage.currentTab}heading`} name='heading' showColorPicker={this.showColorPicker} backgroundColor={this.props.initialState.titleColor} title='Heading' />
          </div>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <ColorPicker id={`${this.props.landingPage.currentTab}description`} name='description' showColorPicker={this.showColorPicker} backgroundColor={this.props.initialState.descriptionColor} title='Description' />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <ColorPicker id={`${this.props.landingPage.currentTab}background`} name='background' showColorPicker={this.showColorPicker} backgroundColor={this.props.initialState.backgroundColor} title='Background' />
          </div>
        </div>
        <br />
        <label>Image:</label><br />
        <div className='row'>
          <div className='col-md-12 col-lg-12 col-sm-12'>
            <div className='broadcast-component' style={{marginBottom: 40 + 'px'}}>
              <div className='ui-block hoverborder' style={{minHeight: 100, maxWidth: 400, padding: 25}}>
                {
                  this.state.loading
                  ? <div className='align-center' style={{padding: '50px'}}><center><RingLoader color='#716aca' /></center></div>
                  : <div>
                    <input
                      ref='file'
                      type='file'
                      name='user[image]'
                      multiple='true'
                      accept='image/*'
                      title=' '
                      onChange={this._onChange} style={{position: 'absolute', opacity: 0, minHeight: 150, margin: -25, zIndex: 5, cursor: 'pointer'}}
                    />
                    {
                      this.props.initialState.mediaLink === ''
                      ? <div className='align-center'>
                        <img src='https://cdn.cloudkibo.com/public/icons/picture.png' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} alt='Text' />
                        <h4 style={{pointerEvents: 'none', zIndex: -1}}> Upload Image </h4>
                      </div>
                      : <span>
                        <i className='fa fa-remove' style={{float:"right"}} onClick={this.removeImage}></i>
                        <img alt='' style={{width: '300px', height: '100px', margin: 'auto', display: 'block', marginBottom: '10px'}} src={this.props.initialState.mediaLink} />
                      </span>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        {(this.props.landingPage.currentTab === 'submittedState' || this.props.initialState.pageTemplate === 'text') && this.state.showImagePlacement &&
        <div>
          <label>Image Placement:</label><br />
          <div className='row'>
            <div className='col-md-12 col-lg-12 col-sm-12'>
              <select className='custom-select' id='m_form_status' value={this.props.initialState.mediaPlacement} onChange={this.handleMediaPlacement} style={{width: '100%'}}>
                <option key='aboveHeadline' value='aboveHeadline'>Above Headline</option>
                <option key='aboveDescription' value='aboveDescription'>Above Description</option>
                <option key='belowDescription' value='belowDescription'>Below Description</option>
                <option key='contentLeftSide' value='contentLeftSide'>Content Left Side</option>
                <option key='contentRightSide' value='contentRightSide'>Content Right Side</option>
              </select>
            </div>
          </div>
        </div>
      }
        <br />
        {this.props.landingPage.currentTab !== 'submittedState' &&
          <Footer page='initialState' handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    landingPage: state.landingPagesInfo.landingPage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadImage: uploadImage,
    updateLandingPageData: updateLandingPageData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InitialState)
