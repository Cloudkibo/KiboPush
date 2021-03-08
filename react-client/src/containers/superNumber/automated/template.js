import React from "react"
import PropTypes from 'prop-types'

class Template extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.expendRowToggle = this.expendRowToggle.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
  }

  expendRowToggle () {
    let className = document.getElementById(`icon-${this.props.id}`).className
    if (className === 'la la-angle-up collapsed') {
      document.getElementById(`icon-${this.props.id}`).className = 'la la-angle-down'
    } else {
      document.getElementById(`icon-${this.props.id}`).className = 'la la-angle-up'
    }
  }

  handleSwitch (e) {
    this.props.updateState({enabled: e.target.checked}, this.props.id)
  }

  render () {
    return (
      <div key={this.props.id} className='accordion' id={`accordion${this.props.id}`}>
        <div className='card'>
          <div className='card-header' id={`heading${this.props.id}`}>
            <h4 className='mb-0' onClick={() => this.expendRowToggle()}>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                data-toggle='collapse'
                data-target={`#collapse_${this.props.id}`}
                aria-expanded='true'
                aria-controls={`#collapse_${this.props.id}`}
              >
                {this.props.heading}
              </div>
              <span style={{float: 'right', marginRight: '12px', marginTop: '5px'}}>
                <i
                  id={`icon-${this.props.id}`}
                  style={{ fontSize: '20px', marginLeft: '30px', cursor: 'pointer' }}
                  className='la la-angle-down'
                  data-toggle='collapse'
                  data-target={`#collapse_${this.props.id}`}
                />
              </span>
            </h4>
          </div>
          <div id={`collapse_${this.props.id}`} className='collapse' aria-labelledby={`heading${this.props.id}`} data-parent="#accordion">
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
                    readonly rows='6' value={this.props.text} className='form-control m-input m-input--solid' />
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
