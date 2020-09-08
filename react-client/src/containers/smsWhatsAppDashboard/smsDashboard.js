
/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import CardBoxesContainer from '../../components/smsWhatsAppDashboard/cardboxes'
import SubscriberSummary from '../../components/smsWhatsAppDashboard/subscriberSummary'
import SentSeen from '../../components/smsWhatsAppDashboard/sentSeen'
import { loadCardBoxesDataSms, loadSubscriberSummarySms, loadSentSeenSms } from '../../redux/actions/smsDashboard.actions'
import { joinRoom } from '../../utility/socketio'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { RingLoader } from 'halogenium'

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      subscriberGraph: [],
      sentSeenGraph: [],
      loading: true
    }
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.prepareChartData = this.prepareChartData.bind(this)
  }

  UNSAFE_componentWillMount () {
    this.props.loadCardBoxesDataSms()
    this.props.loadSentSeenSms({days: 30})
    this.props.loadSubscriberSummarySms({days: 'all'})
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    if (nextprops.user) {
      joinRoom(nextprops.user.companyId)
    }
    if (nextprops.cardBoxesData && nextprops.subscriberSummary && nextprops.sentSeenData) {
      this.setState({loading: false})
    }
    if (nextprops.subscriberSummary && nextprops.subscriberSummary.graphdata.length > 0) {
      var data = this.includeZeroCounts(nextprops.subscriberSummary.graphdata)
      let dataChart = this.prepareChartData(data)
      this.setState({subscriberGraph: dataChart})
    } else {
      this.setState({subscriberGraph: []})
    }
    if (nextprops.sentSeenData && nextprops.sentSeenData.graphdata.length > 0) {
      var data1 = this.includeZeroCounts(nextprops.sentSeenData.graphdata)
      let dataChart1 = this.prepareChartData(data1)
      this.setState({sentSeenGraph: dataChart1})
    } else {
      this.setState({sentSeenGraph: []})
    }
  }
  includeZeroCounts (data) {
    var dataArray = []
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
  exists (array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array.date === value) {
        return i
      }
    }
    return false
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
  componentDidMount () {
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
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
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
          <AlertContainer ref={a => this.msg = a} {...alertOptions} />
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding dashboard? Here is the <a href='https://kibopush.com/twilio/' target='_blank' rel='noopener noreferrer'>documentation</a>.
            </div>
          </div>
          {this.state.loading
          ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
          : <div>
            <div className='row'>
              <CardBoxesContainer cardBoxesData={this.props.cardBoxesData} platform='sms' />
            </div>
            <div className='row'>
              <SubscriberSummary
                loadSubscriberSummary={this.props.loadSubscriberSummarySms}
                platform='sms'
                subscriberSummary={this.props.subscriberSummary}
                subscriberGraph={this.state.subscriberGraph}
                 />
            </div>
            <div className='row'>
              <SentSeen
                loadSentSeen={this.props.loadSentSeenSms}
                platform='sms'
                sentSeenData={this.props.sentSeenData}
                sentSeenGraph={this.state.sentSeenGraph}
                 />
            </div>
          </div>
        }
        </div>
      </div>
    )
  }
  }

function mapStateToProps (state) {
  return {
    cardBoxesData: (state.smsWhatsAppDashboardInfo.cardBoxesData),
    user: (state.basicInfo.user),
    subscriberSummary: (state.smsWhatsAppDashboardInfo.subscriberSummary),
    sentSeenData: (state.smsWhatsAppDashboardInfo.sentSeenData),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadCardBoxesDataSms,
      loadSubscriberSummarySms,
      loadSentSeenSms
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
