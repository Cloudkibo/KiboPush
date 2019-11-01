/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
//  import Select from 'react-select'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {updateData} from '../../redux/actions/messengerRefURL.actions'

class OptInActions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sequenceValue: '',
      sequenceOptions: []
    }
    this.editMessage = this.editMessage.bind(this)
    this.handleSequence = this.handleSequence.bind(this)
  }
  handleSequence (obj) {
    this.setState({sequenceValue: obj.value})
    this.props.updateData(this.props.messengerRefURL, 'sequenceId', obj.value)
  }
  componentDidMount () {
    if (this.props.sequences) {
      let sequenceOptions = []
      for (let a = 0; a < this.props.sequences.length; a++) {
        if (this.props.sequences[a].sequence.trigger.event === 'subscribes_to_sequence') {
          sequenceOptions.push({'value': this.props.sequences[a].sequence._id, 'label': this.props.sequences[a].sequence.name})
        }
      }
      this.setState({sequenceOptions: sequenceOptions})
    }
  }
  editMessage () {
    this.props.browserHistory.push({
      pathname: `/editMessengerRefURLMessage`,
      state: {module: this.props.module, messengerRefSelectedURL: this.props.messengerRefSelectedURL}
    })
  }
  render () {
    console.log('this.props.messengerRefSelectedURL in optInAction compoennet', this.props.messengerRefSelectedURL)
    return (
      <div>
        <div className='form-group m-form__group'>
          <span>Opt-In Message: </span>
          <div className='menuDiv m-input-icon m-input-icon--right' style={{marginTop: '10px'}}>
            <input onClick={this.editMessage} readonly type='text' className='form-control m-input menuInput' value='Opt-In Message' />
            <a className='btn btn-circle btn-icon-only btn-default m-input-icon__icon m-input-icon__icon--right' title='Edit Message' onClick={this.editMessage} href='javascript:;'>
              <i className='fa fa-edit' />
            </a>
          </div>
        </div>
        {/* <div className='form-group m-form__group'>
          <span>Add Subscriber to Sequence: </span>
          <Select
            options={this.state.sequenceOptions}
            onChange={this.handleSequence}
            value={this.state.sequenceValue}
            placeholder='Select Sequence...'
          />
        </div>
        */}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messengerRefURL: state.messengerRefURLInfo.messengerRefURL,
    sequences: (state.sequenceInfo.sequences)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateData: updateData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OptInActions)
