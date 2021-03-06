import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAnalytics, downloadAnalytics } from '../../redux/actions/chatbotAutomation.actions'
import LIFETIMESTATISTICS from '../../components/chatbotAutomation/lifeTimeStatistics'
import PERIODICSTATISTICS from '../../components/chatbotAutomation/periodicStatistics'
import AlertContainer from 'react-alert'
import fileDownload from 'js-file-download'
var json2csv = require('json2csv')

class Analytics extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            store: this.props.location.state.store,
            triggers: this.props.location.state.triggers,
            chatbot: this.props.location.state.chatbot,
            page: this.props.location.state.page,
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
            this.props.fetchAnalytics(this.state.chatbot._id, parseInt(value), this.handleAnalytics)
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
        this.props.downloadAnalytics({ chatBotId: this.state.chatbot._id }, this.prepareExportData)
        this.msg.info('DOWNLOADING DATA.... YOU WILL BE NOTIFIED WHEN IT IS DOWNLOADED.')
    }

    componentDidMount() {
        this.props.fetchAnalytics(this.state.chatbot._id, parseInt(this.state.days), this.handleAnalytics)
        document.title = 'KiboChat | Commerce Chatbot Analytics'
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
            pathname: '/configureCommerceChatbot',
            state: { chatbot: this.state.chatbot, page: this.state.page, store: this.state.store, triggers: this.state.triggers }
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
                                        <h3 className='m-subheader__title'>Commerce Chatbot Analytics for {this.state.page.pageName}</h3>
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
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAnalytics,
        downloadAnalytics
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Analytics)
