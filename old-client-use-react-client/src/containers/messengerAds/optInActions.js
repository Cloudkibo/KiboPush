/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateCurrentJsonAd } from '../../redux/actions/messengerAds.actions'

class OptInActions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.editMessage = this.editMessage.bind(this)
  }

  componentDidMount () {
  }
  editMessage () {
    this.props.switchSetupState('false')
    browserHistory.push({
      pathname: `/createMessengerAdMessage`,
      state: {jsonAdId: this.props.jsonAdId}
    })
  }
  render () {
    console.log('this.props.messengerAds', this.props.messengerAd)
    return (
      <div>
        <div className='form-group m-form__group'>
          <span>Opt-In Message: </span>
          <div className='menuDiv m-input-icon m-input-icon--right' style={{marginTop: '10px'}}>
            <input onClick={this.editMessage} readOnly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
            <a className='btn btn-circle btn-icon-only btn-default m-input-icon__icon m-input-icon__icon--right' title='Edit Message' onClick={this.editMessage} href='javascript:;'>
              <i className='fa fa-edit' />
            </a>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messengerAd: state.messengerAdsInfo.messengerAd
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateCurrentJsonAd: updateCurrentJsonAd
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OptInActions)
