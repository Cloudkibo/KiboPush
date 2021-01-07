/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'
import { handleDate } from '../../utility/utils'
import { bindActionCreators } from 'redux'
import { smsResponseEvent, updateSendersInfo } from '../../redux/actions/smsBroadcasts.actions'
import { cloneDeep } from 'lodash'
class ResponseDetails extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNumber: 0
        }
    }
   
    UNSAFE_componentWillReceiveProps (nextProps) {  
        if (nextProps.smsResponseInfo) {
            let socketResponse = nextProps.smsResponseInfo.response
            let currentSendersInfo = this.props.allSenders ? cloneDeep(this.props.allSenders) : {}
            if (socketResponse.response) {
                //check to see if the current component is of reponse received
                if (socketResponse.response.text.toLowerCase().trim() === this.props.response._id.toLowerCase().trim()) {
                   // Update senders if its firts page
                    if ( this.state.pageNumber === 0) {
                        if (currentSendersInfo[socketResponse.response.text.toLowerCase().trim()]) {
                            currentSendersInfo[socketResponse.response.text.toLowerCase().trim()] = [nextProps.smsResponseInfo.subscriber,...currentSendersInfo[socketResponse.response.text.toLowerCase().trim()]]
                        }
                        this.props.updateSendersInfo(currentSendersInfo)
                    }
                    this.props.smsResponseEvent(null)
                }
                if (this.props.response._id === 'others') {
                    // if the current component is others and the response event doesnot belong to any other unique response
                    // Update 'others' senders info if first page is active
                    let responseObject = this.props.smsAnalytics.responses.find(re => re._id.toLowerCase().trim() === socketResponse.response.text.toLowerCase().trim())
                    if (!responseObject && currentSendersInfo['others'] && this.state.pageNumber === 0) {
                        nextProps.smsResponseInfo.subscriber.text = socketResponse.response.text
                        currentSendersInfo['others'] = [nextProps.smsResponseInfo.subscriber,...currentSendersInfo['others']]
                        this.props.updateSendersInfo(currentSendersInfo)
                        this.props.smsResponseEvent(null)
                    }
                }
            } 
        }
    }

    render () {
        return (
        <div className='col-12' style={{minHeight: '200px'}}>
            { this.props.senders && this.props.senders.length > 0
                ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                    <thead className='m-datatable__head'>
                    <tr className='m-datatable__row'>
                        <th data-field='profilePic'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Profile Pic</span>
                        </th>
                        <th data-field='name'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '150px'}}>Name</span>
                        </th>
                        <th data-field='phoneNumber'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '150px'}}>Phone Number</span>
                        </th>
                        { this.props.response._id === 'others' &&
                            <th data-field='response'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Response</span>
                            </th>
                        }
                        <th data-field='dateTime'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Responded At</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className='m-datatable__body'>
                    {this.props.senders.map((sender, i) => (
                        <tr data-row={i}
                        className='m-datatable__row m-datatable__row--even' key={i}>
                        <td data-field='profilePic' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}><img src={sender.profilePic ? sender.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} className='m--img-rounded m--marginless m--img-centered' alt='' /></span></td>
                        <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{sender.name}</span></td>
                        <td data-field='phoneNumber' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{sender.number}</span></td>
                        { this.props.response._id === 'others' && <td data-field='response' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{sender.text}</span></td> }
                        <td data-field='dateTime' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{handleDate(sender.datetime)}</span></td>
                        </tr>
                    ))
                    }
                    </tbody>
                </table>
                <div className='pagination'>
                    <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={<a href='#/'>...</a>}
                    breakClassName={'break-me'}
                    pageCount={Math.ceil(this.props.totalLength / 10)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={(data) => {
                        this.setState({pageNumber: data.selected})
                        this.props.handlePageClick(data, this.state.pageNumber,  this.props.response, this.props.senders)
                    }}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                    forcePage={this.state.pageNumber} />
                </div>
                </div>
                : <span>
                <p> No data to display </p>
                </span>
            }
        </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        smsResponseInfo: (state.smsBroadcastsInfo.smsResponseInfo)
    }
  }

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
      smsResponseEvent,
      updateSendersInfo
    }, dispatch)
  }

  export default connect(mapStateToProps, mapDispatchToProps)(ResponseDetails)