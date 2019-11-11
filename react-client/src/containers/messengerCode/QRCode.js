/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class SetUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    console.log('good', this.props.messengerCode)
    return (
      <div>
        <center>
          <img alt='' src={this.props.messengerCode.QRCode} style={{ display: 'block', width: '30%' }} />
        </center>
        <br />
        <center>
          <a href={this.props.messengerCode.QRCode} target='_blank' rel='noopener noreferrer' download className='btn btn-outline-success' style={{ borderColor: '#34bfa3' }}>
            <i className='fa fa-download' />&nbsp;&nbsp;Download Image
                            </a>
        </center>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    messengerCode: (state.messengerCodeInfo.messengerCode)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SetUp)
