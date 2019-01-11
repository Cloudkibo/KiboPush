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
      previewOptInMessage: []
    }
  }
  componentDidMount () {
    for (var i = 0; i < this.props.messengerAd.jsonAdMessages.length; i++) {
      if (!this.props.messengerAd.jsonAdMessages[i].jsonAdMessageParentId) {
        this.setState({
          previewOptInMessage: this.props.messengerAd.jsonAdMessages[i].messageContent
        })
      }
    }
  }
  render () {
    return (
      <div className='col-md-6 col-lg-6 col-sm-6'>
        <div style={{paddingLeft: '50px'}}>
          <ViewMessage payload={this.state.previewOptInMessage} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messengerAd: state.messengerAdsInfo.messengerAd
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview)
