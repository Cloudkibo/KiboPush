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
    return (
      <div>
        <span
          style={{style, display: 'block'}}
          className={className}
          onClick={onClick}
        />
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
