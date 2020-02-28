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
      </div>
    )
  }
}

export default StepsBar
