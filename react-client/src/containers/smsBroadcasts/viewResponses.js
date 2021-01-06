/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { fetchResponseDetails, smsResponseEvent,  updateSmsAnalytics, updateSendersInfo} from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'
import ResponseDetails from './responseDetails'
import BACKBUTTON from '../../components/extras/backButton'
import { cloneDeep } from 'lodash'

class ViewResponses extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: null
        }
        this.goBack = this.goBack.bind(this)
        this.expandRowToggle = this.expandRowToggle.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
        this.goToCreateFollowUp = this.goToCreateFollowUp.bind(this)
        this.removeLoader = this.removeLoader.bind(this)
        this.updateSendersInfo = this.updateSendersInfo.bind(this)
    }
    updateSendersInfo () {
        let socketResponse = this.props.smsResponseInfo.response
        let currentSendersInfo = cloneDeep(this.props.senders)
        if (socketResponse.response) {
            if (currentSendersInfo[socketResponse.response.text]) {
                currentSendersInfo[socketResponse.response.text] = [...[this.props.smsResponseInfo.subscriber], ... currentSendersInfo[socketResponse.response.text]]
            }
        }
        this.props.updateSendersInfo(currentSendersInfo)
        this.props.smsResponseEvent(null)
    }
    goBack () {
        this.props.history.push({
            pathname: `/viewBroadcast`,
        })
    }
    removeLoader () {
        this.setState({
            loading: null
        })
    }
    goToCreateFollowUp () {
        this.props.history.push({
            pathname: `/createFollowupBroadcast`,
        })
    }

    handlePageClick(data, currentPage, response, senders) {
        var payload = {
            "purpose": "subscriber_responses",
            "responses": [response._id],
            "operator": "in",
            "number_of_records": 10,
            "first_page": "first",
            "requested_page": data.selected,
            "current_page": currentPage,
            "last_id":  senders.length > 0 ? senders[senders.length - 1]._id : 'none'
        }
        if ((response._id).trim().toLowerCase() === 'others') {
            payload["responses"] = this.props.smsAnalytics.responses.map((response) => { return response._id})
            payload["operator"] =  "nin"
        } else {
            payload["responses"] =  [response._id]
            payload["operator"] =  "in"
        }

        if (data.selected === 0) {
            payload["first_page"] = "first"
        } else if (currentPage < data.selected ) {
            payload["first_page"] = "next"
        } else {
            payload["first_page"] = "previous"
        }
        this.setState({loading: {response:  response._id}})
        this.props.fetchResponseDetails(this.props.smsBroadcast._id, response._id, payload, null, this.removeLoader)
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
            "purpose": "subscriber_responses",
            "number_of_records": 10,
            "first_page": "first",
            "last_id": "none"
        }
        if ((this.props.smsAnalytics.responses[row]._id).trim().toLowerCase() === 'others') {
            payload["responses"] = this.props.smsAnalytics.responses.map((response) => { return response._id}).filter((resp) => { return resp.trim().toLowerCase() !== 'others'})
            payload["operator"] =  "nin"
        } else {
            payload["responses"] =  [this.props.smsAnalytics.responses[row]._id]
            payload["operator"] =  "in"
        }
        if (!this.props.senders || ( this.props.senders && !this.props.senders[this.props.smsAnalytics.responses[row]._id])) {
            this.setState({loading: {response:  this.props.smsAnalytics.responses[row]._id}})
            this.props.fetchResponseDetails(this.props.smsBroadcast._id, this.props.smsAnalytics.responses[row]._id, payload, null, this.removeLoader)
        }
      }

    UNSAFE_componentWillReceiveProps (nextProps) {
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
            //nextProps.smsResponseEvent(null)
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
                            <button id="btnViewResponses" className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'  onClick={this.goToCreateFollowUp}>
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
                                                        <span style={{marginLeft: '10px'}} className="m-menu__link-badge">
                                                            <span className="m-badge m-badge--success m-badge--wide">
                                                                {response.count}
                                                            </span>
													    </span>
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
                                                        { this.state.loading && this.state.loading.response === response._id
                                                            ? <div className='align-center col-12'><h6> Loading Details... </h6></div>
                                                            : <ResponseDetails senders={this.props.senders ? this.props.senders[response._id] : []} totalLength={response.count} response={response} handlePageClick={this.handlePageClick} updateSendersInfo={this.updateSendersInfo} /> 
                                                        }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            <BACKBUTTON
                                onBack={this.goBack}
                            />
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
    senders: (state.smsBroadcastsInfo.sendersInfo),
    smsResponseInfo: (state.smsBroadcastsInfo.smsResponseInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchResponseDetails,
    smsResponseEvent,
    updateSmsAnalytics,
    updateSendersInfo
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewResponses)
