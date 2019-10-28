/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class SubscriberSummary extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      days: 'all',
      showDaysDropDown: false,
      pageId: 'all',
      selectedPage: {},
      data: [],
      isShowingModal: false
    }
    this.showDaysDropDown = this.showDaysDropDown.bind(this)
    this.hideDaysDropDown = this.hideDaysDropDown.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.showReport = this.showReport.bind(this)
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  onKeyDown (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }
  showDropDown () {
    this.setState({showDropDown: true})
  }
  hideDropDown () {
    this.setState({showDropDown: false})
  }
  showDaysDropDown () {
    this.setState({showDaysDropDown: true})
  }
  hideDaysDropDown () {
    this.setState({showDaysDropDown: false})
  }
  changeDays (days) {
    if (days === 'other') {
      this.setState({isShowingModal: true})
    } else {
      this.setState({days: days})
      this.props.loadSubscriberSummary({days: days})
    }
  }
  onInputChange (e) {
    console.log('days:', e.target.value)
    this.setState({days: e.target.value})
  }
  showReport () {
    this.setState({isShowingModal: false})
    this.props.loadSubscriberSummary({days: this.state.days})
  }
  render () {
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        {/*
          this.state.isShowingModal &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialog}>
              <div className='form-group m-form__group row' style={{padding: '30px'}}>
                <span htmlFor='example-text-input' className='col-form-label'>
                  Show records for last:&nbsp;&nbsp;
                </span>
                <div>
                  <input id='example-text-input' type='number' min='0' step='1' className='form-control' value={this.state.days !== 'all' && this.state.days} placeholder={this.state.days === 'all' && 'all'} onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
                </div>
                <span htmlFor='example-text-input' className='col-form-label'>
                &nbsp;&nbsp;days
              </span>
              </div>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={() => this.showReport()}>
                    Show Report
                  </button>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        */}
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <span>{this.state.days === 'all' ? 'Show records for' : 'Show records for last'}</span>&nbsp;&nbsp;
                  <a onClick={this.showDaysDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                    {this.state.days === 'all' ? 'All' : this.state.days}
                  </a>&nbsp;&nbsp;
                  <span className='m-nav__link-text'>
                    Days
                  </span>
                  {
                    this.state.showDaysDropDown &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <ul className='m-nav'>
                              <li key={10} className='m-nav__item'>
                                <a onClick={() => this.changeDays(10)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    Last 10
                                  </span>
                                </a>
                              </li>
                              <li key={30} className='m-nav__item'>
                                <a onClick={() => this.changeDays(30)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    Last 30
                                  </span>
                                </a>
                              </li>
                              <li key={90} className='m-nav__item'>
                                <a onClick={() => this.changeDays(90)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    Last 90
                                  </span>
                                </a>
                              </li>
                              <li key={'all'} className='m-nav__item'>
                                <a onClick={() => this.changeDays('all')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    All
                                  </span>
                                </a>
                              </li>
                              <li key={'other'} className='m-nav__item'>
                                <a onClick={() => this.changeDays('other')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    Other
                                  </span>
                                </a>
                              </li>
                              <li className='m-nav__separator m-nav__separator--fit' />
                              <li className='m-nav__item'>
                                <a onClick={() => this.hideDaysDropDown} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='row'>
              <div className='col-md-4 col-lg-4 col-sm-4'>
                <div className='m-widget1' style={{paddingTop: '1.2rem'}}>
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Subscribes</h3>
                      </div>
                      <div className='col m--align-right'>
                        <span className='m-widget1__number m--font-brand'>{this.props.subscriberSummary ? this.props.subscriberSummary.subscribes : 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Unsubscribes</h3>
                      </div>
                      <div className='col m--align-right'>
                        <span className='m-widget1__number m--font-danger'>{this.props.subscriberSummary ? this.props.subscriberSummary.unsubscribes : 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className='m-widget1__item'>
                    <div className='row m-row--no-padding align-items-center'>
                      <div className='col'>
                        <h3 className='m-widget1__title'>Net Subscribes</h3>
                      </div>
                      <div className='col m--align-right'>
                        <span className='m-widget1__number m--font-success'>{this.props.subscriberSummary ? this.props.subscriberSummary.subscribes - this.props.subscriberSummary.unsubscribes : 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-8 col-lg-8 col-sm-8'>
                {this.props.subscriberGraph.length > 0
                ? <ResponsiveContainer>
                  <AreaChart data={this.props.subscriberGraph} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis />
                    <Tooltip />
                    <Area type='monotone' dataKey='count' name='Subscribers' stroke='#82ca9d' fill='#82ca9d' />
                  </AreaChart>
                </ResponsiveContainer>
                : <center>
                  <span>No records to show for the applied filter</span>
                </center>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SubscriberSummary
