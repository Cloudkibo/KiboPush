/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Footer from './footer'
import { updateLandingPageData } from '../../redux/actions/landingPages.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class adSet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      Adset_name: '',
      min_age: 18,
      max_age: 65,
      budget: {
        type: 'daily_budget',
        amount:''
      }
    }
    this.handleInput = this.handleInput.bind(this)
    this.renderRadioButtonOptions = this.renderRadioButtonOptions.bind(this)
    this.handleRadio = this.handleRadio.bind(this)
    this.handleBudget = this.handleBudget.bind(this)
  }

  handleInput (e) {
    this.setState({Adset_name: e.target.value})
    //this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'url', e.target.value)
  }

  handleRadio (e) {
    console.log(e)
    console.log('hehehe')

    if(e.target.id === 'min_age'){
      this.setState({min_age: e.target.value})
      if(e.target.value > this.state.max_age){
        this.setState({max_age:e.target.value})
      }
    }else if(e.target.id === 'max_age'){
      this.setState({max_age: e.target.value})
      if(e.target.value < this.state.min_age){
        this.setState({min_age:e.target.value})
      }
    }
  }

  handleBudget (e) {
    let temp = this.state.budget
    temp.type = e.target.value
    this.setState({budget: temp})
  }

  renderRadioButtonOptions (length){
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
          <div>
            <label>Adset Name:</label>
            <input className='form-control m-input m-input--air' value={this.state.Adset_name} onChange={this.handleInput} />
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
        <select className="form-control" id="min_age" value={this.state.min_age} onChange={this.handleRadio}>
          {this.renderRadioButtonOptions(65)}
        </select>
        </div>
        _
        <div className='col-sm-2'>
        <select className="form-control" id="max_age" value={this.state.max_age} onChange={this.handleRadio}>
          {this.renderRadioButtonOptions(65)}
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
              <input className='form-control' value={this.state.Adset_name} onChange={this.handleInput} />
              <label className='text-muted small' hidden = { this.state.Adset_name === '' ? true : false }>Rs. {this.state.Adset_name} PKR</label>
          </div>
        </div>
      </div>
    <br/>
  </div>


        <Footer page={this.props.page} Adset_name={this.state.Adset_name} handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    landingPage: state.landingPagesInfo.landingPage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateLandingPageData: updateLandingPageData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(adSet)
