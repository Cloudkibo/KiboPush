/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ViewMessage from '../../components/ViewMessage/viewMessage'
import PreviewInitialSate from './initialStatePreview'

class Preview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    console.log('render in preview', this.props.currentTab)
    return (
      <div className='col-md-6 col-lg-6 col-sm-6' style={{borderLeft: '0.07rem solid #EBEDF2', backgroundColor: this.props.initialState ? this.props.initialState.backgroundColor : '#fff'}}>
        {
          this.props.currentTab === 'optInAction' &&
          <div style={{paddingLeft: '50px'}}>
            <ViewMessage payload={this.props.optInMessage} />
          </div>
        }
        {this.props.currentTab === 'initialState' &&
          <PreviewInitialSate
            initialState={this.props.initialState}
            setInitialStatePreview={this.props.setInitialStatePreview}
            title='Here is your widget headline. Click here to change it!'
            description='We also put default text here. Make sure to turn it into a unique and valuable message.'
            pageId={this.props.pageId}
          />
        }
        {this.props.currentTab === 'submittedState' &&
          <PreviewInitialSate
            initialState={this.props.submittedState.state}
            setInitialStatePreview={this.props.setSubmittedStatePreview}
            title='Thank You for Reading Our Thank You Message!'
            description='Once a user opt-ins through your form, he sees this. Unless you change it, of course.'
            button='View it in Messenger'
            currentTab={this.props.currentTab}
            />
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
