/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'

class Text extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)
    this.addButton = this.addButton.bind(this)
    this.state = {
      button: [],
      text: ''
    }
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

  handleChange (event) {
    this.props.handleText({id: this.props.id, text: event.target.value, button: this.state.button})
    this.setState({text: event.target.value})
  }

  addButton (obj) {
    var temp = this.state.button
    temp.push(obj)
    this.setState({button: temp})
    this.props.handleText({id: this.props.id, text: this.state.text, button: this.state.button})
  }

  render () {
    return (
      <div>
        <div style={{marginBottom: '-7px'}}>
          <textarea className='hoverbordersolid' onChange={this.handleChange} rows='2' style={{maxHeight: 25}} cols='37' placeholder='Enter your text...' />
        </div>
        {(this.state.button) ? this.state.button.map((obj) => {
          return <button className='btn btn-primary btn-sm' style={{width: 100 + '%', margin: 0, border: 2 + 'px', borderStyle: 'solid', borderColor: '#FF5E3A'}}>{obj.title}</button>
        }) : ''}
        <div className='ui-block hoverborder' style={{minHeight: 30, maxWidth: 400}}>
          <Button onAdd={this.addButton} />
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
export default connect(mapStateToProps, mapDispatchToProps)(Text)
