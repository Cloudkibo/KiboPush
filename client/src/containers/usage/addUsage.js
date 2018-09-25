/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { updateUsage, addUsage } from '../../redux/actions/usage.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'

class AddUsage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      name: props.name ? props.name : '',
      serverName: props.serverName ? props.serverName : '',
      limitValue: props.limitValue !== null ? parseInt(props.limitValue) : ''
    }
    this.updateName = this.updateName.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.goToCreate = this.goToCreate.bind(this)
    this.goToUpdate = this.goToUpdate.bind(this)
  }
  updateName (e) {
    this.setState({name: e.target.value})
  }
  updateValue (e) {
    console.log('e.target.value', e.target.value)
    this.setState({limitValue: parseInt(e.target.value)})
  }
  goToCreate () {
    if (this.state.name === '') {
      this.props.msg.error('Please enter name')
    } else if (this.state.value === '') {
      this.props.msg.error('Please enter value')
    } else {
      this.setState({value: '', name: ''})
      this.props.closeDialog()
      this.props.addUsage({planId: this.props.selectedPlan, item_name: this.state.name, item_value: this.state.limitValue}, this.props.msg)
    }
  }
  goToUpdate () {
    console.log('this.state.limitValue', this.state.limitValue)
    if (this.state.limitValue === '' || isNaN(this.state.limitValue)) {
      this.props.msg.error('Please enter value')
    } else {
      this.setState({limitValue: '', name: ''})
      this.props.closeDialog()
      this.props.updateUsage({planId: this.props.selectedPlan, item_name: this.state.serverName, item_value: this.state.limitValue}, this.props.msg)
    }
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <center><h3>Add Usage Item</h3></center>
        <br /><br />
        <div className='row'>
          <div className='col-md-7' style={{display: '-webkit-inline-box'}}>
            <label className='control-label' style={{marginTop: '5px', fontWeight: 'normal'}}>Name:</label>&nbsp;&nbsp;
            {
              this.props.serverName
              ? <input className='form-control' placeholder='unique name...' style={{width: '85%'}}
                value={this.state.name} disabled />
              : <input className='form-control' placeholder='unique name...' style={{width: '85%'}}
                value={this.state.name} onChange={(e) => this.updateName(e)} />
            }
          </div>
          <div className='col-md-4' style={{display: '-webkit-inline-box'}}>
            <label className='control-label' style={{marginTop: '5px', fontWeight: 'normal'}}>Value:</label>&nbsp;&nbsp;
            <input type='number' className='form-control' placeholder='-1' style={{width: '80%'}}
              value={this.state.limitValue} onChange={(e) => this.updateValue(e)} />
          </div>
        </div>
        <br /><br />
        <div style={{width: '100%', textAlign: 'right'}}>
          <div style={{display: 'inline-block', padding: '5px'}}>
            {this.props.serverName
            ? <button style={{color: 'white'}} onClick={this.goToUpdate} className='btn btn-primary'>
              Save
            </button>
            : <button style={{color: 'white'}} onClick={this.goToCreate} className='btn btn-primary'>
              Create
            </button>
          }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    plans: (state.billingPricingInfo.plans)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateUsage: updateUsage,
    addUsage: addUsage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddUsage)
