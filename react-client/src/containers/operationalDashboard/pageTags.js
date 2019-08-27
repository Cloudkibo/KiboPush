import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPageTags } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class PageTags extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      searchValue: '',
      filter: true,
      pageNumber: 1,
      showPageTags: true
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.displayData = this.displayData.bind(this)
    this.props.loadPageTags(this.props.location.state.pageId)
  }

  displayData (n, pageTags) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pageTags.length) {
      limit = pageTags.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageTags[i]
      index++
    }
    this.setState({pageTagsData: data})
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Page Tags`
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps in broadcastbydays', nextProps)
    if (nextProps.pageTags) {
        let pageTagsData = [...nextProps.pageTags.kiboPageTags, ...nextProps.pageTags.fbPageTags]
        console.log('pageTagsData', pageTagsData)
        this.displayData(0, pageTagsData)
        this.setState({ totalLength: pageTagsData.length })
    } else {
        this.setState({pageTagsData: [], totalLength: 0})
    }
  }


  handlePageClick (data) {
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.pageTags)
  }

  render () {
    console.log('uniquePages state', this.state)
    return (
      <div className='row'>
        <div
          className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    {this.props.location.state.pageName}
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item' />
                  <li className='m-portlet__nav-item'>
                    <a data-portlet-tool='toggle' className='m-portlet__nav-link m-portlet__nav-link--icon' title='' data-original-title='Collapse' onClick={this.toggle}>
                      {this.state.showPageTags
                      ? <i className='la la-angle-up' style={{cursor: 'pointer'}} />
                    : <i className='la la-angle-down' style={{cursor: 'pointer'}} />
                  }
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {this.state.showPageTags &&
            <div className='m-portlet__body'>
              <div className='row align-items-center'> <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                {
                  this.props.uniquePages && this.props.uniquePages.data && this.props.uniquePages.data.length > 0
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
                          <th data-field='tagName'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Tag Name</span></th>
                          <th data-field='default'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Default</span></th>
                          <th data-field='kibopush'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>KiboPush</span></th>
                          <th data-field='facebook'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Facebook</span></th>
                        <th data-field='actions'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Actions</span></th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                          this.state.pageTagsData.data.map((pageTag, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                                
                                <td data-field='tagName' className='m-datatable__cell'>
                                    <span style={{width: '120px'}}>{pageTag.name ? pageTag.name : pageTag.tag}</span>
                                </td>

                               <td data-field='default' className='m-datatable__cell'>
                                    <span style={{width: '120px'}}>{pageTag.defaultTag}</span>
                                </td>
                                
                                <td data-field='kibopush' className='m-datatable__cell'>
                                    <span style={{width: '120px'}}>{pageTag.labelFbId ? 'True' : 'False'}</span>
                                </td>
                            
                                <td data-field='facebook' className='m-datatable__cell'>
                                    <span style={{width: '120px'}}>{pageTag.id ? 'True' : 'False'}</span>
                                </td>

                                <td data-field='actions'
                                    className='m-datatable__cell'>
                                    <span
                                    style={{width: '120px'}}>
                                        <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                            View More
                                        </button>
                                    </span>
                                </td>

                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    <ReactPaginate previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a>...</a>}
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
                  : <p> No data to display. </p>
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
    pageTags: state.backdoorInfo.pageTags
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadPageTags}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageTags)
