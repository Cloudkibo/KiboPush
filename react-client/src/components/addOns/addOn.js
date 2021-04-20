import React from 'react'
import PropTypes from 'prop-types'

class AddOn extends React.Component {
  render () {
    return (
      <div className="m-pricing-table-1__item col-lg-4">
        <div style={{marginTop: '50px'}} className="m-pricing-table-1__visual">
          <span className="m-pricing-table-1__icon m--font-brand">
            <i className={this.props.iconClass}></i>
          </span>
        </div>
        <span style={{marginTop: '125px', fontSize: '42px'}} className="m-pricing-table-1__price">
          {this.props.price}
          <span className="m-pricing-table-1__label">
            {this.props.currency}
          </span>
        </span>
        <h2 className="m-pricing-table-1__subtitle">
          {this.props.title}
        </h2>
        <span className="m-pricing-table-1__description">
          {this.props.description}
        </span>
        <div className="m-pricing-table-1__btn">
          <button onClick={this.props.onPurchase} type="button" className="btn btn-brand m-btn m-btn--custom m-btn--pill m-btn--wide m-btn--uppercase m-btn--bolder m-btn--sm">
            Purchase
          </button>
        </div>
      </div>
    )
  }
}

AddOn.propTypes = {
  'iconClass': PropTypes.string.isRequired,
  'price': PropTypes.string.isRequired,
  'currency': PropTypes.string.isRequired,
  'title': PropTypes.string.isRequired,
  'description': PropTypes.string.isRequired,
  'onPurchase': PropTypes.func.isRequired
}

export default AddOn
