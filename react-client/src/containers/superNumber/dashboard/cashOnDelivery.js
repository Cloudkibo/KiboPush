import React from 'react'
import PropTypes from 'prop-types'
import IconStack from '../../../components/Dashboard/IconStack'

class CashOnDelivery extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>
                  COD Confirmation Message Analytics 
                </h3>
              </div>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='row'>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-shopping-cart'
                  title={this.props.ordersPlaced}
                  subtitle='COD orders placed'
                  iconStyle='primary'
                  id='ordersPlaced'
                />
              </div>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-check-square-o'
                  title={this.props.ordersConfirmed}
                  subtitle='Order Confirmed'
                  iconStyle='success'
                  id='ordersConfirmed'
                />
              </div>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-times-circle'
                  title={this.props.ordersCancelled}
                  subtitle='Orders Cancelled'
                  iconStyle='brand'
                  id='ordersCancelled'
                />
              </div>
            </div>
            <div className='m--space-30'></div>
            <div className='row'>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-question-circle'
                  title={this.props.noResponse}
                  subtitle='No Response'
                  iconStyle='warning'
                  id='noResponse'
                />
              </div>
              <div className='col-md-4'>
                <IconStack
                  icon='fa fa-envelope-o'
                  title={this.props.messagesSent}
                  subtitle='Messages sent - WhatsApp'
                  iconStyle='accent'
                  id='messagesSent'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CashOnDelivery.propTypes = {
  'ordersPlaced': PropTypes.number.isRequired,
  'ordersConfirmed': PropTypes.number.isRequired,
  'ordersCancelled': PropTypes.number.isRequired,
  'noResponse': PropTypes.number.isRequired,
  'messagesSent': PropTypes.number.isRequired,
}

export default CashOnDelivery
