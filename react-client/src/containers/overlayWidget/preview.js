/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ViewMessage from '../../components/ViewMessage/viewMessage'
import PreviewInitialState from './previewInitialState'
import PreviewSubmittedState from './previewSubmittedState'

class Preview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
  }

  render () {
    return (
      <div className='col-md-6 col-lg-6 col-sm-6'>
        {          
          this.props.currentWidget.currentTab === 'optInActions' &&
          <div style={{borderLeft: '0.07rem solid #EBEDF2' }}>
            <div style={{paddingLeft: '50px'}}>
              <ViewMessage payload={this.props.currentWidget.optInMessage} />
            </div>
          </div>
        }
        { (this.props.currentWidget.currentTab === 'initialState' || this.props.currentWidget.currentTab === 'setup') &&
         <PreviewInitialState />
        }
        { this.props.currentWidget.currentTab === 'submittedState' &&
         <PreviewSubmittedState />
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    currentWidget: state.overlayWidgetsInfo.currentWidget
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview)
