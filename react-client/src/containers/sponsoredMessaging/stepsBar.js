/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import StepItem from '../../components/wizard/horizontal/stepItem'

class StepsBar extends React.Component {
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div id='step_container' style={{width: '97%'}}>
            <center>
              <StepItem number='1' title='Ad Account' active={true} showLine={false} currentStep={this.props.currentStep} />
              <StepItem number='2' title='Campaign' active={this.props.currentStep !== 'adAccount'} showLine={true} currentStep={this.props.currentStep} />
              <StepItem number='3' title='Ad Set' active={(this.props.currentStep !== 'adAccount' && this.props.currentStep !== 'campaign')} showLine={true} currentStep={this.props.currentStep} />
              <StepItem number='4' title='Ad' active={(this.props.currentStep !== 'adAccount' && this.props.currentStep !== 'campaign' && this.props.currentStep !== 'adSet')} showLine={true} currentStep={this.props.currentStep} />
            </center>
          </div>
        </div>
        {/*
      <div className='row'>
        <div className='col-md-3'>
              <a href='#/' style={{display: 'tableCell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0px', cursor: 'pointer'}}>
                <span style={{backgroundColor: 'rgb(244, 245, 248)', width: '3rem', height: '3rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                  <span style={{color: 'rgb(164, 166, 174)', fontSize: '1.5rem', fontWeight: '500'}}>1</span>
                </span>
              </a>
            </div>
      </div>
      */}

      </div>
    )
  }
}

export default StepsBar
