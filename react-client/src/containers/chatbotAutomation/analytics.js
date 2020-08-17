import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAnalytics, downloadAnalytics } from '../../redux/actions/chatbotAutomation.actions'
import BACKBUTTON from '../../components/extras/backButton'
import LIFETIMESTATISTICS from '../../components/chatbotAutomation/lifeTimeStatistics'
import PERIODICSTATISTICS from '../../components/chatbotAutomation/periodicStatistics'
import AlertContainer from 'react-alert'
import fileDownload from 'js-file-download'
var json2csv = require('json2csv')

class Analytics extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      chatbot: props.location.state.chatbot,
      periodicAnalytics: '',
      days: '30'
    }
    this.handleAnalytics = this.handleAnalytics.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.onBack = this.onBack.bind(this)
    this.exportRecords = this.exportRecords.bind(this)
    this.prepareExportData = this.prepareExportData.bind(this)
  }

  onDaysChange (e) {
    var value = e.target.value
    this.setState({days: value})
    if (value && value !== '' && parseInt(value) !== 0) {
      this.props.fetchAnalytics(this.props.location.state.chatbot._id, parseInt(value), this.handleAnalytics)
    }
  }

  prepareExportData (res) {
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
          this.msg.success('Data Dowloaded Successfully')
        }
      })
    } else {
        this.msg.error('Failed to download the data')
    }
  }

  exportRecords() {
    this.props.downloadAnalytics({pageName: this.props.location.state.page.pageName, chatBotId: this.state.chatbot._id}, this.prepareExportData)
    this.msg.info('DOWNLOADING DATA.... YOU WILL BE NOTIFIED WHEN IT IS DOWNLOADED.')
  }

  componentDidMount () {
    this.props.fetchAnalytics(this.props.location.state.chatbot._id, parseInt(this.state.days), this.handleAnalytics)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
    document.title = 'KiboChat | Configure ChatBot'

    var addScript = document.createElement('script')
    addScript.setAttribute('type', 'text/javascript')
    addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/custom/components/base/toastr.js')
    addScript.type = 'text/javascript'
    document.body.appendChild(addScript)

    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    /* eslint-enable */
  }

  handleAnalytics (res) {
    if (res.status === 'success') {
      this.setState({periodicAnalytics: res.payload, loading: false})
    } else {
      this.setState({loading: false})
    }
  }

  onBack() {
    this.props.history.push({
      pathname: this.props.location.state.backUrl,
      state: {chatbot: this.props.location.state.chatbot, page: this.props.location.state.page}
    })
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
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
        {
          this.state.loading
          ? <div id='_chatbot_please_wait' style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
            <div className="m-loader m-loader--brand" style={{width: "30px", display: "inline-block"}} ></div>
            <span className='m--font-brand'>Please wait...</span>
          </div>
          : <div id='_chatbot_main_container'>
          <div className='m-subheader '>
            <div className='d-flex align-items-center'>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>{this.props.location.state.page.pageName} Chat Bot Analytics</h3>
              </div>
            </div>
          </div>
          <div className='m-content'>
            <LIFETIMESTATISTICS
              triggerWordsMatched={this.state.chatbot.stats ? this.state.chatbot.stats.triggerWordsMatched : 0}
              newSubscribers={this.state.chatbot.stats ? this.state.chatbot.stats.newSubscribers : 0}
            />
            <PERIODICSTATISTICS
              newSubscribersCount={this.state.periodicAnalytics.newSubscribers ? this.state.periodicAnalytics.newSubscribers : 0}
              triggerWordsMatched={this.state.periodicAnalytics.triggerWordsMatched ? this.state.periodicAnalytics.triggerWordsMatched : 0}
              urlBtnClickedCount={this.state.periodicAnalytics.urlBtnClickedCount ? this.state.periodicAnalytics.urlBtnClickedCount : 0}
              sentCount={this.state.periodicAnalytics.sentCount ? this.state.periodicAnalytics.sentCount : 0}
              returningSubscribers={this.state.periodicAnalytics.returningSubscribers ? this.state.periodicAnalytics.returningSubscribers : 0}
              days={this.state.days}
              onDaysChange={this.onDaysChange}
            />
          </div>
          <div className='m-form m-form--label-align-right m--margin-bottom-30' style= {{marginRight: '50px'}}>
            <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportRecords}>
              <span>
                <i className='fa fa-download' />
                <span>
                  Export Records in CSV File
                </span>
              </span>
            </button>
          </div>
            <BACKBUTTON
              onBack={this.onBack}
              position='bottom-left'
            />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAnalytics,
    downloadAnalytics
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Analytics)
