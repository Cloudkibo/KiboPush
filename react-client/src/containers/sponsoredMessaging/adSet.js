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
      page: (this.props.pageId && this.props.adSetPayload.adset_name)? this.props.pageId :this.props.pages[0].pageId,
      ad_set_payload: {
        adset_name: (this.props.adSetPayload && this.props.adSetPayload.adset_name)? this.props.adSetPayload.adset_name : '' ,
        gender: (this.props.adSetPayload && this.props.adSetPayload.gender)? this.props.adSetPayload.gender : 'all',
        min_age:  (this.props.adSetPayload && this.props.adSetPayload.min_age)? this.props.adSetPayload.min_age : 18,
        max_age:  (this.props.adSetPayload && this.props.adSetPayload.max_age)? this.props.adSetPayload.max_age : 65,
        budget:  (this.props.adSetPayload && this.props.adSetPayload.budget)? this.props.adSetPayload.budget : {
          type: 'daily_budget',
          amount: 0
        },
        bidAmount: (this.props.adSetPayload && this.props.adSetPayload.bidAmount) ? this.props.adSetPayload.bidAmount : 0
      },
    }
    this.handleName = this.handleName.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
    this.handleAge = this.handleAge.bind(this)
    this.handleBudget = this.handleBudget.bind(this)
    this.handlePage = this.handlePage.bind(this)
    this.handleGender = this.handleGender.bind(this)
    this.handleBidAmount = this.handleBidAmount.bind(this)

  }

  handleBidAmount (e) {
    let temp = this.state.ad_set_payload
    temp.bidAmount = e.target.value
    this.setState({ad_set_payload: temp})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'ad_set_payload', temp)
    this.props.onEdit()

  }

  handleName (e) {
    let temp = this.state.ad_set_payload
    temp.adset_name = e.target.value
    this.setState({ad_set_payload: temp})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'ad_set_payload', temp)
    this.props.onEdit()
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
    this.props.onEdit()
  }

  handleBudget (e) {
    let temp = this.state.ad_set_payload

    if (e.target.id === 'budget_type'){
      temp.budget.type = e.target.value
    }else if (e.target.id === 'budget_amount'){
      temp.budget.amount = e.target.value
    }
    this.setState({ad_set_payload: temp})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage, 'ad_set_payload', temp)
    this.props.onEdit()

  }

  handlePage(e){
    let temp = e.target.value
    this.setState({page: temp})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage,'pageId',temp)
    this.props.onEdit()
  }

  handleGender (e) {
    console.log('genders',e.target.value)
    let temp = this.state.ad_set_payload
    temp.gender = e.target.value
    this.setState({ad_set_payload: temp})
    this.props.updateSponsoredMessage(this.props.sponsoredMessage,'ad_set_payload',temp)
    this.props.onEdit()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.props.updateSponsoredMessage(nextProps.sponsoredMessage,'pageId',nextProps.pages[0].pageId)
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
            <input className='form-control m-input m-input--air' value={this.state.ad_set_payload.adset_name} onChange={this.handleName} />
          </div>
        <br />
        <div>
        <label>Targetting</label>
          <div onChange={this.handleGender}>
            <label>Gender:</label>
            <div className="radio">
              <label><input type="radio" name="gender" value='all' checked={ this.state.ad_set_payload.gender === 'all'} />all</label>
            </div>
            <div className="radio">
            <label><input type="radio" name="gender" value='male' checked={ this.state.ad_set_payload.gender === 'male'}/>Male</label>
            </div>
            <div className="radio">
              <label><input type="radio" name="gender" value='female' checked={ this.state.ad_set_payload.gender === 'female'} />Female</label>
            </div>
          </div>
        <br />
        <div className="form-group">
        <label>Age:</label>
        <br/>
        <div className='row'>
        <div className='col-sm-2'>
        <select className="form-control" type='number' id="min_age" value={this.state.ad_set_payload.min_age} onChange={this.handleAge}>
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
          <select className="form-control" id="budget_type" value={this.state.ad_set_payload.budget.type} onChange={this.handleBudget}>
            <option value='daily_budget'>Daily Budget</option>
            <option value='lifetime_budget'>Lifetime Budget</option>
          </select>
          </div>
          <div className='col-sm-4'>
              <input className='form-control' type='number' id ='budget_amount' value={this.state.ad_set_payload.budget.amount} onChange={this.handleBudget} />
              <label className='text-muted small' hidden = { this.state.ad_set_payload.budget.amount === '' ? true : false }>Rs. {this.state.ad_set_payload.budget.amount} PKR</label>
          </div>
        </div>
      </div>
      <div>
      <label>Bid Control:</label>
      <div className='row'>
          <div className='col-sm-12'>
          <input className='form-control' type='number' id ='bid_amount' value={this.state.ad_set_payload.bidAmount} onChange={this.handleBidAmount} />
          <label className='text-muted small' hidden = { this.state.ad_set_payload.bidAmount === '' ? true : false }>Rs. {this.state.ad_set_payload.bidAmount} PKR</label>
          </div>
      </div>
      </div>
      <br/>
      <div>
        <label>Select page:</label>
        <div className='row'>
          <div className='col-sm-6'>
          <select className="form-control" id="page" value={this.state.page} onChange={this.handlePage}>
            {this.props.pages.map((item,index) => {
              return <option value={item.pageId}>{item.pageName}</option>
              })}
          </select>
          </div>
        </div>
      </div>
  </div>
  </div>
  <br/>
  <br/>

        <Footer page={this.props.page} adset_name={this.state.adset_name} handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    sponsoredMessage: state.sponsoredMessagingInfo.sponsoredMessage,
    pages: state.pagesInfo.pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateSponsoredMessage: updateSponsoredMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(adSet)
