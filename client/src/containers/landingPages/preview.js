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
        {
          this.props.currentTab === 'optInAction' &&
          <div style={{paddingLeft: '50px'}}>
            <ViewMessage payload={this.props.optInMessage} />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview)
