/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { addFeature } from '../../redux/actions/features.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'

class AddFeature extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      name: ''
    }
    this.updateName = this.updateName.bind(this)
    this.goToCreate = this.goToCreate.bind(this)
  }
  updateName (e) {
    this.setState({name: e.target.value})
  }
  goToCreate () {
    if (this.state.name === '') {
      this.props.msg.error('Please enter feature')
    } else {
      this.props.closeDialog()
      this.props.addFeature({name: this.state.name}, this.props.msg, this.props.openTab)
    }
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <center><h3>Add Feature</h3></center>
        <div className='m-form'>
          <div id='question' className='form-group m-form__group'>
            <label className='control-label'>Feature:</label>
            <input className='form-control' placeholder='Enter feature here...'
              value={this.state.name} onChange={(e) => this.updateName(e)} />
          </div>
        </div>
        <br /><br />
        <div style={{width: '100%', textAlign: 'right'}}>
          <div style={{display: 'inline-block', padding: '5px'}}>
            <button style={{color: 'white'}} onClick={this.goToCreate} className='btn btn-primary'>
              Create
            </button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    features: (state.featuresInfo.features)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    addFeature: addFeature
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddFeature)
