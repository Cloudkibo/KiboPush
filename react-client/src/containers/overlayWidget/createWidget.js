/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'
import AlertContainer from 'react-alert'
import Tabs from './tabs'
import Preview from './preview'

class CreateWidget extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isEdit: false
    }
    this.pageChange = this.pageChange.bind(this)
    this.toggleWidgetStatus = this.toggleWidgetStatus.bind(this)
    this.changeWidgetType = this.changeWidgetType.bind(this)
  }
  toggleWidgetStatus () {
    console.log(this.props.currentWidget)
    this.props.updateWidget(this.props.currentWidget, null, 'status', !this.props.currentWidget.status)
  }

  changeWidgetType (e) {
    this.props.updateWidget(this.props.currentWidget, null, 'type', e.target.value)
  }
  componentDidMount () {
    var title = ''
    if (this.state.isEdit) {
      document.title = `${title} | Edit Overlay Widget`
    } else {
      document.title = `${title} | Create Overlay Widget`
    }
    this.props.updateWidget(this.props.currentWidget, null, 'page', this.props.pages[0])
  }
  pageChange (event) {
    if (event.target.value !== -1) {
      var selectedPage = this.props.pages.filter((page) => page._id === event.target.value)[0]
      this.props.updateWidget(this.props.currentWidget, null, 'page', selectedPage)
    } else {
      this.props.updateWidget(this.props.currentWidget, null, 'page', '')
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
              <div className='m-portlet__head'>
                <div className='m-portlet__head-caption'>
                  <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {
                        this.state.isEdit
                        ? 'Edit Overlay Widget'
                        : 'Create Overlay Widget'
                      }
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <button className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.props.onEdit}>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                      <div style={{display: 'flex'}}>
                        <label style={{width: '30%', marginTop: '10px'}}>Select Page</label>
                        <select className='form-control m-input' value={this.props.currentWidget.page ? this.props.currentWidget.page._id : ''} onChange={this.pageChange}>
                        {
                          this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                            <option key={page._id} value={page._id} selected={this.props.currentWidget.page && page._id === this.props.currentWidget.page._id}>{page.pageName}</option>
                          ))
                        }
                        </select>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className='row'>
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                      <div style={{display: 'flex'}}>
                        <label style={{width: '30%', marginTop: '10px'}}>Widget Type</label>
                        <select className='form-control m-input' value={this.props.currentWidget.type} onChange={this.changeWidgetType}>
                          <option value='bar'>Bar</option>
                          <option value='slide-in'>Slide In</option>
                          <option value='modal'>Modal</option>
                          <option value='page-takeover'>Page Takeover</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className='row'>
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                      <div style={{display: 'flex'}}>
                        <label style={{width: '22%', marginTop: '10px'}}>Status</label>
                        <div>
                          <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                            <label>
                              <input type='checkbox' data-switch='true' checked={this.props.currentWidget.status} onChange={this.toggleWidgetStatus} />
                              <span></span>
                            </label>
                          </span>
                        </div>
                        { this.props.currentWidget.status
                          ? <label className='col-1 col-form-label' style={{color: '#34bfa3', marginTop: '5px', width: '30%'}}>
                            Enabled
                            </label>
                          :<label className='col-1 col-form-label' style={{marginTop: '5px', width: '30%'}}>
                            Disabled
                          </label>
                        }
                      </div>
                    </div>
                  </div>
                  <br />
                  <br />
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
  console.log('state in overlay widget', state)
  return {
    currentWidget: (state.overlayWidgetsInfo.currentWidget),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateWidget: updateWidget
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateWidget)
