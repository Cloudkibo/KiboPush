import React from "react"
import PropTypes from 'prop-types'

class ButtonDisplayAndPosition extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleDisplay = this.handleDisplay.bind(this)
    this.handlePosition = this.handlePosition.bind(this)
  }

  handleDisplay (e) {
    let displayPosition = this.props.displayPosition
    displayPosition.display = e.target.value
    this.props.updateState({displayPosition})
  }

  handlePosition (e, value) {
    let displayPosition = this.props.displayPosition
    displayPosition[value] = e.target.value
    this.props.updateState({displayPosition})
  }

  render () {
    return (
      <div>
        <div className='form-group m-form__group'>
          <span style={{fontWeight: 'bold'}}>Button Display and Position:</span>
        </div>
        <div className='form-group m-form__group'>
          <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
            <label style={{fontWeight: 'normal'}}>Button display:</label>
            <div className="m-radio-inline" style={{marginLeft: '106px', marginTop: '-1px'}}>
              <label className="m-radio" style={{fontWeight: 'lighter'}}>
                <input
                  type='radio'
                  value='both'
                  onChange={this.handleDisplay}
                  onClick={this.handleDisplay}
                  checked={this.props.displayPosition.display === 'both'}
                />
              Mobile + Desktop
                <span></span>
              </label>
              <label className="m-radio" style={{fontWeight: 'lighter'}}>
                <input
                  type='radio'
                  value='mobile'
                  onChange={this.handleDisplay}
                  onClick={this.handleDisplay}
                  checked={this.props.displayPosition.display === 'mobile'}
                 />
               Mobile only
                <span></span>
              </label>
              <label className="m-radio" style={{fontWeight: 'lighter'}}>
                <input
                  type='radio'
                  value='desktop'
                  onChange={this.handleDisplay}
                  onClick={this.handleDisplay}
                  checked={this.props.displayPosition.display === 'desktop'}
                 />
               Desktop only
                <span></span>
              </label>
            </div>
          </div>
        </div>
        {this.props.displayPosition.display !== 'desktop' &&
        <div className='form-group m-form__group'>
          <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
            <label style={{fontWeight: 'normal'}}>Button position (Mobile):</label>
            <div className="m-radio-inline" style={{marginLeft: '39px', marginTop: '-1px'}}>
              <label className="m-radio" style={{fontWeight: 'lighter'}}>
                <input
                  type='radio'
                  value='right'
                  onChange={(e) => this.handlePosition(e, 'mobilePosition')}
                  onClick={(e) => this.handlePosition(e, 'mobilePosition')}
                  checked={this.props.displayPosition.mobilePosition === 'right'}
                />
                Right
                <span></span>
              </label>
              <label className="m-radio" style={{fontWeight: 'lighter'}}>
                <input
                  type='radio'
                  value='left'
                  onChange={(e) => this.handlePosition(e, 'mobilePosition')}
                  onClick={(e) => this.handlePosition(e, 'mobilePosition')}
                  checked={this.props.displayPosition.mobilePosition === 'left'}
                 />
               Left
                <span></span>
              </label>
            </div>
          </div>
        </div>
        }
        {this.props.displayPosition.display !== 'mobile' &&
        <div className='form-group m-form__group'>
          <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
            <label style={{fontWeight: 'normal'}}>Button position (Desktop):</label>
            <div className="m-radio-inline" style={{marginLeft: '29px', marginTop: '-1px'}}>
              <label className="m-radio" style={{fontWeight: 'lighter'}}>
                <input
                  type='radio'
                  value='right'
                  onChange={(e) => this.handlePosition(e, 'desktopPosition')}
                  onClick={(e) => this.handlePosition(e, 'desktopPosition')}
                  checked={this.props.displayPosition.desktopPosition === 'right'}
                />
                Right
                <span></span>
              </label>
              <label className="m-radio" style={{fontWeight: 'lighter'}}>
                <input
                  type='radio'
                  value='left'
                  onChange={(e) => this.handlePosition(e, 'desktopPosition')}
                  onClick={(e) => this.handlePosition(e, 'desktopPosition')}
                  checked={this.props.displayPosition.desktopPosition === 'left'}
                 />
               Left
                <span></span>
              </label>
            </div>
          </div>
        </div>
      }
      </div>
    )
  }
}

ButtonDisplayAndPosition.propTypes = {
  'displayPosition': PropTypes.object.isRequired,
  'updateState': PropTypes.func.isRequired,
}

export default ButtonDisplayAndPosition
