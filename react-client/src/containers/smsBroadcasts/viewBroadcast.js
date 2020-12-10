/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { fetchSmsAnalytics  } from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'

class ViewBroadcast extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            }
        this.goBack = this.goBack.bind(this)
        props.fetchSmsAnalytics(props.smsBroadcast._id)
    }
    goBack () {
        this.props.history.push({
            pathname: `/smsBroadcasts`,
        })
    }

    UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps.smsAnalytics) {
            var radarChart = document.getElementById('radar-chart')
            var counts = [1, 2, 3, 4, 5]
            var vals = []
            var colors = ['#46b963','#53ac69', '#609f70', '#6c9376', '#738c79']
            var values = ['yes', 'no','maybe' ]
            var backcolors = []

            backcolors.push(colors[0])
            vals.push(values[0])

            backcolors.push(colors[1])
            vals.push(values[1])

            backcolors.push(colors[2])
            vals.push(values[2])

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
                    labels: vals
                }
                // eslint-disable-next-line no-unused-vars,no-undef
                var radarChartEl = new Chart(ctx_rc, {
                    type: 'pie',
                    data: data_rc
                })
            }
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
                            <button id="btnViewResponses" className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'  onClick={() => {}}>
                                <span>
                                <span>View Responses</span>
                                </span>
                            </button>
                            </div>
                        </div>
                        <div className='m-portlet__body'>
                            <div className='row'>
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
                                                    <span>{this.props.smsBroadcast.sent}</span>
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
                            </div>
                            <div className='row'>
                                <div className='col-12'>
                                    <div className='pull-right'>
                                        <button className='btn btn-primary' style={{marginTop: '10px'}} onClick={this.goBack}>
                                            Back
                                        </button>
                                    </div>
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
    smsBroadcast: (state.smsBroadcastsInfo.smsBroadcast),
    smsAnalytics: (state.smsBroadcastsInfo.smsAnalytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSmsAnalytics
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewBroadcast)
