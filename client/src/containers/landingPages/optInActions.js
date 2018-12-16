/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'

class OptInActions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      optInMessage: this.props.optInMessage ? this.props.optInMessage : ''
    }
    this.editMessage = this.editMessage.bind(this)
  }
  editMessage () {
    browserHistory.push({
      pathname: `/createLandingPageMessage`,
      state: {editMessage: this.state.optInMessage}
    })
  }
  render () {
    return (
      <div className='form-group m-form__group'>
        <div className='menuDiv m-input-icon m-input-icon--right'>
          <input onClick={this.editMessage} readonly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
          <button style={{width: '100px', color: 'grey'}} className='btn m-input-icon__icon m-input-icon__icon--right'onClick={this.editMessage}>
            <i className='fa fa-edit' />
             Edit
          </button>
        </div>
      </div>
    )
  }
}

export default OptInActions
