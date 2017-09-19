/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './Button'

class Card extends React.Component {
  constructor (props, context) {
    super(props, context)
    this._onChange = this._onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubtitle = this.handleSubtitle.bind(this)
    this.state = {
      imgSrc: '',
      title: '',
      subtitle: ''
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

  _onChange () {
  // Assuming only image
    var file = this.refs.file.files[0]
    var reader = new FileReader()
    var url = reader.readAsDataURL(file)

    reader.onloadend = function (e) {
      this.setState({
        imgSrc: [reader.result]
      })
    }.bind(this)
    console.log(url) // Would see a path?
  // TODO: concat files
  }

  handleChange (event) {
    this.setState({
      title: event.target.value
    })
  }

  handleSubtitle (event) {
    this.setState({
      subtitle: event.target.value
    })
  }

  render () {
    console.log('State: ', this.state)
    return (
      <div>
        <div style={{minHeight: 350, maxWidth: 400, marginBottom: '-0.5px'}} className='ui-block hoverbordersolid'>
          <div style={{display: 'flex', minHeight: 170}} className='cardimageblock'>
            <input
              ref='file'
              type='file'
              name='user[image]'
              multiple='true'
              onChange={this._onChange} style={{position: 'absolute', opacity: 0, maxWidth: 370, minHeight: 170, zIndex: 5, cursor: 'pointer'}} />

            {
          (this.state.imgSrc === '')
          ? <img style={{maxHeight: 40, margin: 'auto'}} src='icons/picture.png' alt='Text' />
          : <img style={{maxWidth: 375, maxHeight: 300, padding: 25}} src={this.state.imgSrc} />
         }

          </div>
          <div>
            <input onChange={this.handleChange} style={{fontSize: '20px', fontWeight: 'bold', paddingTop: '5px', borderStyle: 'none'}} type='text' placeholder='Enter Title...' />
            <textarea onChange={this.handleSubtitle} style={{borderStyle: 'none'}} rows='2' cols='37' placeholder='Enter subtitle...' />
          </div>
        </div>
        <div className='ui-block hoverborder' style={{minHeight: 30, maxWidth: 400}}>
          <Button />
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
export default connect(mapStateToProps, mapDispatchToProps)(Card)
