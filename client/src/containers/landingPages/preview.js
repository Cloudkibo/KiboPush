/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ViewMessage from '../../components/ViewMessage/viewMessage'
import PreviewInitialState from './initialStatePreview'
import PreviewSubmittedState from './submittedStatePreview'

class Preview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      backgroundColor: props.landingPage.currentTab === 'initialState' || props.landingPage.currentTab === 'setup' ? props.landingPage.initialState.backgroundColor : props.landingPage.currentTab === 'submittedState' && props.landingPage.submittedState.state ? props.landingPage.submittedState.state.backgroundColor : '#fff',
      backgroundImage: (props.landingPage.currentTab === 'initialState' || props.landingPage.currentTab === 'setup') && props.landingPage.initialState.pageTemplate === 'background' && props.landingPage.initialState.mediaLink !== '' ? props.landingPage.initialState.mediaLink : ''
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.landingPage.currentTab === 'initialState' || nextProps.landingPage.currentTab === 'setup') {
      this.setState({backgroundColor: nextProps.landingPage.initialState.backgroundColor})
    } else if (nextProps.landingPage.currentTab === 'submittedState' && nextProps.landingPage.submittedState.state && nextProps.landingPage.submittedState.state.backgroundColor) {
      this.setState({backgroundColor: nextProps.landingPage.submittedState.state.backgroundColor})
    } else {
      this.setState({backgroundColor: '#fff'})
    }
    if ((nextProps.landingPage.currentTab === 'initialState' || nextProps.landingPage.currentTab === 'setup') && nextProps.landingPage.initialState.pageTemplate === 'background' && nextProps.landingPage.initialState.mediaLink !== '') {
      this.setState({backgroundImage: nextProps.landingPage.initialState.mediaLink})
    } else {
      this.setState({backgroundImage: ''})
    }
  }

  render () {
    console.log('backgroundColor', this.state.backgroundColor)
    return (
      <div className='col-md-6 col-lg-6 col-sm-6' style={{borderLeft: '0.07rem solid #EBEDF2', backgroundColor: this.state.backgroundColor, backgroundImage: 'url(' + this.state.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
        {
          this.props.landingPage.currentTab === 'optInActions' &&
          <div style={{paddingLeft: '50px'}}>
            <ViewMessage payload={this.props.landingPage.optInMessage} />
          </div>
        }
        {(this.props.landingPage.currentTab === 'initialState' || this.props.landingPage.currentTab === 'setup') &&
          <PreviewInitialState />
        }
        {this.props.landingPage.currentTab === 'submittedState' &&
          <PreviewSubmittedState />
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    landingPage: state.landingPagesInfo.landingPage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview)
