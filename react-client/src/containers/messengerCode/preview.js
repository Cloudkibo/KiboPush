/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ViewMessage from '../../components/ViewMessage/viewMessage'

class Preview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    return (
      <div className='col-md-6 col-lg-6 col-sm-6'>
        <div style={{paddingLeft: '50px'}}>
          {
          this.props.messengerCode === undefined ? <ViewMessage payload={this.props.messengerCode.optInMessage} /> : <ViewMessage payload={this.props.messengerCode.optInMessage} />
        }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messengerCode: state.messengerCodeInfo.messengerCode
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview)
