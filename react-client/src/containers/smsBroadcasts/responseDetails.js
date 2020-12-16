/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import ReactPaginate from 'react-paginate'

class ResponseDetails extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNumber: 0
        }
    }
   
    UNSAFE_componentWillReceiveProps (nextProps) {
    }

    render () {
        return (
        <div className='col-12' style={{minHeight: '300px'}}>
            { this.props.senders && this.props.senders.length > 0
                ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                    <thead className='m-datatable__head'>
                    <tr className='m-datatable__row'
                        style={{height: '53px'}}>
                        <th data-field='profilePic'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Profile Pic</span>
                        </th>
                        <th data-field='name'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Name</span>
                        </th>
                        <th data-field='phoneNumber'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Phone Number</span>
                        </th>
                        <th data-field='dateTime'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '100px'}}>Date Time</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className='m-datatable__body'>
                    {this.props.senders.map((sender, i) => (
                        <tr data-row={i}
                        className='m-datatable__row m-datatable__row--even'
                        style={{height: '55px'}} key={i}>
                        <td data-field='profilePic' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{sender.profilePic}</span></td>
                        <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{sender.name}</span></td>
                        <td data-field='phoneNumber' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{sender.number}</span></td>
                        <td data-field='dateTime' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{sender.datetime}</span></td>
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
                    pageCount={Math.ceil(this.props.totalLength)}
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

ResponseDetails.propTypes = {
}
  
export default ResponseDetails