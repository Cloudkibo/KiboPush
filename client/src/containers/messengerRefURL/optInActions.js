/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'

class OptInActions extends React.Component {
  constructor (props) {
    super(props)
    this.editMessage = this.editMessage.bind(this)
  }
  editMessage () {
    browserHistory.push({
      pathname: `/createMessengerRefURLMessage`
    })
  }
  render () {
    return (
      <div className='form-group m-form__group'>
        <span>Opt-In Message: </span>
        <div className='menuDiv m-input-icon m-input-icon--right' style={{marginTop: '10px'}}>
          <input onClick={this.editMessage} readonly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
          <a className='btn btn-circle btn-icon-only btn-default m-input-icon__icon m-input-icon__icon--right' title='Edit Message' onClick={this.editMessage} href='javascript:;'>
            <i className='fa fa-edit' />
          </a>
        </div>
      </div>
    )
  }
}

export default OptInActions
