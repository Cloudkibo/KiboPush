import React from 'react'
import PropTypes from 'prop-types'
import IconStack from '../../../components/Dashboard/IconStack'

class AbandonedCart extends React.Component {
  UNSAFE_componentWillMount () {
  }

  render () {
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>
                  Abandoned Cart Analytics
                </h3>
              </div>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='row'>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-shopping-cart'
                  title={this.props.cartsRecovered}
                  subtitle='Carts Recovered'
                  iconStyle='success'
                  id='cartsRecovered'
                />
              </div>
              <div className='col-md-4'>
                <IconStack
                  icon='flaticon-diagram'
                  title={this.props.recoveryRate}
                  subtitle='Abandoned Cart Recovery Rate'
                  iconStyle='brand'
                  id='recoveryRate'
                />
              </div>
              <div className='col-md-4'>
                <IconStack
                  icon='flaticon-coins'
                  title={this.props.orderValueRecovered}
                  subtitle='Order Value Recovered'
                  iconStyle='primary'
                  id='orderValueRecovered'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AbandonedCart.propTypes = {
  'cartsRecovered': PropTypes.number.isRequired,
  'recoveryRate': PropTypes.number.isRequired,
  'orderValueRecovered': PropTypes.number.isRequired
}

export default AbandonedCart
