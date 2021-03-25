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
          {this.props.showOffsets &&
            <div className='form-group m-form__group'>
              <div className='form-group m-form__group' style={{paddingLeft: '30px'}}>
                <div className='row'>
                <label style={{fontWeight: 'normal'}}>Height Offset (Mobile):</label>
                <input className="form-control m-input" required
                  type='number' style={{width: '10%', marginTop: '-7px', marginLeft: '55px'}}
                  min='8' step='1'
                  onChange={(e) => this.handlePosition(e, 'mobileHeightOffset')}
                  value={this.props.displayPosition.mobileHeightOffset} />
                <span style={{marginLeft: '10px'}}>px</span>
                </div>
                <span style={{paddingLeft: '195px'}}>Change the height of chat button on mobile</span>
              </div>
              <div className='form-group m-form__group' style={{paddingLeft: '30px'}}>
                <div className='row'>
                <label style={{fontWeight: 'normal'}}>Edge Offset (Mobile):</label>
                <input className="form-control m-input" required
                  type='number' style={{width: '10%', marginTop: '-7px', marginLeft: '65px'}}
                  min='8' step='1'
                  onChange={(e) => this.handlePosition(e, 'mobileEdgeOffset')}
                  value={this.props.displayPosition.mobileEdgeOffset} />
                <span style={{marginLeft: '10px'}}>px</span>
                </div>
                <span style={{paddingLeft: '195px'}}>Change the distance of chat button from the edge of the screen on mobile</span>
              </div>
            </div>
          }
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
          {this.props.showOffsets &&
            <div className='form-group m-form__group'>
              <div className='form-group m-form__group' style={{paddingLeft: '30px'}}>
                <div className='row'>
                <label style={{fontWeight: 'normal'}}>Height Offset (Desktop):</label>
                <input className="form-control m-input" required
                  type='number' style={{width: '10%', marginTop: '-7px', marginLeft: '45px'}}
                  min='8' step='1'
                  onChange={(e) => this.handlePosition(e, 'desktopHeightOffset')}
                  value={this.props.displayPosition.desktopHeightOffset} />
                <span style={{marginLeft: '10px'}}>px</span>
                </div>
                <span style={{paddingLeft: '195px'}}>Change the height of chat button on desktop</span>
              </div>
              <div className='form-group m-form__group' style={{paddingLeft: '30px'}}>
                <div className='row'>
                <label style={{fontWeight: 'normal'}}>Edge Offset (Desktop):</label>
                <input className="form-control m-input" required
                  type='number' style={{width: '10%', marginTop: '-7px', marginLeft: '55px'}}
                  min='8' step='1'
                  onChange={(e) => this.handlePosition(e, 'desktopEdgeOffset')}
                  value={this.props.displayPosition.desktopEdgeOffset} />
                <span style={{marginLeft: '10px'}}>px</span>
                </div>
                <span style={{paddingLeft: '195px'}}>Change the distance of chat button from the edge of the screen on desktop</span>
              </div>
            </div>
          }
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
