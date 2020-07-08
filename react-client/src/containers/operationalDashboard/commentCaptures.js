import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadCommentCaptures } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'

class CommentCaptures extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      commentCaptureData: [],
      totalLength: 0,
      selectedDays: 10,
      pageNumber: 0,
      showCommentCaptures: false
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Comment Captures by Days`
  }
  toggle () {
    this.setState({showCommentCaptures: !this.state.showCommentCaptures}, () => {
      if (this.state.showCommentCaptures) {
        this.props.loadCommentCaptures({last_id: 'none',
          number_of_records: 10,
          first_page: 'first',
          days: this.state.selectedDays,
          userId: this.props.userId,
          companyId: this.props.companyId
        })
      }
    })
  }
  displayData (n, commentCaptures) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > commentCaptures.length) {
      limit = commentCaptures.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = commentCaptures[i]
      index++
    }
    this.setState({commentCaptureData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadCommentCaptures({
        last_id: 'none',
        number_of_records: 10,
        first_page: 'first',
        userId: this.props.userId,
        companyId: this.props.companyId,
        days: parseInt(this.state.selectedDays)})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadCommentCaptures({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.commentCaptures.length > 0 ? this.props.commentCaptures[this.props.commentCaptures.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        userId: this.props.userId,
        companyId: this.props.companyId,
        days: parseInt(this.state.selectedDays)})
    } else {
      this.props.loadCommentCaptures({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.commentCaptures.length > 0 ? this.props.commentCaptures[0]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        userId: this.props.userId,
        companyId: this.props.companyId,
        days: parseInt(this.state.selectedDays)})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.commentCaptures)
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.commentCaptures && nextProps.count) {
      this.displayData(0, nextProps.commentCaptures)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({commentCaptureData: [], totalLength: 0})
    }
  }

  onDaysChange (event) {
    this.setState({selectedDays: event.target.value, pageNumber: 0})
    if (event.target.value === '' ) {
      this.props.loadCommentCaptures({
        last_id: this.props.commentCaptures.length > 0 ? this.props.commentCaptures[this.props.commentCaptures.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        userId: this.props.userId,
        companyId: this.props.companyId,
        days: ''})
    } else if (parseInt(event.target.value) > 0) {
      this.props.loadCommentCaptures({
        last_id: this.props.commentCaptures.length > 0 ? this.props.commentCaptures[this.props.commentCaptures.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        userId: this.props.userId,
        companyId: this.props.companyId,
        days: parseInt(event.target.value)
      })
    }
  }

  getPostType (post) {
    if (post.payload && post.payload.length > 0) {
      return 'New Post'
    } else if (post.post_id && post.post_id !== '') {
      return 'Existing Post'
    } else {
      return 'Any Post'
    }
  }

  getPostUrl (post) {
    if (post.post_id && post.post_id !== '') {
      return `https://www.facebook.com/${post.post_id.split('_')[1]}`
    } else {
      return ''
    }
  }

  render () {
    return (
      <div className='row'>
        <div
          className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Comment Captures
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item' />
                  <li className='m-portlet__nav-item'>
                    <div data-portlet-tool='toggle' className='m-portlet__nav-link m-portlet__nav-link--icon' title='' data-original-title='Collapse' onClick={this.toggle}>
                      {this.state.showCommentCaptures
                      ? <i className='la la-angle-up' style={{cursor: 'pointer'}} />
                    : <i className='la la-angle-down' style={{cursor: 'pointer'}} />
                  }
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {this.state.showCommentCaptures &&
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                  <div className='form-row'>
                    <div className='form-group col-md-6' >
                    </div>
                    <div className='form-group col-md-6' style={{display: 'flex', float: 'right'}}>
                      <span style={{marginLeft: '70px'}} htmlFor='example-text-input' className='col-form-label'>
                        Show records for last:&nbsp;&nbsp;
                      </span>
                      <div style={{width: '200px'}}>
                        <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                      </div>
                      <span htmlFor='example-text-input' className='col-form-label'>
                      &nbsp;&nbsp;days
                      </span>
                    </div>
                  </div>
                  {
                    this.state.commentCaptureData && this.state.commentCaptureData.length > 0
                    ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                      <table className='m-datatable__table'
                        id='m-datatable--27866229129' style={{
                          display: 'block',
                          height: 'auto',
                          overflowX: 'auto'
                        }}>
                        <thead className='m-datatable__head'>
                          <tr className='m-datatable__row'
                            style={{height: '53px'}}>
                            <th data-field='title'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Title</span></th>
                            <th data-field='type'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Type</span></th>
                            <th data-field='page'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Page</span></th>
                            <th data-field='url'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '200px'}}>Post Url</span></th>
                            <th data-field='date'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px'}}>Created At</span></th>
                          </tr>
                        </thead>
                        <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                          {
                            this.state.commentCaptureData.map((commentCapture, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='title'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '100px'}}>{commentCapture.title}</span></td>
                                  <td data-field='type' className='m-datatable__cell'>
                                  <span style={{width: '100px'}}>{this.getPostType(commentCapture)}</span></td>
                                <td data-field='page'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '100px'}}>{commentCapture.page.pageName}</span></td>
                                  <td data-field='url'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '200px'}}>
                                    {commentCapture.post_id && commentCapture.post_id !== ''
                                      ? <a href={this.getPostUrl(commentCapture)} target='_blank'>{this.getPostUrl(commentCapture)}</a>
                                      : '-'
                                    }
                                  </span></td>
                                  <td data-field='date'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '100px'}}>{handleDate(commentCapture.datetime)}</span></td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <ReactPaginate previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a href='#/'>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.state.pageNumber} />
                    </div>
                    : <p> No data to display </p>
                  }
                </div>
              </div>
            </div>
          }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    commentCaptures: state.backdoorInfo.commentCaptures,
    count: state.backdoorInfo.commentCaptureCount
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadCommentCaptures: loadCommentCaptures},dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CommentCaptures)
