/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class Footer extends React.Component {
  render () {
    return (
      <div>
        <div className='m-form__actions'>
          <div className='row'>
            <div className='col-lg-6 m--align-left'>
              {this.props.widgetState !== 'initialState' &&
                <button className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next' onClick={() => this.props.handleBack(this.props.widgetState)}>
                  <span>
                    <i className='la la-arrow-left' />
                    <span>Back</span>&nbsp;&nbsp;
                  </span>
                </button>
              }
            </div>
            <div className='col-lg-6 m--align-right'>
              {(this.props.widgetState !== 'setup') &&
                <button className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next' onClick={() => this.props.handleNext(this.props.widgetState)}>
                  <span>
                    <span>Next</span>&nbsp;&nbsp;
                    <i className='la la-arrow-right' />
                  </span>
                </button>  
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Footer
