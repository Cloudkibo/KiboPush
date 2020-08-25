import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAnalytics } from '../../redux/actions/whatsAppChatbot.actions'
import LIFETIMESTATISTICS from '../../components/chatbotAutomation/lifeTimeStatistics'
import PERIODICSTATISTICS from '../../components/chatbotAutomation/periodicStatistics'
import AlertContainer from 'react-alert'
import fileDownload from 'js-file-download'
var json2csv = require('json2csv')

class Analytics extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: false,
      periodicAnalytics: '',
      days: '30'
    }
    this.handleAnalytics = this.handleAnalytics.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.onBack = this.onBack.bind(this)
    this.exportRecords = this.exportRecords.bind(this)
    this.prepareExportData = this.prepareExportData.bind(this)
  }

  onDaysChange(e) {
    var value = e.target.value
    this.setState({ days: value })
    if (value && value !== '' && parseInt(value) !== 0) {
      this.props.fetchAnalytics(this.props.chatbot._id, parseInt(value), this.handleAnalytics)
    }
  }

  prepareExportData(res) {
    let self = this
    if (res.status === 'success') {
      var blocksData = res.payload
      var info = blocksData
      var keys = []
      var val = info[0]

      for (var j in val) {
        var subKey = j
        keys.push(subKey)
      }
      json2csv({ data: info, fields: keys }, function (err, csv) {
        if (err) {
        } else {
          fileDownload(csv, 'BlockData.csv')
          self.msg.success('Data Dowloaded Successfully')
        }
      })
    } else {
      this.msg.error('Failed to download the data')
    }
  }

  exportRecords() {
    this.props.downloadAnalytics({ chatBotId: this.props.chatbot._id }, this.prepareExportData)
    this.msg.info('DOWNLOADING DATA.... YOU WILL BE NOTIFIED WHEN IT IS DOWNLOADED.')
  }

  componentDidMount() {
    this.props.fetchAnalytics(this.props.chatbot._id, parseInt(this.state.days), this.handleAnalytics)
    document.title = 'KiboChat | WhatsApp Chatbot Analytics'
  }

  handleAnalytics(res) {
    if (res.status === 'success') {
      this.setState({ periodicAnalytics: res.payload, loading: false })
    } else {
      this.setState({ loading: false })
    }
  }

  onBack() {
    this.props.history.push({
      pathname: '/whatsAppChatbot'
    })
  }

  render() {
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
        {
          this.state.loading
            ? <div id='_chatbot_please_wait' style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
              <div className="m-loader m-loader--brand" style={{ width: "30px", display: "inline-block" }} ></div>
              <span className='m--font-brand'>Please wait...</span>
            </div>
            : <div id='_chatbot_main_container'>
              <div className='m-subheader '>

                <button
                  style={{ marginLeft: '20px', marginTop: '5px' }}
                  type='button'
                  className='btn btn-primary pull-right m-btn m-btn--icon'
                  onClick={this.onBack}
                >
                  <span>
                    <i className="la la-arrow-left" />
                    <span>Back</span>
                  </span>
                </button>
                {/* <button style={{ marginTop: '5px' }} className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportRecords}>
                  <span>
                    <i className='fa fa-download' />
                    <span>
                      Export Records in CSV File
                    </span>
                  </span>
                </button> */}

                <div className='d-flex align-items-center'>
                  <div className='mr-auto'>
                    <h3 className='m-subheader__title'>Chatbot Analytics</h3>
                  </div>
                </div>
              </div>
              <div className='m-content'>

                <LIFETIMESTATISTICS
                  triggerWordsMatched={this.props.chatbot.stats ? this.props.chatbot.stats.triggerWordsMatched : 0}
                  newSubscribers={this.props.chatbot.stats ? this.props.chatbot.stats.newSubscribers : 0}
                />
                <PERIODICSTATISTICS
                  newSubscribersCount={this.state.periodicAnalytics.newSubscribers ? this.state.periodicAnalytics.newSubscribers : 0}
                  triggerWordsMatched={this.state.periodicAnalytics.triggerWordsMatched ? this.state.periodicAnalytics.triggerWordsMatched : 0}
                  sentCount={this.state.periodicAnalytics.sentCount ? this.state.periodicAnalytics.sentCount : 0}
                  returningSubscribers={this.state.periodicAnalytics.returningSubscribers ? this.state.periodicAnalytics.returningSubscribers : 0}
                  days={this.state.days}
                  onDaysChange={this.onDaysChange}
                />
              </div>
            </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    chatbot: (state.whatsAppChatbot.chatbot),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAnalytics
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Analytics)
