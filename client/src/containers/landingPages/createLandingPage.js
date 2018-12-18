/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createLandingPage } from '../../redux/actions/landingPages.actions'
import AlertContainer from 'react-alert'
import Header from './header'
import State from './state'

class CreateLandingPage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentTab: 'initialState',
      optInMessage: this.props.location.state ? this.props.location.state.message : [],
      initialState: this.props.location.state ? this.props.location.state.initialState : {},
      submittedState: this.props.location.state ? this.props.location.state.submittedState : {},
      isActive: this.props.location.state ? this.props.location.state.isActive : true,
      pageId: this.props.location.state ? this.props.location.state.pageId : ''
    }

    this.setSubmittedState = this.setSubmittedState.bind(this)
    this.setInitialState = this.setInitialState.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.setCurrentTab = this.setCurrentTab.bind(this)
    this.onSave = this.onSave.bind(this)
  }
  onEdit () {
  }
  setCurrentTab (tab) {
    console.log('setCurrentTab', tab)
    this.setState({
      currentTab: tab
    })
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }
  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.landingPages) {
      this.displayData(0, nextProps.landingPages)
      this.setState({totalLength: nextProps.landingPages.length})
    }
  }
  setInitialState (data) {
    this.setState({initialState: data})
    console.log('setInitialState:', data)
  }
  setSubmittedState (data) {
    this.setState({submittedState: data})
    console.log('setSubmittedState:', data)
  }
  onSave () {
    this.props.createLandingPage({initialState: this.state.initialState, submittedState: this.state.submittedState, pageId: this.state.pageId, optInMessage: this.state.optInMessage, isActive: true}, this.msg)
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <Header onSave={this.onSave} />
                <div className='m-portlet__body'>
                  <State currentTab={this.state.currentTab}
                    setCurrentTab={this.setCurrentTab}
                    optInMessage={this.state.optInMessage}
                    setInitialState={this.setInitialState}
                    setSubmittedState={this.setSubmittedState} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createLandingPage: createLandingPage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateLandingPage)
