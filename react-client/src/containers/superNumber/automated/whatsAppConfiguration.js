import React from "react"
import PropTypes from 'prop-types'

class ActionsArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.expendRowToggle = this.expendRowToggle.bind(this)
    this.handleNumber = this.handleNumber.bind(this)
    this.handleLanguage = this.handleLanguage.bind(this)
  }

  expendRowToggle () {
    let className = document.getElementById(`icon-whatsAppConfiguration`).className
    if (className === 'la la-angle-up collapsed') {
      document.getElementById(`icon-whatsAppConfiguration`).className = 'la la-angle-down'
    } else {
      document.getElementById(`icon-whatsAppConfiguration`).className = 'la la-angle-up'
    }
  }

  handleLanguage (e) {
    this.props.updateState({language: e.target.value})
  }

  handleNumber (e) {
    this.props.updateState({supportNumber: e.target.value})
  }

  render () {
    return (
      <div key='whatsAppConfiguration' className='accordion' id='accordionWhatsAppConfiguraion'>
        <div className='card'>
          <div className='card-header' id='headingWhatsAppConfiguration'>
            <h4 className='mb-0' onClick={() => this.expendRowToggle()}>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                data-toggle='collapse'
                data-target='#collapse_whatsAppConfiguraion'
                aria-expanded='true'
                aria-controls='#collapse_whatsAppConfiguraion'
              >
                WhatsApp Configuration
              </div>
              <span style={{float: 'right', marginRight: '12px', marginTop: '5px'}}>
                <i
                  id='icon-whatsAppConfiguration'
                  style={{ fontSize: '20px', marginLeft: '30px', cursor: 'pointer' }}
                  className='la la-angle-down'
                  data-toggle='collapse'
                  data-target='#collapse_whatsAppConfiguraion'
                />
              </span>
            </h4>
          </div>
          <div id='collapse_whatsAppConfiguraion' className='collapse' aria-labelledby='headingWhatsAppConfiguration' data-parent="#accordion">
            <div className='card-body'>
              <form>
                <div className='form-group m-form__group col-lg-12'>
                  <label style={{fontWeight: 'normal'}}>Language:</label>
                    <div className="row m-radio-inline" style={{marginTop: '5px'}}>
                      <div className='col-md-4'>
                      <label className="m-radio" style={{fontWeight: 'lighter'}}>
                        <input
                          type='radio'
                          value='english'
                          onChange={this.handleLanguage}
                          onClick={this.handleLanguage}
                          checked={this.props.language === 'english'}
                        />
                          English
                        <span></span>
                      </label>
                    </div>
                    <div className='col-md-4'>
                      <label className="m-radio" style={{fontWeight: 'lighter'}}>
                        <input
                          type='radio'
                          value='urdu'
                          onChange={this.handleLanguage}
                          onClick={this.handleLanguage}
                          checked={this.props.language === 'urdu'}
                         />
                        Urdu
                        <span></span>
                      </label>
                    </div>
                      <div className='col-md-4'>
                      <label className="m-radio" style={{fontWeight: 'lighter'}}>
                        <input
                          type='radio'
                          value='arabic'
                          onChange={this.handleLanguage}
                          onClick={this.handleLanguage}
                          checked={this.props.language === 'arabic'}
                         />
                          Arabic
                        <span></span>
                      </label>
                    </div>
                    </div>
                </div>
                <div className="form-group m-form__group col-lg-8">
                <label style={{fontWeight: 'normal'}}>WhatsApp Support Number:</label>
                <input
                  style={{marginTop: '5px', width: '50%'}}
                  placeholder='Enter your WhatsApp support number here...'
                  value={this.props.supportNumber}
                  onChange={this.handleNumber}
                  className="form-control m-input" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ActionsArea.propTypes = {
  'language': PropTypes.string.isRequired,
  'supportNumber': PropTypes.string.isRequired,
  'updateState': PropTypes.func.isRequired

}

export default ActionsArea
