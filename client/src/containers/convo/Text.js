/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TextareaAutosize from 'react-textarea-autosize'

class Audio extends React.Component {

  constructor (props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }

  handleChange(event){
      this.props.handleText({id: this.props.id, text: event.target.value});
  }

  render () {
    return (
      <div>
        <div style={{marginBottom: '-7px'}}>
          <textarea className='hoverbordersolid' onChange={this.handleChange} rows='2' style={{maxHeight: 25}} cols='37' placeholder='Enter your text...' />
        </div>
        <div className='ui-block hoverborder' style={{minHeight: 30, maxWidth: 400}}>
          <div style={{paddingTop: '5px'}} className='align-center'>
            <h6> + Add Button </h6>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Audio)
