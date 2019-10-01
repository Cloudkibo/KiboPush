/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {updateData} from '../../redux/actions/messengerRefURL.actions'

class SetUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    messengerCode: (state.messengerCodeInfo.messengerCode)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SetUp)
