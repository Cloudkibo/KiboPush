import React from 'react'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import RECORDITEM from './recordItem'

class Records extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentPage: 1,
      recordsPerPage: 5,
      currentPageData: [],
      showRecords: false
    }
    this.getCurrentPageData = this.getCurrentPageData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.toggleCollapse = this.toggleCollapse.bind(this)
  }

  toggleCollapse () {
    this.setState({showRecords: !this.state.showRecords})
  }

  getCurrentPageData (props) {
    const start = (this.state.currentPage - 1) * this.state.recordsPerPage
    let end = this.state.currentPage * this.state.recordsPerPage
    end = (end > props.dataCount) ? props.dataCount : end
    const data = props.data.slice(start, end)
    this.setState({currentPageData: data})
  }

  handlePageClick (data) {
    this.setState({currentPage: data.selected + 1}, () => {this.getCurrentPageData()})
  }

  componentDidMount () {
    this.getCurrentPageData(this.props)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.data) {
      this.getCurrentPageData(nextProps)
    }
  }

  render () {
    return (
      <div className="col-md-12" style={{position: 'static', zoom: 1, marginTop: '35px'}}>
        {
          this.props.removeAll && this.state.showRecords && this.props.dataCount > 0 &&
          <button onClick={this.props.onRemoveAll} style={{borderColor: '#f4516c'}} type="button" className="btn m-btn--pill btn-outline-danger btn-sm m-btn m-btn--custom pull-right">
            Remove All
          </button>
        }
        <h5 data-toggle='collapse' data-target={`#${this.props.id}`} style={{padding: '.5rem 1rem .5rem 0px'}}>
          {this.props.title}
          {
            this.state.showRecords
            ? <i style={{ fontSize: '18px', fontWeight: 700, marginLeft: '5px', cursor: 'pointer' }} onClick={this.toggleCollapse} className='la la-angle-up ' />
            : <i style={{ fontSize: '18px', fontWeight: 700, marginLeft: '5px', cursor: 'pointer' }} onClick={this.toggleCollapse} className='la la-angle-down ' />
          }
          {
            this.props.showCountBadge &&
            <span style={{marginLeft: '10px'}} className={`m-badge m-badge--${this.props.badgeClass} m-badge--wide`}>
    					{this.props.dataCount}
    				</span>
          }
        </h5>
        <div id={this.props.id} className='collapse'>
          {
            this.props.dataCount > 0
            ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded '>
              <table className="m-datatable__table" style={{display: 'block', height: 'auto'}}>
                <thead className="m-datatable__head">
                  <tr className="m-datatable__row" style={{height: '53px'}}>
                    <th data-field="Name" style={{width: '150px'}} className="m-datatable__cell m-datatable__cell--center m-datatable__cell--sort">
                      <span>Name</span>
                    </th>
                    <th data-field="PhoneNumber" style={{width: '150px'}} className="m-datatable__cell m-datatable__cell--center m-datatable__cell--sort">
                      <span>Phone Number</span>
                    </th>
                    <th data-field="Status" style={{width: '100px'}} className="m-datatable__cell m-datatable__cell--center m-datatable__cell--sort">
                      <span>Status</span>
                    </th>
                    <th data-field="Actions" style={{width: '150px'}} className="m-datatable__cell m-datatable__cell--center m-datatable__cell--sort">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="m-datatable__body">
                  {
                    this.state.currentPageData.map((item, index) => (
                      <RECORDITEM
                        key={index}
                        index={index}
                        data={item}
                        updateContact={this.props.updateContact}
                        deleteContact={this.props.deleteContact}
                        alertMsg={this.props.alertMsg}
                      />
                    ))
                  }
                </tbody>
              </table>
              {
                this.props.dataCount > this.state.recordsPerPage &&
                <ReactPaginate
                  previousLabel='previous'
                  nextLabel='next'
                  breakLabel={<a href='#/'>...</a>}
                  breakClassName='break-me'
                  pageCount={Math.ceil(this.props.dataCount / this.state.recordsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={this.handlePageClick}
                  containerClassName='pagination'
                  subContainerClassName='pages pagination'
                  activeClassName='active'
                />
              }
            </div>
            : <div style={{padding: '5px 0px'}}>No data to display</div>
          }
        </div>
      </div>
    )
  }
}

Records.propTypes = {
  'title': PropTypes.string.isRequired,
  'data': PropTypes.array.isRequired,
  'dataCount': PropTypes.number.isRequired,
  'removeAll': PropTypes.bool.isRequired,
  'showCountBadge': PropTypes.bool.isRequired,
  'badgeClass': PropTypes.string,
  'updateContact': PropTypes.func.isRequired,
  'deleteContact': PropTypes.func.isRequired,
  'onRemoveAll': PropTypes.func
}

export default Records
