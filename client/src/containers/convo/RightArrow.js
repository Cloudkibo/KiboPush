/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class RightArrow extends React.Component {
  render () {
    const {style, className, onClick} = this.props
    console.log('this.props', this.props)
    return (
      <div>
        {this.props.className !== 'slick-arrow slick-next slick-disabled'
        ? <span
          style={{style, display: 'block'}}
          className={className}
          onClick={onClick}
        />
      : <span
        className='slick-arrow'
        style={{top: '50%', width: '20px', height: '20px', right: '-25px', transform: 'translate(0,-50%)', cursor: 'pointer', border: 'none', outline: '0', background: '0 0', position: 'absolute', display: 'block', padding: '0'}}
        onClick={this.props.addSlide}>
        <i className='fa fa-plus-circle' style={{fontSize: '20px', color: '#ccc'}} />
      </span>
      }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(RightArrow)
