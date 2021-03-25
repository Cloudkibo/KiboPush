import React from "react"
import PropTypes from 'prop-types'
import ColorPicker from '../../../components/Popover/colorPicker'

class ButtonDesignAndText extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showBackgroundColor1Picker: false,
      showBackgroundColor2Picker: false,
      showIconColorPicker: false,
      showTextColorPicker: false
    }
    this.showColorPicker = this.showColorPicker.bind(this)
    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleBackgroundColorStyle = this.handleBackgroundColorStyle.bind(this)
    this.getButtonStyle = this.getButtonStyle.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  handleCheckbox (e) {
    let textMessage = JSON.parse(JSON.stringify(this.props.textMessage))
    textMessage.includePageURL = e.target.checked
    this.props.updateState({textMessage})
  }

  handleInput (e, value) {
    let textMessage = this.props.textMessage
    if (value === 'btnText' && e.target.value.length <= 12 && e.target.value.length >= 1) {
      textMessage.btnText = e.target.value
    } else if (value === 'message' && e.target.value.length <= 140){
      textMessage.message = e.target.value
    }
    this.props.updateState({textMessage})
  }

  handleColorChange (color, value) {
    let btnDesign = this.props.btnDesign
    if (value === 'backgroundColor1') {
      btnDesign.backgroundColor1 = color.hex
    } else if (value === 'backgroundColor2') {
      btnDesign.backgroundColor2 = color.hex
    } else if (value === 'iconColor') {
      btnDesign.iconColor = color.hex
    } else if (value === 'btnTextColor') {
      btnDesign.btnTextColor = color.hex
    }
    this.props.updateState({btnDesign})
  }

  toggleColorPicker (value) {
    if (value === 'backgroundColor1') {
      this.setState({showBackgroundColor1Picker: !this.state.showBackgroundColor1Picker})
    } else if (value === 'backgroundColor2') {
      this.setState({showBackgroundColor2Picker: !this.state.showBackgroundColor2Picker})
    } else if (value === 'iconColor') {
      this.setState({showIconColorPicker: !this.state.showIconColorPicker})
    } else if (value === 'btnTextColor') {
      this.setState({showTextColorPicker: !this.state.showTextColorPicker})
    }
  }

  showColorPicker (value) {
    if (value === 'backgroundColor1') {
      this.setState({
        showBackgroundColor1Picker: true,
        showBackgroundColor2Picker: false,
        showIconColorPicker: false,
        showTextColorPicker: false
      })
    } else if (value === 'backgroundColor2') {
      this.setState({
        showBackgroundColor2Picker: true,
        showBackgroundColor1Picker: false,
        showIconColorPicker: false,
        showTextColorPicker: false
      })
    } else if (value === 'iconColor') {
      this.setState({
        showIconColorPicker: true,
        showTextColorPicker: false,
        showBackgroundColor1Picker: false,
        showBackgroundColor2Picker: false
      })
    } else if (value === 'btnTextColor') {
      this.setState({
        showTextColorPicker: true,
        showIconColorPicker: false,
        showBackgroundColor1Picker: false,
        showBackgroundColor2Picker: false
      })
    }
  }

  handleBackgroundColorStyle (e) {
    let btnDesign = this.props.btnDesign
    btnDesign.backgroundColorStyle = e.target.value
    this.props.updateState({btnDesign})
  }

  getButtonStyle () {
    if (this.props.btnDesign.backgroundColorStyle === 'single') {
      return {
        transform: `rotate(${this.props.rotateDegree}deg)`,
        borderColor: this.props.btnDesign.backgroundColor1,
        backgroundColor: this.props.btnDesign.backgroundColor1
      }
    } else {
      return {
        borderColor: 'white',
        transform: `rotate(${this.props.rotateDegree}deg)`,
        backgroundImage: `linear-gradient(${this.props.gradientDegree}deg, ${this.props.btnDesign.backgroundColor1} 0%, ${this.props.btnDesign.backgroundColor2} 100%)`
      }
    }
  }

  render () {
    return (
      <div className='row'>
        <ColorPicker
          isOpen={this.state.showBackgroundColor1Picker}
          target='backgroundColor1'
          title='backgroundColor1'
          toggle={this.toggleColorPicker}
          color={this.props.btnDesign.backgroundColor1}
          onChangeComplete={this.handleColorChange}
        />
        <ColorPicker
          isOpen={this.state.showBackgroundColor2Picker}
          target='backgroundColor2'
          title='backgroundColor2'
          toggle={this.toggleColorPicker}
          color={this.props.btnDesign.backgroundColor2}
          onChangeComplete={this.handleColorChange}
        />
        <ColorPicker
          isOpen={this.state.showIconColorPicker}
          target='iconColor'
          title='iconColor'
          toggle={this.toggleColorPicker}
          color={this.props.btnDesign.iconColor}
          onChangeComplete={this.handleColorChange}
        />
        <ColorPicker
          isOpen={this.state.showTextColorPicker}
          target='btnTextColor'
          title='btnTextColor'
          toggle={this.toggleColorPicker}
          color={this.props.btnDesign.btnTextColor}
          onChangeComplete={this.handleColorChange}
        />
        <div className='col-md-9'>
          <div className='form-group m-form__group'>
            <span style={{fontWeight: 'bold'}}>Button Design:</span>
          </div>
          <div className='form-group m-form__group'>
            <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
              <label style={{fontWeight: 'normal'}}>Background style:</label>
              <div className="m-radio-inline" style={{marginLeft: '39px', marginTop: '-1px'}}>
                <label className="m-radio" style={{fontWeight: 'lighter'}}>
                  <input
                    type='radio'
                    value='single'
                    onChange={this.handleBackgroundColorStyle}
                    onClick={this.handleBackgroundColorStyle}
                    checked={this.props.btnDesign.backgroundColorStyle === 'single'}
                  />
                Single color
                  <span></span>
                </label>
                <label className="m-radio" style={{fontWeight: 'lighter'}}>
                  <input
                    type='radio'
                    value='gradient'
                    onChange={this.handleBackgroundColorStyle}
                    onClick={this.handleBackgroundColorStyle}
                    checked={this.props.btnDesign.backgroundColorStyle === 'gradient'}
                   />
                 Gradient of two Colors
                  <span></span>
                </label>
              </div>
            </div>
            <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
              <label style={{fontWeight: 'normal'}}>Background color 1:</label>
                <div className="input-group m-input-group" id='backgroundColor1'
                  style={{marginLeft: '30px', width: '30%', marginTop: '-7px'}} onClick={() => this.showColorPicker('backgroundColor1')}>
        					<span className="input-group-addon" id="basic-addon1"
                    style={{backgroundColor: this.props.btnDesign.backgroundColor1, width: '40px'}}></span>
    					    <input type="text" className="form-control m-input" aria-describedby="basic-addon1"
                    value={this.props.btnDesign.backgroundColor1} />
      				    </div>
                </div>
                <div className='form-group m-form__group row'
                  style={{paddingLeft: '30px', display: this.props.btnDesign.backgroundColorStyle === 'gradient' ? 'flex': 'none'}}>
                  <label style={{fontWeight: 'normal'}}>Background color 2:</label>
                    <div className="input-group m-input-group" id='backgroundColor2'
                      style={{marginLeft: '27px', width: '30%', marginTop: '-7px'}} onClick={() => this.showColorPicker('backgroundColor2')}>
            					<span className="input-group-addon" id="basic-addon1"
                        style={{backgroundColor: this.props.btnDesign.backgroundColor2, width: '40px'}}></span>
        					    <input type="text" className="form-control m-input" aria-describedby="basic-addon1"
                        value={this.props.btnDesign.backgroundColor2 } />
    		            </div>
                </div>
                <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                  <label style={{fontWeight: 'normal'}}>Icon color:</label>
                    <div className="input-group m-input-group" id='iconColor'
                      style={{marginLeft: '94px', width: '30%', marginTop: '-7px'}} onClick={() => this.showColorPicker('iconColor')}>
            					<span className="input-group-addon" id="basic-addon1"
                        style={{backgroundColor: this.props.btnDesign.iconColor, width: '40px'}}></span>
        					    <input type="text" className="form-control m-input" aria-describedby="basic-addon1"
                        value={this.props.btnDesign.iconColor } />
    		            </div>
                </div>
                <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                  <label style={{fontWeight: 'normal'}}>Text color:</label>
                    <div className="input-group m-input-group" id='btnTextColor'
                      style={{marginLeft: '94px', width: '30%', marginTop: '-7px'}} onClick={() => this.showColorPicker('btnTextColor')}>
            					<span className="input-group-addon" id="basic-addon1"
                        style={{backgroundColor: this.props.btnDesign.btnTextColor, width: '40px'}}></span>
        					    <input type="text" className="form-control m-input" aria-describedby="basic-addon1"
                        value={this.props.btnDesign.btnTextColor } />
    		            </div>
                </div>
            </div>
        <div className='form-group m-form__group'>
          <span style={{fontWeight: 'bold'}}>Button Text:</span>
        </div>
        <div className='form-group m-form__group'>
          <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
            <label style={{fontWeight: 'normal'}}>Button text:</label>
              <input type="text" className="form-control m-input"
                style={{marginLeft: '82px', width: '60%', marginTop: '-7px'}}
                onChange={(e) => this.handleInput(e, 'btnText')}
                value={this.props.textMessage.btnText} />
            </div>
          </div>
          <div className='form-group m-form__group'>
            <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
              <label style={{fontWeight: 'normal'}}>Message:</label>
                <textarea type="text" className="form-control m-input"
                  style={{marginLeft: '94px', width: '60%', marginTop: '-7px'}}
                  onChange={(e) => this.handleInput(e, 'message')}
                  value={this.props.textMessage.message} />
              </div>
            </div>
            {this.props.showCheckbox &&
              <div className='form-group m-form__group' style={{paddingLeft: '15px'}}>
              <label className="m-checkbox" style={{fontWeight: '300'}}>
                <input
                  type="checkbox"
                  onChange={this.handleCheckbox}
                  checked={this.props.textMessage.includePageURL} />
                Include current page URL in the message
                <span></span>
              </label>
            </div>
          }
        </div>
        <div className='col-md-3' style={{marginTop: '150px'}}>
          <button className="btn btn-success m-btn m-btn--icon btn-lg"
            style={this.getButtonStyle()}>
            <span>
              <i className="la la-whatsapp" style={{fontSize: '30px', color: this.props.btnDesign.iconColor}}></i>
              <span style={{color: this.props.btnDesign.btnTextColor}}>
                {this.props.textMessage.btnText}
              </span>
            </span>
          </button>
        </div>
      </div>
    )
  }
}

ButtonDesignAndText.propTypes = {
  'btnDesign': PropTypes.object.isRequired,
  'textMessage': PropTypes.object.isRequired,
  'updateState': PropTypes.func.isRequired,
  'btnLabel': PropTypes.string.isRequired,
  'btnMessageLabel': PropTypes.string.isRequired,
}

export default ButtonDesignAndText
