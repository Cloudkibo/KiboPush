import React from "react"
import PropTypes from 'prop-types'
import ColorPicker from '../../../components/Popover/colorPicker'
import ReactTooltip from 'react-tooltip'

class GreetingsWidget extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showBackgroundColor1Picker: false,
      showBackgroundColor2Picker: false,
      showHeadingColorPicker: false,
      showDescriptionColorPicker: false
    }
    this.showColorPicker = this.showColorPicker.bind(this)
    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleBackgroundColorStyle = this.handleBackgroundColorStyle.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.getHeadStyle = this.getHeadStyle.bind(this)
  }

  handleCheckbox (e) {
    let greetingsWidget = JSON.parse(JSON.stringify(this.props.greetingsWidget))
    greetingsWidget.randomAgentsOrder = e.target.checked
    this.props.updateState({greetingsWidget})
  }

  handleInput (e, value) {
    let greetingsWidget = JSON.parse(JSON.stringify(this.props.greetingsWidget))
    if (value === 'titleText' && e.target.value.length <= 12) {
      greetingsWidget.titleText = e.target.value
    } else if (value === 'helpText' && e.target.value.length <= 90){
      greetingsWidget.helpText = e.target.value
    } else if (value === 'offlineAgentMsg' && e.target.value.length <= 200){
      greetingsWidget.offlineAgentMsg = e.target.value
    } else if (value === 'offlineStoreMsg' && e.target.value.length <= 200){
      greetingsWidget.offlineStoreMsg = e.target.value
    }
    this.props.updateState({greetingsWidget})
  }

  handleColorChange (color, value) {
    let greetingsWidget = JSON.parse(JSON.stringify(this.props.greetingsWidget))
    if (value === 'greetingBackgroundColor1') {
      greetingsWidget.backgroundColor1 = color.hex
    } else if (value === 'greetingBackgroundColor2') {
      greetingsWidget.backgroundColor2 = color.hex
    } else if (value === 'headingColor') {
      greetingsWidget.headingColor = color.hex
    } else if (value === 'descriptionColor') {
      greetingsWidget.descriptionColor = color.hex
    }
    this.props.updateState({greetingsWidget})
  }

  toggleColorPicker (value) {
    if (value === 'greetingBackgroundColor1') {
      this.setState({showBackgroundColor1Picker: !this.state.showBackgroundColor1Picker})
    } else if (value === 'greetingBackgroundColor2') {
      this.setState({showBackgroundColor2Picker: !this.state.showBackgroundColor2Picker})
    } else if (value === 'headingColor') {
      this.setState({showHeadingColorPicker: !this.state.showHeadingColorPicker})
    } else if (value === 'descriptionColor') {
      this.setState({showDescriptionColorPicker: !this.state.showDescriptionColorPicker})
    }
  }

  showColorPicker (value) {
    if (value === 'greetingBackgroundColor1') {
      this.setState({
        showBackgroundColor1Picker: true,
        showBackgroundColor2Picker: false,
        showHeadingColorPicker: false,
        showDescriptionColorPicker: false
      })
    } else if (value === 'greetingBackgroundColor2') {
      this.setState({
        showBackgroundColor2Picker: true,
        showBackgroundColor1Picker: false,
        showHeadingColorPicker: false,
        showDescriptionColorPicker: false
      })
    } else if (value === 'headingColor') {
      this.setState({
        showHeadingColorPicker: true,
        showDescriptionColorPicker: false,
        showBackgroundColor1Picker: false,
        showBackgroundColor2Picker: false
      })
    } else if (value === 'descriptionColor') {
      this.setState({
        showDescriptionColorPicker: true,
        showHeadingColorPicker: false,
        showBackgroundColor1Picker: false,
        showBackgroundColor2Picker: false
      })
    }
  }

  handleBackgroundColorStyle (e) {
    let greetingsWidget = JSON.parse(JSON.stringify(this.props.greetingsWidget))
    greetingsWidget.backgroundColorStyle = e.target.value
    this.props.updateState({greetingsWidget})
  }

  getHeadStyle () {
    let headStyle = {height: 'auto', padding: '15px', borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}
    if (this.props.greetingsWidget.backgroundColorStyle === 'single') {
      headStyle.backgroundColor = this.props.greetingsWidget.backgroundColor1
    } else {
      headStyle.backgroundImage = `linear-gradient(90deg, ${this.props.greetingsWidget.backgroundColor1} 0%, ${this.props.greetingsWidget.backgroundColor2} 100%)`
    }
    return headStyle
  }

  render () {
    return (
      <div className='accordion'>
        <ColorPicker
          isOpen={this.state.showBackgroundColor2Picker}
          target='greetingBackgroundColor2'
          title='greetingBackgroundColor2'
          toggle={this.toggleColorPicker}
          color={this.props.greetingsWidget.backgroundColor2}
          onChangeComplete={this.handleColorChange}
        />
        <ColorPicker
          isOpen={this.state.showHeadingColorPicker}
          target='headingColor'
          title='headingColor'
          toggle={this.toggleColorPicker}
          color={this.props.greetingsWidget.headingColor}
          onChangeComplete={this.handleColorChange}
        />
        <ColorPicker
          isOpen={this.state.showDescriptionColorPicker}
          target='descriptionColor'
          title='descriptionColor'
          toggle={this.toggleColorPicker}
          color={this.props.greetingsWidget.descriptionColor}
          onChangeComplete={this.handleColorChange}
        />
        <ColorPicker
          isOpen={this.state.showBackgroundColor1Picker}
          target='greetingBackgroundColor1'
          title='greetingBackgroundColor1'
          toggle={this.toggleColorPicker}
          color={this.props.greetingsWidget.backgroundColor1}
          onChangeComplete={this.handleColorChange}
        />
        <div className='card'>
          <div className='card-header'>
            <h4 className='mb-0'>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                aria-expanded='true'>
                Greetings Widget
              </div>
            </h4>
          </div>
          <div data-parent="#accordion">
            <div className='card-body'>
              <div className='row'>
                <div className='col-md-8'>
                  <div className='form-group m-form__group'>
                    <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                      <label style={{fontWeight: 'normal'}}>Background style:</label>
                      <div className="m-radio-inline" style={{marginLeft: '58px', marginTop: '-1px'}}>
                        <label className="m-radio" style={{fontWeight: 'lighter'}}>
                          <input
                            type='radio'
                            value='single'
                            onChange={this.handleBackgroundColorStyle}
                            onClick={this.handleBackgroundColorStyle}
                            checked={this.props.greetingsWidget.backgroundColorStyle === 'single'}
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
                            checked={this.props.greetingsWidget.backgroundColorStyle === 'gradient'}
                           />
                          Gradient of two Colors
                        <span></span>
                      </label>
                    </div>
                  </div>
                  <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                    <label style={{fontWeight: 'normal'}}>Background color 1:</label>
                      <div className="input-group m-input-group" id='greetingBackgroundColor1'
                        style={{marginLeft: '49px', width: '30%', marginTop: '-7px'}} onClick={() => this.showColorPicker('greetingBackgroundColor1')}>
              					<span className="input-group-addon" id="basic-addon1"
                          style={{backgroundColor: this.props.greetingsWidget.backgroundColor1, width: '40px'}}></span>
          					    <input type="text" className="form-control m-input" aria-describedby="basic-addon1"
                          value={this.props.greetingsWidget.backgroundColor1} />
            				    </div>
                      </div>
                      <div className='form-group m-form__group row'
                        style={{paddingLeft: '30px', display: this.props.greetingsWidget.backgroundColorStyle === 'gradient' ? 'flex': 'none'}}>
                        <label style={{fontWeight: 'normal'}}>Background color 2:</label>
                          <div className="input-group m-input-group" id='greetingBackgroundColor2'
                            style={{marginLeft: '44px', width: '30%', marginTop: '-7px'}} onClick={() => this.showColorPicker('greetingBackgroundColor2')}>
                  					<span className="input-group-addon" id="basic-addon1"
                              style={{backgroundColor: this.props.greetingsWidget.backgroundColor2, width: '40px'}}></span>
              					    <input type="text" className="form-control m-input" aria-describedby="basic-addon1"
                              value={this.props.greetingsWidget.backgroundColor2 } />
          		            </div>
                      </div>
                      <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                        <label style={{fontWeight: 'normal'}}>Heading text color:</label>
                          <div className="input-group m-input-group" id='headingColor'
                            style={{marginLeft: '53px', width: '30%', marginTop: '-7px'}} onClick={() => this.showColorPicker('headingColor')}>
                  					<span className="input-group-addon" id="basic-addon1"
                              style={{backgroundColor: this.props.greetingsWidget.headingColor, width: '40px'}}></span>
              					    <input type="text" className="form-control m-input" aria-describedby="basic-addon1"
                              value={this.props.greetingsWidget.headingColor } />
          		            </div>
                      </div>
                      <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                        <label style={{fontWeight: 'normal'}}>Description text color:</label>
                          <div className="input-group m-input-group" id='descriptionColor'
                            style={{marginLeft: '34px', width: '30%', marginTop: '-7px'}} onClick={() => this.showColorPicker('descriptionColor')}>
                  					<span className="input-group-addon" id="basic-addon1"
                              style={{backgroundColor: this.props.greetingsWidget.descriptionColor, width: '40px'}}></span>
              					    <input type="text" className="form-control m-input" aria-describedby="basic-addon1"
                              value={this.props.greetingsWidget.descriptionColor } />
          		            </div>
                      </div>
                  </div>
                <div className='form-group m-form__group'>
                  <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                    <label style={{fontWeight: 'normal'}}>Title text:</label>
                      <input type="text" className="form-control m-input"
                        style={{marginLeft: '122px', width: '60%', marginTop: '-7px'}}
                        onChange={(e) => this.handleInput(e, 'titleText')}
                        value={this.props.greetingsWidget.titleText} />
                    </div>
                  </div>
                  <div className='form-group m-form__group'>
                    <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                      <label style={{fontWeight: 'normal'}}>Help text:</label>
                        <textarea type="text" className="form-control m-input" rows="3"
                          style={{marginLeft: '118px', width: '60%', marginTop: '-7px'}}
                          onChange={(e) => this.handleInput(e, 'helpText')}
                          value={this.props.greetingsWidget.helpText} />
                      </div>
                  </div>
                  <div className='form-group m-form__group'>
                    <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                      <label style={{fontWeight: 'normal'}}>Offline Agent message:</label>
                        <textarea type="text" className="form-control m-input" rows="3"
                          style={{marginLeft: '20px', width: '60%', marginTop: '-7px'}}
                          onChange={(e) => this.handleInput(e, 'offlineAgentMsg')}
                          value={this.props.greetingsWidget.offlineAgentMsg} />
                      </div>
                  </div>
                  <div className='form-group m-form__group'>
                    <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                      <label style={{fontWeight: 'normal'}}>Offline Store message:</label>
                        <textarea type="text" className="form-control m-input" rows="3"
                          style={{marginLeft: '24px', width: '60%', marginTop: '-7px'}}
                          onChange={(e) => this.handleInput(e, 'offlineStoreMsg')}
                          value={this.props.greetingsWidget.offlineStoreMsg} />
                      </div>
                  </div>
                  <ReactTooltip
                    id='random'
                    place='top'
                    type='info'
                    multiline={true}
                  />
                  <div className='form-group m-form__group' style={{paddingLeft: '15px'}} data-for='random'
                      data-tip='For multiple numbers, this ensures equal distribution of chats across all numbers'>
                    <label className="m-checkbox" style={{fontWeight: '300'}}>
                      <input
                        type="checkbox"
                        onChange={this.handleCheckbox}
                        checked={this.props.greetingsWidget.randomAgentsOrder} />
                        Randomise order of chat agents
                      <span></span>
                    </label>
                  </div>
                </div>
                <div className='col-md-4' style={{display: 'flex', verticalAlign: 'middle', alignItems: 'center'}}>
                  <div className='m-portlet m-portlet--mobile' style={{border: 'solid 1px white', borderRadius: '10px'}}>
                    <div className='m-portlet__head' style={this.getHeadStyle()}>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text' style={{color: this.props.greetingsWidget.headingColor}}>
                            {this.props.greetingsWidget.titleText}
                          </h3>
                        </div>
                        <br />
                        <h3 className='m-portlet__head-text' 
                          style={{fontSize: 'inherit', fontWeight: 'normal', color: this.props.greetingsWidget.descriptionColor}}>
                          {this.props.greetingsWidget.helpText}
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__body' style={{padding: '10px'}}>
                      {this.props.agents.length > 0
                        ? <div className='m-widget4' >
                          {
                            this.props.agents.map((agent, i) => (
                              <div className='m-widget4__item' style={{width: '100%'}} key={i}>
                                <div className='m-widget4__info'>
                                  <span className='m-widget4__title'>
                                    {agent.agentName}
                                  </span>
                                  <br />
                                  <span className='m-widget4__sub'>
                                  {agent.agentRole}
                                  </span>
                                </div>
                              </div>
                          ))}
                        </div>
                          : <div style={{padding: '10px'}}>{this.props.greetingsWidget.offlineAgentMsg}</div>
                      }
                    </div>
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

GreetingsWidget.propTypes = {
  'greetingsWidget': PropTypes.object.isRequired,
  'agents': PropTypes.array.isRequired,
  'updateState': PropTypes.func.isRequired
}

export default GreetingsWidget
