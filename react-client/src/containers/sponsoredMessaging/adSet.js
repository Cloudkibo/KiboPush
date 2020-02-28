/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { fetchAdSets, saveAdSet, updateSponsoredMessage } from '../../redux/actions/sponsoredMessaging.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Footer from './footer'

class AdSet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      adSetType: props.sponsoredMessage.adSetType && props.sponsoredMessage.adSetType !== '' ? props.sponsoredMessage.adSetType : 'existing',
      selectedAdSet: props.sponsoredMessage.adSetId && props.sponsoredMessage.adSetId !== '' ? props.sponsoredMessage.adSetId : '',
      adSetName: props.sponsoredMessage.adSetName && props.sponsoredMessage.adSetName !== '' ? props.sponsoredMessage.adSetName : '',
      gender: props.sponsoredMessage.targeting ? props.sponsoredMessage.targeting.gender : 'all',
      minAge: props.sponsoredMessage.targeting ? props.sponsoredMessage.targeting.minAge : '18',
      maxAge: props.sponsoredMessage.targeting ? props.sponsoredMessage.targeting.maxAge : '65',
      budgetType: props.sponsoredMessage.budgetType && props.sponsoredMessage.budgetType !== '' ? props.sponsoredMessage.budgetType : 'daily_budget',
      budgetAmount: props.sponsoredMessage.budgetAmount && props.sponsoredMessage.budgetAmount !== '' ? props.sponsoredMessage.budgetAmount : 0,
      bidAmount: props.sponsoredMessage.bidAmount && props.sponsoredMessage.bidAmount !== '' ? props.sponsoredMessage.bidAmount : 0,
      currency: props.sponsoredMessage.currency && props.sponsoredMessage.currency !== '' ? props.sponsoredMessage.currency : 'PKR'
    }
    props.fetchAdSets(props.sponsoredMessage.campaignId)

    this.handleAdSetType = this.handleAdSetType.bind(this)
    this.changeAdSetName = this.changeAdSetName.bind(this)
    this.selectAdSet = this.selectAdSet.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.selectGender = this.selectGender.bind(this)
    this.selectMinAge = this.selectMinAge.bind(this)
    this.selectMaxAge = this.selectMaxAge.bind(this)
    this.getAgeRange = this.getAgeRange.bind(this)
    this.handleBudgetType = this.handleBudgetType.bind(this)
    this.handleBudgetAmount = this.handleBudgetAmount.bind(this)
    this.handleBidAmount = this.handleBidAmount.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onKeyDown (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }

  handleBudgetType (e) {
    this.setState({budgetType: e.target.value})
  }

  handleBudgetAmount (e) {
    this.setState({budgetAmount: e.target.value})
  }

  handleBidAmount (e) {
    this.setState({bidAmount: e.target.value})
  }

  selectMaxAge (e) {
    this.setState({maxAge: e.target.value})
  }

  selectMinAge (e) {
    this.setState({minAge: e.target.value})
  }

  selectGender (e) {
    this.setState({gender: e.target.value})
  }

  handleNext () {
    if (this.state.adSetType === 'existing') {
      if (this.state.selectedAdSet === '') {
        this.props.msg.error('Please select an Ad Set')
      } else {
        this.props.saveAdSet({_id: this.props.sponsoredMessage._id, type: this.state.adSetType, id: this.state.selectedAdSet}, this.handleResponse)
      }
    } else if (this.state.adSetType === 'new') {
      if (this.state.adSetName === '') {
        this.props.msg.error('Please enter an Ad Set Name')
      } else if (this.state.budgetAmount === 0 || this.state.budgetAmount === '0') {
        this.props.msg.error('Budget Amount cannot be 0')
      } else if (this.state.bidAmount === 0 || this.state.bidAmount === '0') {
        this.props.msg.error('Bid Amount cannot be 0')
      } else if (parseInt(this.state.minAge) > parseInt(this.state.maxAge)) {
        this.props.msg.error('Minimum Age cannot be greater than maximum age')
      } else if (parseInt(this.state.maxAge) < parseInt(this.state.minAge)) {
        this.props.msg.error('Maximum Age cannot be greater than Minimum age')
      } else if (this.state.adSetName === this.props.sponsoredMessage.adSetName &&
        this.state.budgetType === this.props.sponsoredMessage.budgetType &&
        this.state.budgetAmount === this.props.sponsoredMessage.budgetAmount &&
        this.state.bidAmount === this.props.sponsoredMessage.bidAmount &&
        this.props.sponsoredMessage.targeting &&
        this.state.gender === this.props.sponsoredMessage.targeting.gender &&
        this.state.minAge === this.props.sponsoredMessage.targeting.maxAge &&
        this.state.minAge === this.props.sponsoredMessage.targeting.maxAge
      ) {
        this.props.changeCurrentStep('ad')
      } else {
        let pageId = this.props.pages && this.props.pages.filter(p => p._id === this.props.sponsoredMessage.pageId)[0].pageId
        this.props.saveAdSet({
          _id: this.props.sponsoredMessage._id,
          type: this.state.adSetType,
          name: this.state.adSetName,
          bidAmount: this.state.bidAmount,
          budgetAmount: this.state.budgetAmount,
          budgetType: this.state.budgetType,
          targeting: {
            gender: this.state.gender,
            minAge: this.state.minAge,
            maxAge: this.state.maxAge
          },
          campaignId: this.props.sponsoredMessage.campaignId,
          pageId: pageId,
          currency: this.props.sponsoredMessage.currency
        }, this.handleResponse)
      }
    }
  }

  handleResponse (res) {
    if (res.status === 'success') {
      if (this.state.adSetType === 'existing') {
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, '', '', {adSetId: res.payload, adSetType: this.state.adSetType })
      } else {
        this.props.updateSponsoredMessage(this.props.sponsoredMessage, '', '', {
          adSetType: this.state.adSetType,
          adSetName: this.state.adSetName,
          targeting: {
            gender: this.state.gender,
            minAge: this.state.minAge,
            maxAge: this.state.maxAge
          },
          budgetType: this.state.budgetType,
          budgetAmount: this.state.budgetAmount,
          bidAmount: this.state.bidAmount,
          adSetId: res.payload
        })
      }
      this.props.changeCurrentStep('ad')
    } else {
      this.props.msg.error(res.payload)
    }
  }

  handleBack () {
    this.props.changeCurrentStep('campaign')
  }

  handleAdSetType (e) {
    this.setState({adSetType: e.target.value})
  }

  changeAdSetName (e) {
    this.setState({adSetName: e.target.value})
  }

  selectAdSet (e) {
    this.setState({selectedAdSet: e.target.value})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.adSets && nextProps.adSets.length > 0) {
      if (nextProps.sponsoredMessage.adSetId && nextProps.sponsoredMessage.adSetId !== '') {
        this.setState({selectedCampaign: nextProps.sponsoredMessage.adSetId})
      } else {
        this.setState({selectedAdSet: nextProps.adSets[0].id})
      }
    }
  }

  getAgeRange (minAge, maxAge) {
    let array = []
    for(let i = minAge; i <= maxAge; i++) {
      array.push(<option value={i}>{i}</option>)
    }
    return array
  }

  render () {
    return (
      <div>
        <h5>Step 03:</h5>
        <br />
          <div className='radio-buttons' style={{paddingLeft: '20px'}}>
            <span className='radio'>
              <input
                type='radio'
                value='existing'
                onChange={this.handleAdSetType}
                checked={this.state.adSetType === 'existing'} />
              Select Existing Ad Set
              <span />
              <br /><br />
              {this.state.adSetType === 'existing' &&
              <div>
                {this.props.adSets && this.props.adSets.length > 0
                ? <select className='form-control' value={this.state.selectedAdSet} onChange={this.selectAdSet} style={{width: '50%'}}>
                {
                  this.props.adSets.map((adSet, i) => (
                    <option key={adSet.id} value={adSet.id} selected={adSet.id === this.state.selectedAdSet}>{adSet.name}</option>
                  ))
                }
              </select>
              : <div><span style={{color: 'red'}}>You do not have any existing Ad Sets. Please create a new one.</span>
                  <br />
                </div>
                }
              <br />
            </div>
            }
            </span>
            <span className='radio'>
              <input
                type='radio'
                value='new'
                onChange={this.handleAdSetType}
                checked={this.state.adSetType === 'new'} />
              Create New Ad Set
              <span />
              <br /><br />
              {this.state.adSetType === 'new' &&
                <div>
                  <div className='form-group m-form__group'>
                    <span style={{fontWeight: 'bold'}}>Ad Set Name:</span>
                    <input type='text' className='form-control m-input' placeholder='Enter Ad Set Name...' onChange={this.changeAdSetName} value={this.state.adSetName} style={{borderRadius: '20px', width: '50%', display: 'inline-block', marginLeft: '15px'}} />
                  </div>
                  <div className='form-group m-form__group'>
                    <span style={{fontWeight: 'bold'}}>Targeting:</span>
                  </div>
                  <div className='form-group m-form__group row'>
                    <div className='col-md-4'>
                      <label>Gender:</label>
                        <select className='form-control' value={this.state.gender} onChange={this.selectGender} style={{width: '60%', display: 'inline-block', marginLeft: '15px'}}>
                          <option key='all' value='all'>All</option>
                          <option key='male' value='male'>Male</option>
                          <option key='female' value='female'>Female</option>
                      </select>
                    </div>
                    <div className='col-md-8'>
                      <label>Age:</label>
                        <select className='form-control' value={this.state.minAge} onChange={this.selectMinAge} style={{width: '10%', display: 'inline-block', marginLeft: '15px'}}>
                          {this.getAgeRange(18, 65)}
                      </select>
                      <label>-</label>
                        <select className='form-control' value={this.state.maxAge} onChange={this.selectMaxAge} style={{width: '10%', display: 'inline-block', marginLeft: '15px'}}>
                          {this.getAgeRange(18, 65)}
                      </select>
                    </div>
                  </div>
                  <div className='form-group m-form__group'>
                    <span style={{fontWeight: 'bold'}}>Budget:</span>
                  </div>
                  <div className='form-group m-form__group'>
                    <label>Budget Type:</label>
                      <div className='radio-buttons' style={{paddingLeft: '63px', display: 'inline'}}>
                        <span className='radio' style={{display: 'inline-block'}}>
                          <input
                            type='radio'
                            value='daily_budget'
                            onChange={this.handleBudgetType}
                            checked={this.state.budgetType === 'daily_budget'} />
                          Daily Budget
                          <span ></span>
                        </span>
                        <span className='radio' style={{display: 'inline-block', marginLeft: '50px'}}>
                          <input
                            type='radio'
                            value='lifetime_budget'
                            onChange={this.handleBudgetType}
                            checked={this.state.budgetType === 'lifetime_budget'} />
                          Lifetime Budget
                          <span ></span>
                        </span>
                      </div>
                      <br /><br />
                      <label>Budget Amount:</label>
                      <input id='example-text-input' type='number' min='0' step='1' className='form-control' onChange={this.handleBudgetAmount} value={this.state.budgetAmount} style={{display:'inline-block', width: '10%', marginLeft: '20px'}} />
                      <span style={{display:'inline-block', marginLeft: '5px'}}>{this.state.currency}</span>
                      <br /><br />
                      <label>Bid Amount:</label>
                      <input id='example-text-input' type='number' min='0' step='1' onKeyDown={this.onKeyDown} className='form-control' onChange={this.handleBidAmount} value={this.state.bidAmount} style={{display:'inline-block', width: '10%', marginLeft: '48px'}} />
                      <span style={{display:'inline-block', marginLeft: '5px'}}>{this.state.currency}</span>
                  </div>
                </div>
              }
            </span>
          </div>
        <Footer
          currentStep='adSet'
          handleNext={this.handleNext}
          handleBack={this.handleBack}
          />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    sponsoredMessage: state.sponsoredMessagingInfo.sponsoredMessage,
    adSets: state.sponsoredMessagingInfo.adSets,
    pages: state.pagesInfo.pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAdSets,
    saveAdSet,
    updateSponsoredMessage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AdSet)
