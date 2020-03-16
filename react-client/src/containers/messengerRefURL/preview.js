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
    console.log('this.props.messengerRefURL.reply in Perview Component', this.props.messengerRefURL.reply)
    return (
      <div className='col-md-6 col-lg-6 col-sm-6'>
        <div style={{paddingLeft: '50px'}}>
          {
          this.props.selectedmessengerRefURL === undefined ? <ViewMessage history={this.props.history} location={this.props.location} payload={this.props.messengerRefURL.reply} pageName={this.props.pageName}/> : <ViewMessage payload={this.props.selectedmessengerRefURL.reply} pageName={this.props.pageName}/>
        }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messengerRefURL: state.messengerRefURLInfo.messengerRefURL
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview)
