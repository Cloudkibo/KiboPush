/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { fetchSmsAnalytics, clearSendersInfo, smsDeliveryEvent, saveCurrentSmsBroadcast, smsResponseEvent, updateSmsAnalytics } from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'
import BACKBUTTON from '../../components/extras/backButton'
import { cloneDeep } from 'lodash'

class ViewBroadcast extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            }
        this.goBack = this.goBack.bind(this)
        this.goToResponses = this.goToResponses.bind(this)
        props.clearSendersInfo()
        props.fetchSmsAnalytics(props.smsBroadcast._id)
    }
    goBack () {
        this.props.history.push({
            pathname: `/smsBroadcasts`,
        })
    }
    goToResponses () {
        this.props.history.push({
            pathname: `/viewResponses`,
        })
    }


    UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps.smsAnalytics) {
            var counts = []
            var values = []
            var colors = ['#ffb822','#aed7f7', '#cb4b4b', '#4da74d', '#9440ed']
            var backcolors = []
            if (nextProps.smsAnalytics.responses) {
                for (var i =0; i < nextProps.smsAnalytics.responses.length; i++) {
                    values.push(nextProps.smsAnalytics.responses[i]._id)
                    counts.push(nextProps.smsAnalytics.responses[i].count)
                    backcolors.push(colors[i])
                }
                var radarChart = document.getElementById('radar-chart')

                if (radarChart !== null) {
                    // eslint-disable-next-line camelcase
                    var ctx_rc = radarChart.getContext('2d')

                    // eslint-disable-next-line camelcase
                    var data_rc = {
                        datasets: [
                        {
                            data: counts,
                            backgroundColor: backcolors
                        }],
                        labels: values
                    }
                    // eslint-disable-next-line no-unused-vars,no-undef
                    var radarChartEl = new Chart(ctx_rc, {
                        type: 'pie',
                        data: data_rc
                    })
                }
            }
        }
        if (nextProps.smsDeliveryInfo && nextProps.smsDeliveryInfo.broadcast) {
            if (nextProps.smsDeliveryInfo.broadcast._id === nextProps.smsBroadcast._id) {
                let currentBroadcast = nextProps.smsDeliveryInfo.broadcast
                nextProps.saveCurrentSmsBroadcast(currentBroadcast)
            }
            nextProps.smsDeliveryEvent(null)
        }

        if (nextProps.smsResponseInfo && nextProps.smsResponseInfo.response) {
            let socketResponse = nextProps.smsResponseInfo.response
            let smsAnalyticsCurrent = cloneDeep(nextProps.smsAnalytics)
            if (nextProps.smsResponseInfo.response.broadcastId === nextProps.smsBroadcast._id) {
                if (smsAnalyticsCurrent.responded > 0) {                   
                    let responseObject = smsAnalyticsCurrent.responses.find(re => re._id === socketResponse.response.text)
                    if (responseObject) {
                        smsAnalyticsCurrent.responded = smsAnalyticsCurrent.responded + 1
                        responseObject.count =  responseObject.count + 1
                    } else {
                        let othersObject = smsAnalyticsCurrent.responses.find(re => re._id === 'others')
                        if (othersObject) {
                            smsAnalyticsCurrent.responded = smsAnalyticsCurrent.responded + 1
                            othersObject.count = othersObject.count + 1
                        } else {
                            let responseObj = nextProps.smsResponseInfo.response
                            if (responseObj.response && responseObj.response.text) {
                                smsAnalyticsCurrent.responded = smsAnalyticsCurrent.responded + 1
                                smsAnalyticsCurrent.responses.push({_id: responseObj.response.text, count: 1})
                            }
                        }
                    }
                } else {
                    if (socketResponse.response && socketResponse.response.text) {
                        smsAnalyticsCurrent.responded = 1
                        smsAnalyticsCurrent.responses.push({_id: socketResponse.response.text, count: 1})
                    }
                } 
            }
            nextProps.updateSmsAnalytics(smsAnalyticsCurrent)
            nextProps.smsResponseEvent(null)
        }
    }

    render () {
        return (
            <div className='m-grid__item m-grid__item--fluid m-wrapper' >
                <div className='m-content'>
                    <div className='m-portlet m-portlet--full-height '>
                        <div className='m-portlet__head'>
                            <div className='m-portlet__head-caption'>
                                <div className='m-portlet__head-title'>
                                    <h3 className='m-portlet__head-text'>{this.props.smsBroadcast.title}</h3>
                                </div>
                            </div>
                            <div className='m-portlet__head-tools'>
                            <button id="btnViewResponses" className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'  onClick={() => {this.goToResponses()}} disabled={this.props.smsAnalytics && this.props.smsAnalytics.responded < 1}>
                                <span>
                                <span>View Responses</span>
                                </span>
                            </button>
                            </div>
                        </div>
                        <div className='m-portlet__body'>
                            <div className='row' style={{height: '300px'}}>
                                <div className='col-md-6 col-lg-7 col-sm-4'>
                                    <div className='m-widget1' style={{paddingTop: '1.2rem'}}>
                                        <div className='m-widget1__item'>
                                            <div className='row m-row--no-padding align-items-center'>
                                                <div className='col'>
                                                    <h3 className='m-widget1__title'>Sent</h3>
                                                </div>
                                                <div className='col m--align-left'>
                                                    <span>{this.props.smsBroadcast.sent}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='m-widget1__item'>
                                            <div className='row m-row--no-padding align-items-center'>
                                                <div className='col'>
                                                    <h3 className='m-widget1__title'>Delivered</h3>
                                                </div>
                                                <div className='col m--align-left'>
                                                    <span>{this.props.smsBroadcast.delivered}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='m-widget1__item'>
                                            <div className='row m-row--no-padding align-items-center'>
                                                <div className='col'>
                                                    <h3 className='m-widget1__title'>Responded</h3>
                                                </div>
                                                <div className='col m--align-left'>
                                                    <span>{this.props.smsAnalytics ? this.props.smsAnalytics.responded : 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { this.props.smsAnalytics && this.props.smsAnalytics.responded < 1 &&
                                    <div style={{marginLeft: '110px', marginTop: '20px'}}> No data to display </div>
                                }
                                <div className='col-md-9 col-lg-5 col-sm-9'>
                                    <div style={{'width': '600px', 'height': '400px', 'margin': '0 auto'}} className='col m--align-left'>
                                        <canvas id='radar-chart' width={250} height={170}  />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <label className='col-form-label'>Broadcast Message:</label>
                                </div>
                                <div className='col-12'>
                                    <textarea
                                        className='form-control m-input'
                                        id='txtAreaBroadcastMessage' rows='8'
                                        value={this.props.smsBroadcast.payload && this.props.smsBroadcast.payload.length > 0 ? this.props.smsBroadcast.payload[0].text : ''} />
                                </div>
                                <BACKBUTTON
                                    onBack={this.goBack}
                                />
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
    smsBroadcast: (state.smsBroadcastsInfo.smsBroadcast),
    smsAnalytics: (state.smsBroadcastsInfo.smsAnalytics),
    smsDeliveryInfo: (state.smsBroadcastsInfo.smsDeliveryInfo),
    smsResponseInfo: (state.smsBroadcastsInfo.smsResponseInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSmsAnalytics,
    clearSendersInfo,
    smsDeliveryEvent,
    saveCurrentSmsBroadcast,
    smsResponseEvent,
    updateSmsAnalytics
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewBroadcast)
