/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class Footer extends React.Component {
  render () {
    return (
      <div className='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
        <div className='row' style={{paddingTop: '30px'}}>
          <div className='col-lg-6 m--align-left'>
            {this.props.currentStep !== 'adAccount' &&
              <button className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next' onClick={this.props.handleBack}>
                  <span>
                  <i className='la la-arrow-left' />
                  <span>Back</span>&nbsp;&nbsp;
                </span>
              </button>
            }
          </div>
          <div className='col-lg-6 m--align-right'>
            {this.props.currentStep !== 'ad' &&
              <button className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next' onClick={this.props.handleNext}>
                <span>
                  <span>Next</span>&nbsp;&nbsp;
                  <i className='la la-arrow-right' />
                </span>
              </button>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Footer
