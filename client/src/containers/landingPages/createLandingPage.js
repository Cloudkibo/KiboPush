/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchLandingPages, deleteLandingPage} from '../../redux/actions/landingPages.actions'
import AlertContainer from 'react-alert'
import Header from './header'
import State from './state'
import Preview from './preview'

class CreateLandingPage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentTab: this.props.location.state ? this.props.location.state.tab : '',
      optInMessage: this.props.location.state ? this.props.location.state.message : []
    }
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.setCurrentTab = this.setCurrentTab.bind(this)
  }
  onEdit () {
  }
  setCurrentTab (tab) {
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
                <Header />
                <div className='m-portlet__body'>
                  <div className='row'>
                    <State currentTab={this.state.currentTab} setCurrentTab={this.setCurrentTab} optInMessage={this.state.optInMessage} />
                    <Preview currentTab={this.state.currentTab} optInMessage={this.state.optInMessage} />
                  </div>
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
    landingPages: (state.landingPagesInfo.landingPages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchLandingPages: fetchLandingPages,
    deleteLandingPage: deleteLandingPage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateLandingPage)
