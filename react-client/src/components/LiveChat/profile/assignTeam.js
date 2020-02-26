import React from 'react'
import PropTypes from 'prop-types'
import ProfileAction from './profileAction'

class AssignTeam extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedCustomer: '',
      customers: []
    }
    this.mapCustomerId = this.mapCustomerId.bind(this)
    this.attachCustomer = this.attachCustomer.bind(this)
    this.props.getCustomers()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.customers) {
      let temp = []
      for (let i = 0; i < nextProps.customers.length; i++) {
        temp.push({label: `${nextProps.customers[i].firstName} ${nextProps.customers[i].lastName}`, value: nextProps.customers[i]._id})
      }
      this.setState({customers: temp})
    }
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
        <ProfileAction 
            title='Attach Customer ID'
            options={this.state.customers}
            currentSelected={this.state.selectedCustomer}
            selectPlaceholder='Select a customer...'
            performAction={this.attachCustomer}
            onSelectChange={this.mapCustomerId}
            actionTitle='Attach'
            iconClass='flaticon-user-add'
        />
    )
  }
}

AssignTeam.propTypes = {
    'customers': PropTypes.array.isRequired,
    'getCustomers': PropTypes.func.isRequired,
    'appendSubscriber': PropTypes.func.isRequired
  }
  
  export default AssignTeam