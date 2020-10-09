import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { fetchAddOns, purchaseAddOn } from '../../redux/actions/addOns.actions'
import ADDON from '../../components/addOns/addOn'

class AddOns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.onPurchase = this.onPurchase.bind(this)
    this.afterPurchase = this.afterPurchase.bind(this)

    props.fetchAddOns()
  }

  componentDidMount() {
    const hostname = window.location.hostname
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Add Ons`;
  }

  onPurchase (addOn, cb) {
    const automated_options = this.props.automated_options
    if (
      !automated_options.stripe ||
      (automated_options.stripe && (!automated_options.stripe.customerId || !automated_options.stripe.subscriptionId))
    ) {
      this.msg.error('Fata Error! Billing is not set for this account. Please contact support.')
    } else if (!automated_options.stripe.last4) {
      this.msg.error('Payment method is not set for this account. Please set the payment method from settings')
    } else {
      const purchasedAddOns = [...this.props.companyAddOns, {
        companyId: addOn.companyId,
        addOnId: addOn._id,
        permissions: addOn.permissions,
        datetime: new Date()
      }]
      this.props.purchaseAddOn(addOn._id, purchasedAddOns, (res) => this.afterPurchase(res, cb))
    }
  }

  afterPurchase (res, cb) {
    cb()
    if (res.status === 'success') {
      this.msg.success(res.description)
    } else {
      this.msg.error(res.description)
    }
  }

  render() {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
				<div className="m-subheader ">
          <div className="d-flex align-items-center">
            <div className="mr-auto">
              <h3 className="m-subheader__title">
                Add Ons
              </h3>
						</div>
					</div>
				</div>
				<div className="m-content">
          <div className="m-portlet">
            <div className="m-portlet__body">
              <div className="m-pricing-table-1">
                <div style={{padding: '0px'}} className="m-pricing-table-1__items row">
                  {
                    this.props.addOns && this.props.addOns.length > 0
                    ? this.props.addOns.map((addOn) => (
                      <ADDON
                        key={addOn._id}
                        addOn={addOn}
                        iconClass={addOn.others.iconClass}
                        price={addOn.price}
                        currency={addOn.currency}
                        title={addOn.feature}
                        description={addOn.description}
                        onPurchase={this.onPurchase}
                        purchasedAddOns={this.props.companyAddOns}
                      />
                    ))
                    : <p>No Add Ons Found. Please contact KiboPush support team at support@cloudkibo.com</p>
                  }
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
    )
  }
}

function mapStateToProps(state) {
  return {
    addOns: (state.addOnsInfo.addOns),
    companyAddOns: (state.addOnsInfo.companyAddOns),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAddOns,
    purchaseAddOn
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddOns)
