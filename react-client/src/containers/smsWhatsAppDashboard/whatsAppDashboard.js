
/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import CardBoxesContainer from '../../components/smsWhatsAppDashboard/cardboxes'
import SubscriberSummary from '../../components/smsWhatsAppDashboard/subscriberSummary'
import SentSeen from '../../components/smsWhatsAppDashboard/sentSeen'
import WhatsAppMetrics from './whatsAppMetrics'
import { loadCardBoxesDataWhatsApp, loadSubscriberSummaryWhatsApp, loadSentSeenWhatsApp, loadMetrics } from '../../redux/actions/whatsAppDashboard.actions'
import { loadWhatsAppContactsList, loadContactsList } from '../../redux/actions/uploadContacts.actions'
import { bindActionCreators } from 'redux'
import { RingLoader } from 'halogenium'
import { joinRoom } from '../../utility/socketio'

class Dashboard extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      subscriberGraph: [],
      sentSeenGraph: [],
      loading: true,
      startDate: '',
      endDate: ''
    }
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.prepareChartData = this.prepareChartData.bind(this)
  }

  UNSAFE_componentWillMount() {
    this.props.loadCardBoxesDataWhatsApp()
    this.props.loadContactsList({ last_id: 'none', number_of_records: 10, first_page: 'first' })
    this.props.loadWhatsAppContactsList({ last_id: 'none', number_of_records: 10, first_page: 'first' })
    this.props.loadSubscriberSummaryWhatsApp({ days: 'all' })
    window.location.hostname.includes('kiboengage.cloudkibo.com')
    if (window.location.hostname.includes('kiboengage.cloudkibo.com') || window.location.hostname.includes('localhost')) {
      this.props.loadSentSeenWhatsApp({ days: 30 })
    } else if (window.location.hostname.includes('kibochat.cloudkibo.com')) {
      let endDate = new Date()
      let startDate = new Date(
        (endDate.getTime() - (30 * 24 * 60 * 60 * 1000)))

      let startMonth = ('0' + (startDate.getMonth() + 1)).slice(-2)
      let startDay = ('0' + startDate.getDate()).slice(-2)
      let finalStartDate = `${startDate.getFullYear()}-${startMonth}-${startDay}`

      let endMonth = ('0' + (endDate.getMonth() + 1)).slice(-2)
      let endDay = ('0' + endDate.getDate()).slice(-2)
      let finalEndDate = `${endDate.getFullYear()}-${endMonth}-${endDay}`
      this.setState({ startDate: finalStartDate, endDate: finalEndDate })
      this.props.loadMetrics({ startDate: finalStartDate, endDate: finalEndDate })
    }
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.user) {
      joinRoom(nextprops.user.companyId)
    }
    if (nextprops.cardBoxesData && nextprops.subscriberSummary && (nextprops.sentSeenData || nextprops.metrics)) {
      this.setState({ loading: false })
    }
    if (nextprops.subscriberSummary && nextprops.subscriberSummary.graphdata.length > 0) {
      var data = this.includeZeroCounts(nextprops.subscriberSummary.graphdata)
      let dataChart = this.prepareChartData(data)
      this.setState({ subscriberGraph: dataChart })
    } else {
      this.setState({ subscriberGraph: [] })
    }
    if (nextprops.sentSeenData && nextprops.sentSeenData.graphdata.length > 0) {
      var data1 = this.includeZeroCounts(nextprops.sentSeenData.graphdata)
      let dataChart1 = this.prepareChartData(data1)
      this.setState({ sentSeenGraph: dataChart1 })
    } else {
      this.setState({ sentSeenGraph: [] })
    }
  }
  includeZeroCounts(data) {
    var dataArray = []
    for (var j = 0; j < data.length; j++) {
      var recordId = data[j]._id
      var date = `${recordId.year}-${recordId.month}-${recordId.day}`
      let val = this.exists(dataArray, date)
      if (val === false) {
        dataArray.push({ date: date, count: data[j].count })
      } else {
        dataArray[val].count = dataArray[val].count + data[j].count
      }
    }
    return dataArray.reverse()
  }
  exists(array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array.date === value) {
        return i
      }
    }
    return false
  }
  prepareChartData(data) {
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
  render() {
    const url = window.location.hostname
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Dashboard</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding dashboard? Here is the <a href='https://kibopush.com/whatsapp/' target='_blank' rel='noopener noreferrer'>documentation</a>.
            </div>
          </div>
          {this.state.loading
            ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
            : <div>
              <div className='row'>
                <CardBoxesContainer cardBoxesData={this.props.cardBoxesData} platform='whatsApp' />
              </div>
              <div className='row'>
                <SubscriberSummary
                  loadSubscriberSummary={this.props.loadSubscriberSummaryWhatsApp}
                  platform='whatsApp'
                  subscriberSummary={this.props.subscriberSummary}
                  subscriberGraph={this.state.subscriberGraph}
                />
              </div>
              <div className='row'>
                {url.includes('kibochat.cloudkibo.com')
                  ? <WhatsAppMetrics
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    metrics={this.props.metrics}
                    loadMetrics={this.props.loadMetrics}
                    showToggle={false}
                    showMetrics={true}
                  />
                  : url.includes('kiboengage.cloudkibo.com') &&
                  <SentSeen
                    loadSentSeen={this.props.loadSentSeenWhatsApp}
                    platform='whatsApp'
                    sentSeenData={this.props.sentSeenData}
                    sentSeenGraph={this.state.sentSeenGraph}
                  />
                }
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    cardBoxesData: (state.smsWhatsAppDashboardInfo.cardBoxesData),
    user: (state.basicInfo.user),
    subscriberSummary: (state.smsWhatsAppDashboardInfo.subscriberSummary),
    sentSeenData: (state.smsWhatsAppDashboardInfo.sentSeenData),
    automated_options: (state.basicInfo.automated_options),
    contacts: (state.contactsInfo.contacts),
    metrics: (state.smsWhatsAppDashboardInfo.metrics)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadCardBoxesDataWhatsApp,
      loadSubscriberSummaryWhatsApp,
      loadSentSeenWhatsApp,
      loadContactsList,
      loadWhatsAppContactsList,
      loadMetrics
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
