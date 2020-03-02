/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import StepItem from '../../components/wizard/horizontal/stepItem'

class StepsBar extends React.Component {
  render () {
    console.log('this.props.sponsoredMessage render', this.props.sponsoredMessage)
    console.log('currentStep', this.props.currentStep)
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div id='step_container' style={{width: '97%'}}>
            <center>
              <StepItem number='1' title='Ad Account' active={true} showLine={false}
                currentStep='adAccount'
                changeCurrentStep={this.props.changeCurrentStep}
                />
              <StepItem number='2' title='Campaign'
                active={this.props.currentStep === 'campaign' || (this.props.sponsoredMessage.adAccountId && this.props.sponsoredMessage.adAccountId !== '')}
                showLine={true}
                currentStep='campaign'
                changeCurrentStep={this.props.changeCurrentStep} />
              <StepItem number='3' title='Ad Set'
                active={this.props.currentStep === 'adSet' || (this.props.sponsoredMessage.campaignId && this.props.sponsoredMessage.campaignId !== '')}
                showLine={true}
                currentStep='adSet'
                changeCurrentStep={this.props.changeCurrentStep} />
              <StepItem number='4' title='Ad'
                active={this.props.currentStep === 'ad' || (this.props.sponsoredMessage.adSetId && this.props.sponsoredMessage.adSetId !== '')}
                showLine={true}
                currentStep='ad'
                changeCurrentStep={this.props.changeCurrentStep} />
            </center>
          </div>
        </div>
      </div>
    )
  }
}

export default StepsBar
