/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { addPermission } from '../../redux/actions/permissions.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'

class AddPermission extends React.Component {
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
      this.props.msg.error('Please enter permission')
    } else {
      // var permissionCheckboxes = this.state.name
      // var temp = this.state.name.split(' ')
      // for (var i = 1; i < temp.length; i++) {
      //   temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
      // }
      // var permission = temp.toString().replace(new RegExp(',', 'g'), '')
      // permissionCheckboxes.push({name: this.state.name, nick: permission, selected: false})
      // this.setState({permissionCheckboxes: permissionCheckboxes})
      this.props.closeDialog()
      this.props.addPermission({name: this.state.name}, this.props.msg, this.props.openTab)
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
        <center><h3>Add Permission</h3></center>
        <div className='m-form'>
          <div id='question' className='form-group m-form__group'>
            <label className='control-label'>Permission:</label>
            <input className='form-control' placeholder='Enter permission here...'
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
    permissions: (state.permissionsInfo.permissions)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    addPermission: addPermission
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPermission)
