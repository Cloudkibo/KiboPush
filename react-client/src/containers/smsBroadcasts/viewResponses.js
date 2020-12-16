/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { fetchResponseDetails } from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'
import ResponseDetails from './responseDetails'

class ViewResponses extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            }
        this.goBack = this.goBack.bind(this)
        this.expandRowToggle = this.expandRowToggle.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
    }
    goBack () {
        this.props.history.push({
            pathname: `/viewBroadcast`,
        })
    }
    handlePageClick(data, currentPage, response, senders) {
        var payload = {}
        if (data.selected === 0) {
            payload = {
            "responses": [response._id],
            "operator": "in",
            "number_of_records": 1,
            "first_page": "first",
            "requested_page": data.selected,
            "current_page": currentPage,
            "last_id":  senders.length > 0 ? senders[senders.length - 1]._id : 'none'
            }
        } else if (currentPage < data.selected ) {
            payload = {
                "responses": [response._id],
                "operator": "in",
                "number_of_records": 1,
                "first_page": "next",
                "requested_page": data.selected,
                "current_page": currentPage,
                "last_id":  senders.length > 0 ? senders[senders.length - 1]._id : 'none'
            }
        } else {
                payload = {
                    "responses": [response._id],
                    "operator": "in",
                    "number_of_records": 1,
                    "first_page": "previous",
                    "requested_page": data.selected,
                    "current_page": currentPage,
                    "last_id":  senders.length > 0 ? senders[senders.length - 1]._id : 'none',
            }
        }
        
        this.props.fetchResponseDetails(this.props.smsBroadcast._id, response._id, payload)
    }

    expandRowToggle (row) {
        let className = document.getElementById(`icon-${row}`).className
        console.log('className', className)
        if (className === 'la la-angle-up collapsed') {
          document.getElementById(`icon-${row}`).className = 'la la-angle-down'
        } else {
          document.getElementById(`icon-${row}`).className = 'la la-angle-up'
        }
        var payload = {
            "responses": [this.props.smsAnalytics.responses[row]._id],
            "operator": "in",
            "number_of_records": 1,
            "first_page": "first",
            "requested_page": 0,
            "current_page": 1,
            "last_id": "none"
        }
        if (!this.props.senders || ( this.props.senders && !this.props.senders[this.props.smsAnalytics.responses[row]._id])) {
          this.props.fetchResponseDetails(this.props.smsBroadcast._id, this.props.smsAnalytics.responses[row]._id, payload)
        }
      }

    UNSAFE_componentWillReceiveProps (nextProps) {
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
                                <span>Send FollowUp Broadcast</span>
                                </span>
                            </button>
                            </div>
                        </div>
                        <div className='m-portlet__body'>
                            <div className='row'>                        
                                <div className='col-12' style={{overflow: 'auto' }}>
                                    {
                                    this.props.smsAnalytics && this.props.smsAnalytics.responses && this.props.smsAnalytics.responses.length > 0 &&  this.props.smsAnalytics.responses.map((response, i) => 
                                        <div key={'response' + i} className='accordion' id={`accordion${i}`} style={{ marginTop: '5px' }}>
                                            <div className='card'>
                                                <div className='card-header' id={`heading${i}`}>
                                                    <h4 className='mb-0'>
                                                        <div
                                                        onClick={() => this.expandRowToggle(i)}
                                                        className='btn'
                                                        data-toggle='collapse'
                                                        data-target={`#collapse_${i}`}
                                                        aria-expanded='true'
                                                        aria-controls={`#collapse_${i}`}
                                                        >
                                                        {response._id}
                                                        </div>
                                                        <span style={{ overflow: 'visible', float: 'right' }}>
                                                        <i
                                                            style={{ fontSize: '20px', cursor: 'pointer' }}
                                                            className='la la-angle-down'
                                                            data-toggle='collapse'
                                                            onClick={() => this.expandRowToggle(i)}
                                                            id={`icon-${i}`}
                                                            data-target={`#collapse_${i}`}
                                                        />
                                                        </span>
                                                    </h4>   
                                                </div>
                                                <div id={`collapse_${i}`} className='collapse' aria-labelledby={`heading${i}`} data-parent="#accordion">
                                                    <div className='card-body'>
                                                        <div className='row'>
                                                            <ResponseDetails senders={this.props.senders ? this.props.senders[response._id] : []} totalLength={response.count} response={response} handlePageClick={this.handlePageClick} />                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
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
    smsAnalytics: (state.smsBroadcastsInfo.smsAnalytics),
    senders: (state.smsBroadcastsInfo.sendersInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchResponseDetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewResponses)
