import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPageTags } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class PageTags extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
        pageTagsData: [],
        searchValue: '',
        filter: true,
        pageNumber: 0,
        showPageTags: true,
        selectedValue: 'all'
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.displayData = this.displayData.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.props.loadPageTags(this.props.location.state.pageId)
  }

  onFilterChange (event) {
    this.setState({selectedValue: event.target.value})
    switch (event.target.value) {
      case 'all':
        this.displayData(0, this.state.pageTags)
        this.setState({totalLength: this.state.pageTags.length, pageNumber: 0})
        break
      case 'incorrect':
        this.displayData(0, this.state.incorrectRecords)
        this.setState({totalLength: this.state.incorrectRecords.length, pageNumber: 0})
        break
      default:
        break
    }
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
        let kiboPageTags = nextProps.pageTags.kiboPageTags.map(kiboPageTag => {
            let fbPageTag = nextProps.pageTags.fbPageTags.find(x => {
                return x.id === kiboPageTag.labelFbId
            })
            if (fbPageTag) {
                return {
                    tagName: kiboPageTag.tag,
                    default: kiboPageTag.defaultTag,
                    facebook: true,
                    kibopush: true
                }
            } else {
                return {
                    tagName: kiboPageTag.tag,
                    default: kiboPageTag.defaultTag,
                    facebook: false,
                    kibopush: true
                }
            }
        })

        let fbPageTags = nextProps.pageTags.fbPageTags.map(fbPageTag => {
            let kiboPageTag = nextProps.pageTags.kiboPageTags.find(x => {
                return x.labelFbId === fbPageTag.id
            })
            if (!kiboPageTag) {
                return {
                    tagName: fbPageTag.name,
                    default: fbPageTag.name.startsWith("_pageId") || fbPageTag.name === 'male' || fbPageTag.name === 'female',
                    facebook: true,
                    kibopush: false
                }
            }
        })




        let pageTagsData = [...kiboPageTags, ...fbPageTags]
        pageTagsData = pageTagsData.filter(pageTag => !!pageTag)
        let incorrectRecords = pageTagsData.filter(pageTag => pageTag.facebook !== pageTag.kibopush)
        console.log('pageTagsData', pageTagsData)
        this.displayData(0, pageTagsData)
        this.setState({ totalLength: pageTagsData.length , pageTags: pageTagsData, incorrectRecords})
    } else {
        this.setState({pageTagsData: [], totalLength: 0})
    }
  }


  handlePageClick (data) {
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.state.pageTags)
  }


  render () {
    console.log('pageTags state', this.state)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />




        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>

                <h1>{this.props.location.state.pageName}</h1>

                
                <div style={{textAlign: 'right', marginTop: '-60px'}}>
                    <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.selectedValue} onChange={this.onFilterChange}>
                        <option value='all'>Show all records</option>
                        <option value='incorrect'>Show incorrect records</option>
                    </select>
                </div>

                <div className='m-portlet__body'>
                    <div className='row m-row--full-height'>
                        <div className='col-sm-12 col-md-12 col-lg-4' style={{paddingRight: '2px'}}>
                            <div className='m-portlet m-portlet--border-bottom-brand'>
                                <div className='m-portlet__body'>
                                    <div className='m-widget26'>
                                        <div className='m-widget26__number'>
                                            {this.props.pageTags && this.props.pageTags.kiboPageTags.length}
                                            <small>
                                                KiboPush Tags
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-12 col-md-12 col-lg-4' style={{paddingRight: '2px'}}>
                            <div className='m-portlet m-portlet--border-bottom-danger'>
                                <div className='m-portlet__body'>
                                    <div className='m-widget26'>
                                        <div className='m-widget26__number'>
                                            {this.props.pageTags && this.props.pageTags.fbPageTags.length}
                                            <small>
                                                Facebook Tags
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-12 col-md-12 col-lg-4' style={{paddingRight: '2px'}}>
                            <div className='m-portlet m-portlet--border-bottom-success'>
                                <div className='m-portlet__body'>
                                    <div className='m-widget26'>
                                        <div className='m-widget26__number'>
                                            {this.state.incorrectRecords && this.state.incorrectRecords.length}
                                            <small>
                                                Incorrect Records
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.props.location.state.pageName}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div>
                  { this.state.pageTagsData && this.state.pageTagsData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='tagName'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Tag Name</span>
                          </th>
                          <th data-field='default'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Default</span>
                          </th>
                          <th data-field='kibopush'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>KiboPush</span>
                          </th>
                          <th data-field='facebook'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Facebook</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.pageTagsData.map((pageTag, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='tagName' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{pageTag.tagName}</span></td>
                            <td data-field='default' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{""+pageTag.default}</span></td>
                            <td data-field='kibopush' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{""+pageTag.kibopush}</span></td>
                            <td data-field='facebook' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{""+pageTag.facebook}</span></td>
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        forcePage={this.state.pageNumber}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'} />
                    </div>
                  </div>
                  : <span>
                    <p> No data to display </p>
                  </span>
                }

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
    pageTags: state.backdoorInfo.pageTags
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadPageTags}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageTags)
