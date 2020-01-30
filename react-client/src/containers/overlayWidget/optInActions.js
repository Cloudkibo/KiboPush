/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Footer from './footer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class OptInActions extends React.Component {
  constructor (props) {
    super(props)
    this.editMessage = this.editMessage.bind(this)
  }
  editMessage () {
    this.props.history.push({
      pathname: `/createWidgetMessage`
     })
  }
  render () {
    return (
      <div className='form-group m-form__group'>
        <div className='menuDiv m-input-icon m-input-icon--right'>
          <input readonly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
          <button className='btn btn-circle btn-icon-only btn-default m-input-icon__icon m-input-icon__icon--right' title='Edit Message' onClick={this.editMessage} href='#/'>
            <i className='fa fa-edit' />
          </button>
        </div>
        <div style={{marginTop: '50px'}}>
          <Footer widgetState='optInActions' handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    currentWidget: (state.overlayWidgetsInfo.currentWidget),
    pages: state.pagesInfo.pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(OptInActions)