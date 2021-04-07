import React from "react"
import PropTypes from 'prop-types'

class Template extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleSwitch = this.handleSwitch.bind(this)
  }

  handleSwitch (e) {
    this.props.updateState({enabled: e.target.checked}, this.props.id)
  }

  render () {
    return (
      <div key={this.props.id} className='accordion' id={`accordion${this.props.id}`}>
        <div className='card'>
          <div className='card-header' id={`heading${this.props.id}`}>
            <h4 className='mb-0'>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                data-target={`#collapse_${this.props.id}`}
                aria-expanded='true'
                aria-controls={`#collapse_${this.props.id}`}
              >
                {this.props.heading}
              </div>
            </h4>
          </div>
          <div id={`collapse_${this.props.id}`} aria-labelledby={`heading${this.props.id}`} data-parent="#accordion">
            <div className='card-body'>
              <form>
                <div className='form-group m-form__group col-lg-12'>
                  <div className='row'>
                    <div className='col-md-2'>
                  <label style={{fontWeight: 'normal'}}>Template Status:</label>
                  </div>
                  <div className='col-md-4' style={{display: 'flex'}}>
                    <div style = {{width: '70px'}}>
                      <label>{this.props.enabled ? 'Enabled' : 'Disabled'}</label>
                    </div>
                    <span
                      style={{marginTop: '-5px'}}
                      className={"m-switch m-switch--icon " + (this.props.enabled ? "m-switch--success" : "m-switch--danger")}>
                      <label>
                        <input checked={this.props.enabled} onChange={this.handleSwitch} type="checkbox" />
                        <span />
                      </label>
                    </span>
                  </div>
                  </div>
                </div>
                <div className='form-group m-form__group col-lg-12'>
                  <label style={{fontWeight: 'normal'}}>Template Message:</label>
                  <textarea
                    style={{direction: this.props.language !== 'english' ? 'rtl' : 'inherit', resize: 'none'}}
                    readOnly rows='6' value={this.props.text} className='form-control m-input m-input--solid' />
                </div>
                <div className='form-group m-form__group col-lg-12'>
                  <a href={this.props.previewUrl} target='_blank' rel='noopener noreferrer' className='m-btn--icon'>
                    <span>
                      <i className="fa fa-external-link"></i>
											<span>
												Preview
											</span>
										</span>
                  </a>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Template.propTypes = {
  'previewUrl': PropTypes.string.isRequired,
  'enabled': PropTypes.bool.isRequired,
  'text': PropTypes.string.isRequired,
  'id': PropTypes.string.isRequired,
  'heading': PropTypes.string.isRequired,
  'updateState': PropTypes.func.isRequired,
  'language': PropTypes.string.isRequired
}

export default Template
