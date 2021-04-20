import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { fetchAddOns } from '../../redux/actions/addOns.actions'
import ADDON from '../../components/addOns/addOn'

class AddOns extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
                        iconClass={addOn.others.iconClass}
                        price={addOn.price}
                        currency={addOn.currency}
                        title={addOn.feature}
                        description={addOn.description}
                        onPurchase={() => {}}
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
    addOns: (state.addOnsInfo.addOns)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAddOns
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddOns)
