import React from 'react'
import PropTypes from 'prop-types'

class AddOn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }

    this.onPurchase = this.onPurchase.bind(this)
    this.afterPurchase = this.afterPurchase.bind(this)
    this.getProps = this.getProps.bind(this)
  }

  onPurchase () {
    this.setState({loading: true})
    this.props.onPurchase(this.props.addOn, this.afterPurchase)
  }

  afterPurchase () {
    this.setState({loading: false})
  }

  getProps () {
    const purchasedAddOns = this.props.purchasedAddOns.map((item) => item.addOnId)
    let props = {
      iconClass: this.props.iconClass,
      style: 'brand',
      price: this.props.price,
      currency: this.props.currency,
      title: this.props.title,
      description: this.props.description
    }
    if (purchasedAddOns.includes(this.props.addOn._id)) {
      props = {
        ...props,
        iconClass: 'la la-check',
        style: 'success',
        purchased: true
      }
    }
    return props
  }

  render () {
    const props = this.getProps()
    return (
      <div className="m-pricing-table-1__item col-lg-4">
        <div style={{marginTop: '50px'}} className="m-pricing-table-1__visual">
          <span className={`m-pricing-table-1__icon m--font-${props.style}`}>
            <i className={props.iconClass}></i>
          </span>
        </div>
        <span style={{marginTop: '125px', fontSize: '42px'}} className="m-pricing-table-1__price">
          {props.price}
          <span className="m-pricing-table-1__label">
            {props.currency}
          </span>
        </span>
        <h2 className="m-pricing-table-1__subtitle">
          {props.title}
        </h2>
        <span className="m-pricing-table-1__description">
          {props.description}
        </span>
        <div className="m-pricing-table-1__btn">
          <button
            onClick={this.onPurchase}
            type="button"
            className={`btn btn-${props.style} m-btn m-btn--custom m-btn--pill m-btn--wide m-btn--uppercase m-btn--bolder m-btn--sm ${this.state.loading && 'm-loader m-loader--light m-loader--right'}`}
            disabled={props.purchased}
          >
            {props.purchased ? 'Purchased' : 'Purchase'}
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
