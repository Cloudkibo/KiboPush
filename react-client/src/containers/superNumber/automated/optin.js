import React from "react"
import PropTypes from 'prop-types'

class Optin extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleLanguage = this.handleLanguage.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  handleLanguage (e) {
    let optinWidget = JSON.parse(JSON.stringify(this.props.optinWidget))
    optinWidget.language = e.target.value
    this.props.updateState({optin_widget: optinWidget})
  }

  handleSwitch (e) {
    let optinWidget = JSON.parse(JSON.stringify(this.props.optinWidget))
    optinWidget.enabled = e.target.checked
    this.props.updateState({optin_widget: optinWidget})
  }

  handleCheckbox (e, type) {
    let optinWidget = JSON.parse(JSON.stringify(this.props.optinWidget))
    optinWidget.settings[type] = e.target.checked
    this.props.updateState({optin_widget: optinWidget})
  }

  render () {
    return (
      <div key='optin' className='accordion' id='accordionWhatsAppConfiguraion'>
        <div className='card'>
          <div className='card-header' id='headingWhatsAppConfiguration'>
            <h4 className='mb-0'>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                data-target='#collapse_whatsAppConfiguraion'
                aria-expanded='true'
                aria-controls='#collapse_whatsAppConfiguraion'
              >
                Collect WhatsApp opt-in from Storefront widget
              </div>
            </h4>
          </div>
          <div id='collapse_whatsAppConfiguraion' aria-labelledby='headingWhatsAppConfiguration' data-parent="#accordion">
            <div className='card-body'>
              <form>
                <div className='form-group m-form__group col-lg-12'>
                  <div className='row'>
                    <div className='col-md-4'>
                  <label style={{fontWeight: 'normal'}}>Storefront Opt-in Widget Status:</label>
                  </div>
                  <div className='col-md-8' style={{display: 'flex'}}>
                    <div style = {{width: '70px'}}>
                      <label>{this.props.optinWidget.enabled ? 'Enabled' : 'Disabled'}</label>
                    </div>
                    <span
                      style={{marginTop: '-7px'}}
                      className={"m-switch m-switch--icon " + (this.props.optinWidget.enabled ? "m-switch--success" : "m-switch--danger")}>
                      <label>
                        <input checked={this.props.optinWidget.enabled} onChange={this.handleSwitch} type="checkbox" />
                        <span />
                      </label>
                    </span>
                  </div>
                  </div>
                </div>
                <div className='form-group m-form__group col-lg-12'>
                  <label style={{fontWeight: 'normal'}}>Storefront Opt-in Widget Language:</label>
                    <div className="row m-radio-inline" style={{marginTop: '5px'}}>
                      <div className='col-md-4'>
                      <label className="m-radio" style={{fontWeight: 'lighter'}}>
                        <input
                          type='radio'
                          value='english'
                          onChange={this.handleLanguage}
                          onClick={this.handleLanguage}
                          checked={this.props.optinWidget.language === 'english'}
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
                          checked={this.props.optinWidget.language === 'urdu'}
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
                          checked={this.props.optinWidget.language === 'arabic'}
                         />
                          Arabic
                        <span></span>
                      </label>
                    </div>
                    </div>
                </div>
                <div className='form-group m-form__group col-lg-12'>
                  <label style={{fontWeight: 'normal', marginBottom: '10px'}}>When to display Storefront Opt-in Widget:</label>
                  <div>
                    <label className="m-checkbox" style={{fontWeight: '300'}}>
                      <input
                        type="checkbox"
                        onChange={(e) => this.handleCheckbox(e, 'addToCartClicked')}
                        checked={this.props.optinWidget.settings.addToCartClicked} />
                        Clicking "Add to Cart" button in Product page
                      <span></span>
                    </label>
                  </div>
                  <div>
                    <label className="m-checkbox" style={{fontWeight: '300'}}>
                      <input
                        type="checkbox"
                        onChange={(e) => this.handleCheckbox(e, 'buyNowClicked')}
                        checked={this.props.optinWidget.settings.buyNowClicked} />
                      Clicking “Buy Now" button in Product page
                      <span></span>
                    </label>
                  </div>
                  <div>
                    <label className="m-checkbox" style={{fontWeight: '300'}}>
                      <input
                        type="checkbox"
                        onChange={(e) => this.handleCheckbox(e, 'landingOnCartPage')}
                        checked={this.props.optinWidget.settings.landingOnCartPage} />
                      Landing on Cart page
                      <span></span>
                    </label>
                  </div>
                  <div>
                    <label className="m-checkbox" style={{fontWeight: '300'}}>
                      <input
                        type="checkbox"
                        onChange={(e) => this.handleCheckbox(e, 'checkoutClicked')}
                        checked={this.props.optinWidget.settings.checkoutClicked} />
                      Clicking "Checkout" button in Cart page
                      <span></span>
                    </label>
                  </div>
                  {this.props.showThankyou &&
                    <div>
                      <label className="m-checkbox" style={{fontWeight: '300'}}>
                        <input
                          disabled
                          type="checkbox"
                          checked={this.props.optinWidget.settings.thankYouPage} />
                        On "Thank You" page after order is placed
                        <span></span>
                      </label>
                    </div>
                  }
                </div>
                <div className='form-group m-form__group col-lg-12'>
                  <a href='https://kibopush.com' target='_blank' rel='noopener noreferrer' className='m-btn--icon'>
                    <span>
                      <i className="fa fa-external-link"></i>
    									<span>
    										Preview storefront opt-in widget
    									</span>
    								</span>
                  </a>
              </div>
              {this.props.showThankyou &&
                <div className='form-group m-form__group col-lg-12'>
                  <a href='https://kibopush.com' target='_blank' rel='noopener noreferrer' className='m-btn--icon'>
                    <span>
                      <i className="fa fa-external-link"></i>
                      <span>
                        Preview thank you page widget
                      </span>
                    </span>
                  </a>
                </div>
              }
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Optin.propTypes = {
  'optinWidget': PropTypes.object.isRequired,
  'updateState': PropTypes.func.isRequired,
  'showThankyou': PropTypes.bool
}

export default Optin
