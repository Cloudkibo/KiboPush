import React from 'react'
import PropTypes from 'prop-types'
import { getStartEndDates, validDateRange } from '../../utility/utils'
import moment from 'moment'

class Tabs extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDaysDropDown: false,
      dateRangeWarning: '',
      rangeStart: '',
      rangeEnd: ''
    }
    this.updateTab = this.updateTab.bind(this)
    this.getDateLabel = this.getDateLabel.bind(this)
    this.toggleDropDown = this.toggleDropDown.bind(this)
    this.changeDateTo = this.changeDateTo.bind(this)
    this.changeDateFrom = this.changeDateFrom.bind(this)
    this.applyDateRange = this.applyDateRange.bind(this)
  }

  applyDateRange () {
      this.refs.range.click()
      this.props.fetchWidgetAnalytics({startDate: this.state.rangeStart, endDate: this.state.rangeEnd, widgetType: this.props.widgetType, selectedDate: 'custom'})
  }

  changeDateTo (e) {
    this.setState({
      rangeEnd: e.target.value,
    })
    let {dateRangeWarning} = validDateRange(this.state.rangeStart, e.target.value)
    this.setState({dateRangeWarning})
  }

  changeDateFrom (e) {
    this.setState({
      rangeStart: e.target.value
    })
    let {dateRangeWarning} = validDateRange(e.target.value, this.state.rangeEnd)
    this.setState({dateRangeWarning})
  }

  applyDate (value) {
    if (value !== 'custom') {
      let {startDate, endDate} = getStartEndDates(value)
      this.props.fetchWidgetAnalytics({startDate, endDate, widgetType: this.props.widgetType, selectedDate: value})
    } else {
      this.refs.range.click()
    }
    this.toggleDropDown()
  }

  toggleDropDown () {
    this.setState({showDaysDropDown: !this.state.showDaysDropDown})
  }

  updateTab (tab) {
    this.props.updateState({currentTab: tab})
  }

  getDateLabel () {
    if (this.props.selectedDate !== 'custom') {
      return `Last ${this.props.selectedDate} days`
    } else {
      let startDate = new Date(this.props.startDate)
      let endDate = new Date(this.props.endDate)
      const startMonth = startDate.toLocaleString('default', { month: 'short' })
      const endMonth = endDate.toLocaleString('default', { month: 'short' })
      const startDay = this.props.startDate.split('-')[2]
      const endDay = this.props.endDate.split('-')[2]
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
    }
  }

  render () {
    return (
      <div className='m-portlet__head'>
        <a href='#/' style={{ display: 'none' }} ref='range' data-toggle="modal" data-target="#range" data-backdrop='static' data-keyboard='false'>range</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="range" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Button Clicks
                  </h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
                      </span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                  <div className='form-row'>
                  <div className='col-md-12' style={{ display: 'inherit' }}>
                    <span style={{marginTop: '7px', marginRight: '10px'}}>From:</span>
                    <div className='col-md-5'>
                      <input className='form-control m-input'
                        onChange={(e) => this.changeDateFrom(e)}
                        value={this.state.rangeStart}
                        id='text'
                        placeholder='Value'
                        max= {moment().format('YYYY-MM-DD')}
                        type='date'/>
                    </div>
                    <span style={{marginTop: '7px', marginLeft: '10px',marginRight: '10px'}}>To:</span>
                      <div className='col-md-5'>
                        <input className='form-control m-input'
                          onChange={(e) => this.changeDateTo(e)}
                          value={this.state.rangeEnd}
                          id='text'
                          placeholder='Value'
                          max= {moment().format('YYYY-MM-DD')}
                          type='date'/>
                      </div>
                  </div>
                </div>
                <br/>
                { this.state.dateRangeWarning !== '' && <span style={{color: '#ffb822'}}className='m-form__help'>
                  {this.state.dateRangeWarning}
                </span> }
                <div style={{textAlign: 'center', paddingTop: '30px'}}>
                    <button disabled={this.state.dateRangeWarning || !this.state.rangeEnd || !this.state.rangeStart} className='btn btn-primary' onClick={() => this.applyDateRange()}>
                      Apply
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-portlet__head-tools'>
          <ul className='nav nav-tabs m-tabs m-tabs-line m-tabs-line--left m-tabs-line--primary'
            role='tablist' style={{cursor: 'pointer'}}>
            <li className='nav-item m-tabs__item' onClick={() => this.updateTab('settings')}>
              <span className={`nav-link m-tabs__link ${this.props.currentTab === 'settings' && 'active'}`}>
              Settings
            </span>
            </li>
            {this.props.showMessageLogs &&
            <li className='nav-item m-tabs__item' onClick={() => this.updateTab('messageLogs')}>
              <span className={`nav-link m-tabs__link ${this.props.currentTab === 'messageLogs' && 'active'}`}>
              Message Logs
            </span>
            </li>
            }
            {this.props.showAnalytics &&
            <li className='nav-item m-tabs__item' onClick={() => this.updateTab('analytics')}>
              <span className={`nav-link m-tabs__link ${this.props.currentTab === 'analytics' && 'active'}`}>
              Analytics
            </span>
            </li>
            }
          </ul>
            <ul className='nav nav-tabs m-tabs m-tabs-line m-tabs-line--right m-tabs-line--primary'>
              {this.props.showViewInStore &&
                <li className='nav-item m-tabs__item'>
                  <a href={this.props.storeUrl} target='_blank' rel='noopener noreferrer'
                    className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                    style={{marginTop: '12px', color: 'white'}}>
                    <span>
                      <i className='fa fa-external-link' />
                      <span>
                            View in Store
                          </span>
                    </span>
                </a>
                </li>
              }
              {this.props.showSave &&
                <li className='nav-item m-tabs__item'>
                  <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                  style={{marginTop: '12px'}} onClick={this.props.onSave}>
                      Save
                </button>
                </li>
              }
            </ul>
            {this.props.showDateFilter &&
            <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <a href='#/' onClick={this.toggleDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                    {this.getDateLabel()}
                  </a>
                  {
                    this.state.showDaysDropDown &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <ul className='m-nav'>
                              <li key={10} className='m-nav__item'>
                                <button onClick={() => this.applyDate('10')} className='m-nav__link' style={{cursor: 'pointer', border: 'none', background: 'none'}}>
                                  <span className='m-nav__link-text'>
                                    Last 10 days
                                  </span>
                                </button>
                              </li>
                              <li key={30} className='m-nav__item'>
                                <button onClick={() => this.applyDate('30')} className='m-nav__link' style={{cursor: 'pointer', border: 'none', background: 'none'}}>
                                  <span className='m-nav__link-text'>
                                    Last 30 days
                                  </span>
                                </button>
                              </li>
                              <li key={90} className='m-nav__item'>
                                <button onClick={() => this.applyDate('90')} className='m-nav__link' style={{cursor: 'pointer', border: 'none', background: 'none'}}>
                                  <span className='m-nav__link-text'>
                                    Last 90 days
                                  </span>
                                </button>
                              </li>
                              <li key={'custom'} className='m-nav__item'>
                                <button onClick={() => this.applyDate('custom')} className='m-nav__link' style={{cursor: 'pointer', border: 'none', background: 'none'}}>
                                  <span className='m-nav__link-text'>
                                    Custom Range
                                  </span>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </li>
              </ul>
            }
        </div>
      </div>
    )
  }
}

Tabs.propTypes = {
  'currentTab': PropTypes.string.isRequired,
  'updateState': PropTypes.func.isRequired,
  'onSave': PropTypes.func.isRequired,
  'showSave': PropTypes.bool,
  'showMessageLogs': PropTypes.bool,
  'showViewInStore': PropTypes.bool,
  'showAnalytics': PropTypes.bool,
  'storeUrl': PropTypes.string,
  'startDate': PropTypes.string,
  'endDate': PropTypes.string,
  'showDateFilter': PropTypes.bool,
  'fetchWidgetAnalytics': PropTypes.func,
}

export default Tabs
