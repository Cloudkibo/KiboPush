/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
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
    this.props.onEditMessage()
    let initialFiles = this.props.initialFiles
    if (this.props.newFiles) {
      initialFiles = initialFiles.concat(this.props.newFiles)
    }
    this.props.history.push({
      pathname: `/createMessengerAdMessage`,
      state: {jsonAdId: this.props.jsonAdId, setupState: this.props.setupState, initialFiles, realInitialFiles: this.props.initialFiles, newFiles: this.props.newFiles}
    })
  }

  render () {
    console.log('this.props.messengerAds', this.props.jsonAdId)
    return (
      <div>
        <div className='form-group m-form__group'>
          <span>Opt-In Message: </span>
          <div className='menuDiv m-input-icon m-input-icon--right' style={{marginTop: '10px'}}>
            <input readOnly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
            <button className='btn btn-circle btn-icon-only btn-default m-input-icon__icon m-input-icon__icon--right' title='Edit Message' onClick={this.editMessage} href='#/'>
              <i className='fa fa-edit' />
            </button>
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
