/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import { getCustomers, appendSubscriber } from '../../redux/actions/livechat.actions'

class MapCustomer extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      mappedCustomer: false,
      selectedCustomer: '',
      customers: []
    }
    this.toggleAttachCustomer = this.toggleAttachCustomer.bind(this)
    this.mapCustomerId = this.mapCustomerId.bind(this)
    this.attachCustomer = this.attachCustomer.bind(this)
  }

  componentWillMount () {
    this.props.getCustomers()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.customers) {
      let temp = []
      for (let i = 0; i < nextProps.customers.length; i++) {
        temp.push({label: `${nextProps.customers[i].firstName} ${nextProps.customers[i].lastName}`, value: nextProps.customers[i]._id})
      }
      this.setState({customers: temp})
    }
  }

  toggleAttachCustomer () {
    this.setState({mappedCustomer: !this.state.mappedCustomer})
  }

  mapCustomerId (value) {
    this.setState({selectedCustomer: value})
  }

  attachCustomer () {
    let data = {
      subscriberId: this.props.currentSession.subscriber_id._id,
      customerId: this.state.selectedCustomer.value
    }
    this.props.appendSubscriber(data, this.props.currentSession, this.props.msg)
  }

  render () {
    return (
      <div style={{marginTop: '20px'}} className='m-accordion m-accordion--default'>
        <div style={{overflow: 'visible'}} className='m-accordion__item'>
          {
            this.state.mappedCustomer
            ? <div className='m-accordion__item-head'>
              <span className='m-accordion__item-icon'>
                <i className='flaticon-user-add' />
              </span>
              <span className='m-accordion__item-title'>Attach Customer ID</span>
              <span style={{cursor: 'pointer'}} onClick={this.toggleAttachCustomer} className='m-accordion__item-icon'>
                <i className='la la-minus' />
              </span>
            </div>
            : <div className='m-accordion__item-head collapsed'>
              <span className='m-accordion__item-icon'>
                <i className='flaticon-user-add' />
              </span>
              <span className='m-accordion__item-title'>Attach Customer ID</span>
              <span style={{cursor: 'pointer'}} onClick={this.toggleAttachCustomer} className='m-accordion__item-icon'>
                <i className='la la-plus' />
              </span>
            </div>
          }
          {
            this.state.mappedCustomer &&
            <div className='m-accordion__item-body'>
              <div className='m-accordion__item-content'>
                <Select
                  options={this.state.customers}
                  onChange={this.mapCustomerId}
                  value={this.state.selectedCustomer}
                  placeholder='Select customer...'
                />
                <button style={{marginTop: '10px'}} className='btn btn-primary' onClick={this.attachCustomer}>Attach</button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('mapCustomer ', state)
  return {
    customers: (state.liveChat.customers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getCustomers,
    appendSubscriber
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MapCustomer)
