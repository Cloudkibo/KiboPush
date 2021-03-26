import React from 'react'
import { connect } from 'react-redux'
import { fetchSummarisedAnalytics, fetchAbandonedCartAnalytics, fetchDetailedAnalytics, fetchCODAnalytics} from '../../../redux/actions/superNumber.actions'
import { bindActionCreators } from 'redux'
import { RingLoader } from 'halogenium'
import CardBoxes from './cardBoxes'
import PeriodicAnalytics from './periodicAnalytics.js'
import AbandonedCart from './abandonedCart.js'
import CashOnDelivery from './cashOnDelivery.js'
import moment from 'moment'
import { validDateRange } from '../../../utility/utils'

class Dashboard extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      loading: true,
      startDate: '',
      endDate: '',
      selectedDate: '30',
      automated: true,
      dateRangeWarning: '',
      rangeStart: '',
      rangeEnd: ''
    }
    this.toggleDropDown = this.toggleDropDown.bind(this)
    this.applyDate = this.applyDate.bind(this)
    this.getDateLabel = this.getDateLabel.bind(this)
    this.getStartEndDates = this.getStartEndDates.bind(this)
    this.setAutomated = this.setAutomated.bind(this)
    this.changeDateTo = this.changeDateTo.bind(this)
    this.changeDateFrom = this.changeDateFrom.bind(this)
    this.applyDateRange = this.applyDateRange.bind(this)
  }

  applyDateRange () {
    this.setState({selectedDate: 'custom', loading: true, startDate: this.state.rangeStart, endDate: this.state.rangeEnd}, () => {
      this.refs.range.click()
      this.props.fetchSummarisedAnalytics({startDate: this.state.startDate, endDate: this.state.endDate})
      this.props.fetchDetailedAnalytics({startDate: this.state.startDate, endDate: this.state.endDate, automated: this.state.automated})
    })
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

  setAutomated (e) {
    this.setState({automated: !this.state.automated})
    this.props.fetchDetailedAnalytics({startDate: this.state.startDate, endDate: this.state.endDate, automated: !this.state.automated})
  }

  getDateLabel () {
    if (this.state.selectedDate !== 'custom') {
      return `Last ${this.state.selectedDate} days`
    } else {
      let startDate = new Date(this.state.startDate)
      let endDate = new Date(this.state.endDate)
      const startMonth = startDate.toLocaleString('default', { month: 'short' })
      const endMonth = endDate.toLocaleString('default', { month: 'short' })
      const startDay = this.state.startDate.split('-')[2]
      const endDay = this.state.endDate.split('-')[2]
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
    }
  }

  toggleDropDown () {
    this.setState({showDropDown: !this.state.showDropDown})
  }

  UNSAFE_componentWillMount() {
    let {startDate, endDate} = this.getStartEndDates(parseInt(this.state.selectedDate))
    this.setState({startDate: startDate, endDate: endDate})
    this.props.fetchSummarisedAnalytics({startDate: startDate, endDate: endDate})
    this.props.fetchDetailedAnalytics({startDate: startDate, endDate: endDate, automated: this.state.automated})
    this.props.fetchCODAnalytics({startDate: startDate, endDate: endDate})
    this.props.fetchAbandonedCartAnalytics({startDate: startDate, endDate: endDate})
  }

  getStartEndDates (value) {
    let endDate = new Date()
    let startDate = new Date(
      (endDate.getTime() - (value * 24 * 60 * 60 * 1000)))

    let startMonth = ('0' + (startDate.getMonth() + 1)).slice(-2)
    let startDay = ('0' + startDate.getDate()).slice(-2)
    let finalStartDate = `${startDate.getFullYear()}-${startMonth}-${startDay}`

    let endMonth = ('0' + (endDate.getMonth() + 1)).slice(-2)
    let endDay = ('0' + endDate.getDate()).slice(-2)
    let finalEndDate = `${endDate.getFullYear()}-${endMonth}-${endDay}`
    return {startDate: finalStartDate, endDate: finalEndDate}
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.summarisedAnalytics && nextprops.detailedAnalytics) {
      this.setState({loading: false})
    }
  }
  componentDidMount() {
    if (this.props.location && this.props.location.state && this.props.location.state.loadScript) {
      // TODO We need to correct this in future.
      window.location.reload()
    }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Dashboard`
  }
  applyDate (e) {
    if (e.target.value !== 0) {
      let {startDate, endDate} = this.getStartEndDates(e.target.value)
      this.setState({startDate: startDate, endDate: endDate, selectedDate: e.target.value.toString(), loading: true})
      this.props.fetchSummarisedAnalytics({startDate: startDate, endDate: endDate})
      this.props.fetchDetailedAnalytics({startDate: startDate, endDate: endDate, automated: this.state.automated})
      this.props.fetchCODAnalytics({startDate: startDate, endDate: endDate})
      this.props.fetchAbandonedCartAnalytics({startDate: startDate, endDate: endDate})
    } else {
      this.refs.range.click()
    }
    this.toggleDropDown()
  }
  render() {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <a href='#/' style={{ display: 'none' }} ref='range' data-toggle="modal" data-target="#range" data-backdrop='static' data-keyboard='false'>range</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="range" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Dashboard
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
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Dashboard</h3>
            </div>
            <div>
              <span className="m-subheader__daterange" id="m_dashboard_daterangepicker" onClick={this.toggleDropDown}>
                <span className="m-subheader__daterange-label">
                  <span className="m-subheader__daterange-title"></span>
                  <span className="m-subheader__daterange-date m--font-brand">{this.getDateLabel()}</span>
                </span>
                <a href='#/' className="btn btn-sm btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill">
                  <i className="la la-angle-down"></i>
                </a>
              </span>
              {this.state.showDropDown &&
              <div className="daterangepicker dropdown-menu ltr opensleft" style={{display: 'block', top: '142px', right: '29.9999px', left: 'auto', marginTop: '8px', border: 'none'}}>
                <div className="ranges">
                  <ul onClick={this.applyDate}>
                    <li data-range-key="7" className={this.state.selectedDate === '7' ? 'active' : ''} value={'7'} onClick={this.applyDate}>Last 7 days</li>
                    <li data-range-key="30" value={'30'} className={this.state.selectedDate === '30' ? 'active' : ''}>Last 30 days</li>
                    <li data-range-key="90" value={'90'} className={this.state.selectedDate === '90' ? 'active' : ''}>Last 90 days</li>
                    <li data-range-key="custom" value={'custom'} className={this.state.selectedDate === 'custom' ? 'active' : ''}>Custom Range</li>
                  </ul>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className='m-content'>
          {this.state.loading
            ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
            : <div>
              <div className='row'>
                <CardBoxes
                  contacts={this.props.summarisedAnalytics && this.props.summarisedAnalytics.contacts}
                  automatedMessages={this.props.summarisedAnalytics && this.props.summarisedAnalytics.automated}
                  manualMessages={this.props.summarisedAnalytics && this.props.summarisedAnalytics.manual}
                />
              </div>
              <div className='row'>
                <PeriodicAnalytics
                  setAutomated={this.setAutomated}
                  automated={this.state.automated}
                  confirmationCount={this.props.detailedAnalytics && this.props.detailedAnalytics.confirmationCount}
                  codCount={this.props.detailedAnalytics && this.props.detailedAnalytics.codCount}
                  shipmentCount={this.props.detailedAnalytics && this.props.detailedAnalytics.shipmentCount}
                  abandonedCount={this.props.detailedAnalytics && this.props.detailedAnalytics.abandonedCount}
                  graphDatas={this.props.detailedAnalytics && this.props.detailedAnalytics.graphDatas}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                />
              </div>
              {this.props.abandonedCartAnalytics &&
                <div className='row'>
                  <AbandonedCart
                    cartsRecovered={this.props.abandonedCartAnalytics.cartsRecovered}
                    recoveryRate={`${this.props.abandonedCartAnalytics.recoveryRate}%`}
                    orderValueRecovered={`${this.props.abandonedCartAnalytics.currency} ${this.props.abandonedCartAnalytics.orderValueRecovered}`}
                  />
                </div>
              }
              {this.props.codAnalytics &&
                <div className='row'>
                  <CashOnDelivery
                    ordersPlaced={this.props.codAnalytics.ordersPlaced}
                    ordersConfirmed={this.props.codAnalytics.confirmed}
                    ordersCancelled={this.props.codAnalytics.cancelled}
                    noResponse={this.props.codAnalytics.noResponse}
                    messagesSent={this.props.codAnalytics.messagesSent}
                  />
                </div>
              }
            </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    summarisedAnalytics: (state.superNumberInfo.summarisedAnalytics),
    detailedAnalytics: (state.superNumberInfo.detailedAnalytics),
    codAnalytics: (state.superNumberInfo.codAnalytics),
    abandonedCartAnalytics: (state.superNumberInfo.abandonedCartAnalytics)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchSummarisedAnalytics,
      fetchDetailedAnalytics,
      fetchAbandonedCartAnalytics,
      fetchCODAnalytics
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
