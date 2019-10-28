/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Footer from './footer'

class OptInActions extends React.Component {
  constructor (props) {
    super(props)
    this.editMessage = this.editMessage.bind(this)
  }
  editMessage () {
    if(this.props.module === 'edit'){
      this.props.history.push({
        pathname: `/createLandingPageMessage`,
        state: {module: 'edit'}
       })
    }else{
      this.props.history.push({
       pathname: `/createLandingPageMessage`
      })
    }
  }
  render () {
    return (
      <div className='form-group m-form__group'>
        <div className='menuDiv m-input-icon m-input-icon--right'>
          <input onClick={this.editMessage} readonly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
          <a className='btn btn-circle btn-icon-only btn-default m-input-icon__icon m-input-icon__icon--right' title='Edit Message' onClick={this.editMessage} href='javascript:;'>
            <i className='fa fa-edit' />
          </a>
        </div>
        <div style={{marginTop: '50px'}}>
          <Footer page='optInActions' handleNext={this.props.handleNext} handleBack={this.props.handleBack} module={this.props.module} component='optInAction' />
        </div>
      </div>
    )
  }
}

export default OptInActions
