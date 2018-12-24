/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createLandingPage, updateLandingPageData, editLandingPage } from '../../redux/actions/landingPages.actions'
import AlertContainer from 'react-alert'
import Header from './header'
import Tabs from './tabs'
import Preview from './preview'

class CreateLandingPage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isActive: props.location.state && props.location.state._id ? props.location.state.isActive : true,
      isEdit: false
    }

    if (props.location.state && props.location.state.pageId) {
      props.updateLandingPageData(this.props.landingPage, '', 'pageId', props.location.state.pageId)
    }
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.setStatus = this.setStatus.bind(this)
  }
  componentDidMount () {
    console.log('this.props.location.state', this.props.location.state)
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      this.setState({isEdit: true, isActive: this.props.location.state.landingPage.isActive})
      this.props.updateLandingPageData('', '', '', '', '', {
        pageId: this.props.location.state.landingPage.pageId.pageId,
        initialState: this.props.location.state.landingPage.initialState,
        submittedState: this.props.location.state.landingPage.submittedState,
        optInMessage: this.props.location.state.landingPage.optInMessage,
        currentTab: 'initialState'
      })
    }
  }
  onEdit () {
    this.props.editLandingPage(this.props.location.state.landingPage._id, {
      initialState: this.props.landingPage.initialState,
      submittedState: this.props.landingPage.submittedState,
      optInMessage: this.props.landingPage.optInMessage,
      isActive: this.state.isActive}, this.msg)
  }
  onSave () {
    this.props.createLandingPage({initialState: this.props.landingPage.initialState,
      submittedState: this.props.landingPage.submittedState,
      pageId: this.props.landingPage.pageId,
      optInMessage: this.props.landingPage.optInMessage,
      isActive: this.state.isActive}, this.msg)
  }
  setStatus (value) {
    this.setState({isActive: value})
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
                <Header onSave={this.onSave}
                  onEdit={this.onEdit}
                  isEdit={this.state.isEdit}
                  isActive={this.state.isActive}
                  setStatus={this.setStatus} />
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                      <Tabs />
                    </div>
                    <Preview />
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
    landingPage: state.landingPagesInfo.landingPage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createLandingPage: createLandingPage,
    updateLandingPageData: updateLandingPageData,
    editLandingPage: editLandingPage
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateLandingPage)
