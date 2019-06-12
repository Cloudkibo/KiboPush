/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts'
import {loadAutopostingSummary} from '../../redux/actions/dashboard.actions'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import IconStack from '../../components/Dashboard/IconStackForAutoposting'

class AutopostingSummary extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      days: 'all',
      showDaysDropDown: false,
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
      this.props.loadAutopostingSummary({days: days})
    }
  }
  componentWillReceiveProps (nextprops) {
    console.log('in componentWillReceiveProps of autopostingSummary', nextprops)
    if (nextprops.subscriberSummary && nextprops.subscriberSummary.graphdata.length > 0) {
      var data = this.includeZeroCounts(nextprops.subscriberSummary.graphdata)
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
    this.props.loadAutopostingSummary({days: this.state.days})
  }
  render () {
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        {
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
        }
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
          <div className='tab-content'>
            <div className='row'>
              <div className='col-4'>
                <IconStack
                  path='/autoposting'
                  icon='flaticon-chat-1 m--font-light'
                  title='Twitter'
                  connected={this.props.autopostingSummary.twitterAutoposting}
                  received={this.props.autopostingSummary.twitterAutopostingsCame}
                  sent={this.props.autopostingSummary.twitterAutopostingsSent}
                  iconStyle='success'
                  connectedText='Accounts'
                  otherText='Tweets'
                />
                <div className='m--space-30' />
              </div>
              <div className='col-4'>
                <IconStack
                  path='/autoposting'
                  icon='flaticon-chat-1 m--font-light'
                  title='Facebook'
                  connected={this.props.autopostingSummary.facebookAutoposting}
                  received={this.props.autopostingSummary.facebookAutopostingsCame}
                  sent={this.props.autopostingSummary.facebookAutopostingsSent}
                  iconStyle='success'
                  connectedText='Pages'
                  otherText='Posts'
                />
                <div className='m--space-30' />
              </div>
              <div className='col-4'>
                <IconStack
                  path='/autoposting'
                  icon='flaticon-chat-1 m--font-light'
                  title='Wordpress'
                  connected={this.props.autopostingSummary.wordpressAutoposting}
                  received={this.props.autopostingSummary.wordpressAutopostingsCame}
                  sent={this.props.autopostingSummary.wordpressAutopostingsSent}
                  iconStyle='success'
                  connectedText='Channels'
                  otherText='Posts'
                />
                <div className='m--space-30' />
              </div>
              <div className='col-8'>
                {/*this.props.sentSeenGraph.length > 0
                ? <LineChart width={600} height={300} data={this.props.sentSeenGraph}>
                  <XAxis dataKey='date' />
                  <YAxis />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Tooltip />
                  <Legend />
                  {
                    url.includes('kiboengage.cloudkibo.com') &&
                    <Line type='monotone' dataKey='count' name='Broadcasts' stroke='#8884d8' activeDot={{r: 8}} />
                  }
                  {
                    url.includes('kibochat.cloudkibo.com') &&
                    <Line type='monotone' dataKey='count' name='Sessions' stroke='#A11644' activeDot={{r: 8}} />
                  }
                </LineChart>
                : <span>No records to show for the applied filter</span>
              */}
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
  return {
    autopostingSummary: (state.dashboardInfo.autopostingSummary),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadAutopostingSummary: loadAutopostingSummary
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AutopostingSummary)
