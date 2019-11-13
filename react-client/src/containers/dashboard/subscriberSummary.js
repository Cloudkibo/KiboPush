/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts'
import {loadSubscriberSummary} from '../../redux/actions/dashboard.actions'

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
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.showDaysDropDown = this.showDaysDropDown.bind(this)
    this.hideDaysDropDown = this.hideDaysDropDown.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.showReport = this.showReport.bind(this)
    this.prepareChartData = this.prepareChartData.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
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
      this.refs.report.click()
    } else {
      this.setState({days: days})
      this.props.loadSubscriberSummary({pageId: this.state.pageId, days: days})
    }
  }
  changePage (page) {
    if (page === 'all') {
      this.setState({pageId: 'all'})
      this.props.loadSubscriberSummary({pageId: 'all', days: this.state.days})
    } else {
      this.setState({pageId: page._id, selectedPage: page})
      this.props.loadSubscriberSummary({pageId: page._id, days: this.state.days})
    }
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    if(nextprops.subscriberSummary !== this.props.subscriberSummary) {
      if (nextprops.subscriberSummary && nextprops.subscriberSummary.graphdata.length > 0) {
        var data = this.includeZeroCounts(nextprops.subscriberSummary.graphdata)
        console.log('includeZeroCounts', data)
        let dataChart = this.prepareChartData(data)
        this.setState({data: dataChart})
      } else {
        this.setState({data: []})
      }
    }
  }

  componentDidMount() {
    if (this.props.subscriberSummary && this.props.subscriberSummary.graphdata.length > 0) {
      var data = this.includeZeroCounts(this.props.subscriberSummary.graphdata)
      console.log('includeZeroCounts', data)
      let dataChart = this.prepareChartData(data)
      this.setState({data: dataChart})
    } else {
      this.setState({data: []})
    }

  }
  exists (array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array.date === value) {
        return i
      }
    }
    return false
  }
  includeZeroCounts (data) {
    var dataArray = []
    // var index = 0
    // var varDate = moment()
    // for (var j = 0; j < data.length; j++) {
    //   var recordId = data[j]._id
    //   var date = `${recordId.year}-${recordId.month}-${recordId.day}`
    //   var loopDate = moment(varDate).format('YYYY-MM-DD')
    //   if (moment(date).isSame(loopDate, 'day')) {
    //     var d = {}
    //     d.date = loopDate
    //     d.count = data[j].count
    //     dataArray.push(d)
    //     varDate = moment(varDate).subtract(1, 'days')
    //     index = 0
    //     break
    //   }
    //   index++
    // }
    // if (index === data.length) {
    //   var obj = {}
    //   obj.date = varDate.format('YYYY-MM-DD')
    //   obj.count = 0
    //   dataArray.push(obj)
    //   varDate = moment(varDate).subtract(1, 'days')
    //   index = 0
    // }
    for (var j = 0; j < data.length; j++) {
      var recordId = data[j]._id
      var date = `${recordId.year}-${recordId.month}-${recordId.day}`
      let val = this.exists(dataArray, date)
      if (val === false) {
        dataArray.push({date: date, count: data[j].count})
      } else {
        dataArray[val].count = dataArray[val].count + data[j].count
      }
    }
    return dataArray.reverse()
  }
  prepareChartData (data) {
    var dataChart = []
    if (data && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var record = {}
        record.date = data[i].date
        record.count = data[i].count
        dataChart.push(record)
      }
    }
    return dataChart
  }
  onInputChange (e) {
    console.log('days:', e.target.value)
    this.setState({days: e.target.value})
  }
  showReport () {
    this.setState({isShowingModal: false})
    this.props.loadSubscriberSummary({pageId: this.state.pageId, days: this.state.days})
  }
  render () {
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <a href='#/' style={{ display: 'none' }} ref='report' data-toggle="modal" data-target="#report">report</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="report" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Show records for last ?
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
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
                  <button className='btn btn-primary' onClick={() => this.showReport()} data-dismiss='modal'>
                    Show Report
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav' style={{float: 'left'}}>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-left m-dropdown--align-push' data-dropdown-toggle='click'>
                  <span>Select Page: </span>&nbsp;&nbsp;&nbsp;
                  <a href='#/' onClick={this.showDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                    {this.state.pageId === 'all' ? 'All' : this.state.selectedPage.pageName}
                  </a>
                  {
                    this.state.showDropDown &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <ul className='m-nav'>
                              <li className='m-nav__section m-nav__section--first'>
                                <span className='m-nav__section-text'>
                                  Connected Pages
                                </span>
                              </li>
                              {
                                this.props.pages && this.props.pages.map((page, i) => (
                                  <li key={page.pageId} className='m-nav__item'>
                                    <a href='#/' onClick={() => this.changePage(page)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                      <span className='m-nav__link-text'>
                                        {page.pageName}
                                      </span>
                                    </a>
                                  </li>
                                ))
                              }
                              <li key={'all'} className='m-nav__item'>
                                <a href='#/' onClick={() => this.changePage('all')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    All
                                  </span>
                                </a>
                              </li>
                              <li className='m-nav__separator m-nav__separator--fit' />
                              <li className='m-nav__item'>
                                <a href='#/' onClick={() => this.hideDropDown} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
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
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <span>{this.state.days === 'all' ? 'Show records for' : 'Show records for last'}</span>&nbsp;&nbsp;
                  <a href='#/' onClick={this.showDaysDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
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
                                <a href='#/' onClick={() => this.changeDays(10)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    Last 10
                                  </span>
                                </a>
                              </li>
                              <li key={30} className='m-nav__item'>
                                <a href='#/' onClick={() => this.changeDays(30)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    Last 30
                                  </span>
                                </a>
                              </li>
                              <li key={90} className='m-nav__item'>
                                <a href='#/' onClick={() => this.changeDays(90)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    Last 90
                                  </span>
                                </a>
                              </li>
                              <li key={'all'} className='m-nav__item'>
                                <a href='#/' onClick={() => this.changeDays('all')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    All
                                  </span>
                                </a>
                              </li>
                              <li key={'other'} className='m-nav__item'>
                                <a href='#/' onClick={() => this.changeDays('other')} className='m-nav__link' style={{cursor: 'pointer'}}>
                                  <span className='m-nav__link-text'>
                                    Other
                                  </span>
                                </a>
                              </li>
                              <li className='m-nav__separator m-nav__separator--fit' />
                              <li className='m-nav__item'>
                                <a href='#/' onClick={() => this.hideDaysDropDown} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
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
                        <span className='m-widget1__number m--font-brand'>{this.props.subscriberSummary ? this.props.subscriberSummary.subscribes + this.props.subscriberSummary.unsubscribes : 0}</span>
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
                        <span className='m-widget1__number m--font-success'>{this.props.subscriberSummary ? this.props.subscriberSummary.subscribes: 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-8 col-lg-8 col-sm-8'>
                {this.state.data.length > 0
                ? <ResponsiveContainer>
                  <AreaChart data={this.state.data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis />
                    <Tooltip />
                    <Area type='monotone' dataKey='count' name='Subscribers' stroke='#82ca9d' fill='#82ca9d' />
                  </AreaChart>
                </ResponsiveContainer>
                : <center>
                  <span>No records to show for the applied filters</span>
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

function mapStateToProps (state) {
  console.log('in mapStateToProps for pageSubscribers!!!', state)
  return {
    subscriberSummary: (state.dashboardInfo.subscriberSummary),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadSubscriberSummary: loadSubscriberSummary
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SubscriberSummary)
