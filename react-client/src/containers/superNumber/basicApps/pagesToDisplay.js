import React from "react"
import PropTypes from 'prop-types'

class PagesToDisplay extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  handleCheckbox (e, type) {
    let displayPages = JSON.parse(JSON.stringify(this.props.displayPages))
    displayPages[type] = e.target.checked
    this.props.updateState({displayPages})
  }

  render () {
    return (
      <div>
        <div className='form-group m-form__group'>
          <span style={{fontWeight: 'bold'}}>Pages to Display:</span>
        </div>
        <div className='form-group m-form__group'>
          <div className='form-group m-form__group' style={{paddingLeft: '12px'}}>
            <label style={{fontWeight: 'normal'}}>Select the pages on which you want to display the WhatsApp Share button:</label>
              <div>
                <label className="m-checkbox" style={{fontWeight: '300'}}>
                  <input
                    type="checkbox"
                    onChange={(e) => this.handleCheckbox(e, 'homePage')}
                    checked={this.props.displayPages.homePage} />
                  Home page
                  <span></span>
                </label>
              </div>
              <div>
                <label className="m-checkbox" style={{fontWeight: '300'}}>
                  <input
                    type="checkbox"
                    onChange={(e) => this.handleCheckbox(e, 'collectionsPage')}
                    checked={this.props.displayPages.collectionsPage} />
                  Collections
                  <span></span>
                </label>
              </div>
              <div>
                <label className="m-checkbox" style={{fontWeight: '300'}}>
                  <input
                    type="checkbox"
                    onChange={(e) => this.handleCheckbox(e, 'productPages')}
                    checked={this.props.displayPages.productPages} />
                  Product pages
                  <span></span>
                </label>
              </div>
              {this.props.showCart &&
                <div>
                  <label className="m-checkbox" style={{fontWeight: '300'}}>
                    <input
                      type="checkbox"
                      onChange={(e) => this.handleCheckbox(e, 'cartPage')}
                      checked={this.props.displayPages.cartPage} />
                    Cart
                    <span></span>
                  </label>
                </div>
              }
              {this.props.showCartDesktop &&
                <div>
                  <label className="m-checkbox" style={{fontWeight: '300'}}>
                    <input
                      type="checkbox"
                      onChange={(e) => this.handleCheckbox(e, 'cartPageDesktop')}
                      checked={this.props.displayPages.cartPageDesktop} />
                    Cart (Desktop)
                    <span></span>
                  </label>
                </div>
              }
              {this.props.showCartMobile &&
                <div>
                  <label className="m-checkbox" style={{fontWeight: '300'}}>
                    <input
                      type="checkbox"
                      onChange={(e) => this.handleCheckbox(e, 'cartPageMobile')}
                      checked={this.props.displayPages.cartPageMobile} />
                    Cart (Mobile)
                    <span></span>
                  </label>
                </div>
              }
              <div>
                <label className="m-checkbox" style={{fontWeight: '300'}}>
                  <input
                    type="checkbox"
                    onChange={(e) => this.handleCheckbox(e, 'thankyouPage')}
                    checked={this.props.displayPages.thankyouPage} />
                  Thank You page
                  <span></span>
                </label>
              </div>
              <div>
                <label className="m-checkbox" style={{fontWeight: '300'}}>
                  <input
                    type="checkbox"
                    onChange={(e) => this.handleCheckbox(e, 'blogPostPages')}
                    checked={this.props.displayPages.blogPostPages} />
                  Blog post pages
                  <span></span>
                </label>
              </div>
              <div>
                <label className="m-checkbox" style={{fontWeight: '300'}}>
                  <input
                    type="checkbox"
                    onChange={(e) => this.handleCheckbox(e, 'urlsEndinginPages')}
                    checked={this.props.displayPages.urlsEndinginPages} />
                  URLs ending with /pages
                  <span></span>
                </label>
              </div>
              <div>
                <label className="m-checkbox" style={{fontWeight: '300'}}>
                  <input
                    type="checkbox"
                    onChange={(e) => this.handleCheckbox(e, 'accountPages')}
                    checked={this.props.displayPages.accountPages} />
                  Account pages
                  <span></span>
                </label>
              </div>
              <div style={{marginTop: '10px'}}>
                <span>By default, WhatsApp Share button will show on all other pages that aren’t listed above</span>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

PagesToDisplay.propTypes = {
  'displayPages': PropTypes.object.isRequired,
  'updateState': PropTypes.func.isRequired,
}

export default PagesToDisplay
