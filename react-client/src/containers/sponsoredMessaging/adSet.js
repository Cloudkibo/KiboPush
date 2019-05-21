/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Footer from './footer'
import { updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class adSet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ad_set_payload: {
        adset_name:'',
        gender:'',
        min_age: 18,
        max_age: 65
      },    
      budget: {
        type: 'daily_budget',
        amount:''
      }
    }
    this.handleName = this.handleName.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
    this.handleAge = this.handleAge.bind(this)
    this.handleBudget = this.handleBudget.bind(this)
  }

  handleName (e) {
    let temp = this.state.ad_set_payload
    temp.adset_name = e.target.value
    this.setState({ad_set_payload: temp})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'ad_set_payload', temp)
  }

  handleAge (e) {
    let temp = this.state.ad_set_payload
    if(e.target.id === 'min_age'){
      temp.min_age = e.target.value 
      this.setState({ad_set_payload: temp})
      if(e.target.value > this.state.ad_set_payload.max_age){
        temp.max_age = e.target.value
        this.setState({ad_set_payload: temp})
      }
    }else if(e.target.id === 'max_age'){
      temp.max_age = e.target.value
      this.setState({ad_set_payload: temp})
      if(e.target.value < this.state.ad_set_payload.min_age){
        temp.min_age = e.target.value
        this.setState({ad_set_payload:temp})
      }
    }
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'ad_set_payload', temp)
  }

  handleBudget (e) {
    let temp = this.state.budget

    if (e.target.id === 'budget_type'){
      temp.type = e.target.value
    }else if (e. target.id === 'budget_amount'){
      temp.amount = e.target.value
    }

    this.setState({budget: temp})

  }

  renderOptions (length){
    let optarray = []
    for(let i=18; i <=length; i++){
      optarray.push(
      <option value={i}>{i}</option>
      )
    }
    return optarray
  }

  render () {
    return (
      <div>
        <div className="col-md-6 col-lg-6 col-sm-6">
          <div>
            <label>Adset Name:</label>
            <input className='form-control m-input m-input--air' value={this.state.Adset_name} onChange={this.handleName} />
          </div>
        <br />
        <div>
        <label>Audience</label>
          <div>
            <label>Gender:</label>
            <div className="radio">
            <label><input type="radio" name="gender" checked/>Male</label>
            </div>
            <div className="radio">
              <label><input type="radio" name="gender"/>Female</label>
            </div>
            <div className="radio">
              <label><input type="radio" name="gender"/>Other</label>
            </div>
          </div>
        <br />
        <div className="form-group">
        <label>Age:</label>
        <br/>
        <div className='row'>
        <div className='col-sm-2'>
        <select className="form-control" id="min_age" value={this.state.ad_set_payload.min_age} onChange={this.handleAge}>
          {this.renderOptions(65)}
        </select>
        </div>
        _
        <div className='col-sm-2'>
        <select className="form-control" id="max_age" value={this.state.ad_set_payload.max_age} onChange={this.handleAge}>
          {this.renderOptions(65)}
        </select>
        </div>
        </div>
      </div>
      </div>
      <div>

      <div>
        <label>Budget:</label>
        <div className='row'>
          <div className='col-sm-6'>
          <select className="form-control" id="budget_type" value={this.state.budget.type} onChange={this.handleBudget}>
            <option value='daily_budget'>Daily Budget</option>
            <option value='lifetime_budget'>Lifetime Budget</option>
          </select>
          </div>
          <div className='col-sm-4'>
              <input className='form-control' id ='budget_amount' value={this.state.budget.amount} onChange={this.handleBudget} />
              <label className='text-muted small' hidden = { this.state.budget.amount === '' ? true : false }>Rs. {this.state.budget.amount} PKR</label>
          </div>
        </div>
      </div>
    <br/>
  </div>
  </div>

        <Footer page={this.props.page} Adset_name={this.state.Adset_name} handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    sponsoredMessage: state.sponsoredMessagingInfo.sponsoredMessage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage: updateSponsoredMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(adSet)
