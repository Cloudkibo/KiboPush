/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateData } from '../../redux/actions/messengerRefURL.actions'

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
          <img src={this.props.messengerCode.QRCode} style={{ display: 'block', width: '30%' }} />
        </center>
        <br />
        <center>
          <a href={this.props.messengerCode.QRCode} target='_blank' download className='btn btn-outline-success' style={{ borderColor: '#34bfa3' }}>
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
