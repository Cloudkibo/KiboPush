import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPageTags } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

class PageTags extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
        filteredData: [],
        pageTagsData: [],
        kiboPageTags: [],
        fbPageTags: [],
        searchValue: '',
        defaultValue: '',
        fbValue: '',
        kiboValue: '',
        filter: false,
        pageNumber: 0,
        showPageTags: true,
        selectedValue: 'all'
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.displayData = this.displayData.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.onTagNameSearch = this.onTagNameSearch.bind(this)
    this.onFbFilter = this.onFbFilter.bind(this)
    this.onKiboFilter = this.onKiboFilter.bind(this)
    this.onDefaultFilter = this.onDefaultFilter.bind(this)
    this.applyNecessaryFilters = this.applyNecessaryFilters.bind(this)
    this.applySearchFilter = this.applySearchFilter.bind(this)
    this.applyFbFilter = this.applyFbFilter.bind(this)
    this.applyKiboFilter = this.applyKiboFilter.bind(this)
    this.applyDefaultFilter = this.applyDefaultFilter.bind(this)
    this.props.loadPageTags(this.props.location.state.pageId)
    this.loadedTags = false
  }

  onTagNameSearch (event) {
      this.setState({searchValue: event.target.value}, () => {
          this.applyNecessaryFilters()
      })
  }

  onFbFilter (event) {
    this.setState({fbValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  onKiboFilter (event) {
    this.setState({kiboValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  onDefaultFilter (event) {
    this.setState({defaultValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  applyNecessaryFilters() {
      //debugger;
      let filteredData = this.state.pageTags
      let filter = false
      if (this.state.selectedValue === 'incorrect') {
        filteredData = this.state.incorrectRecords
      }
      if (this.state.fbValue !== '' && this.state.fbValue !== 'all') {
        filteredData = this.applyFbFilter(filteredData, this.state.fbValue)
        filter = true
      }
      if (this.state.kiboValue !== '' && this.state.kiboValue !== 'all') {
        filteredData = this.applyKiboFilter(filteredData, this.state.kiboValue)
        filter = true
      }
      if (this.state.defaultValue !== '' && this.state.defaultValue !== 'all') {
        filteredData = this.applyDefaultFilter(filteredData, this.state.defaultValue)
        filter = true
      }
      if (this.state.searchValue !== '') {
        console.log(`applying search filter ${this.state.searchValue} ${JSON.stringify(filteredData)}`)
        filteredData = this.applySearchFilter(filteredData, this.state.searchValue)
        filter = true
      }
      console.log('after applying filters', filteredData)
      this.setState({filteredData, filter, totalLength: filteredData.length})
      this.displayData(0, filteredData)
  }

  applySearchFilter(data, search) {
    return data.filter(x => (x.tagName).toLowerCase().includes(search.toLowerCase()))
  }

  applyFbFilter(data, fb) {
      return data.filter(x => (''+x.facebook) === fb)
  }

  applyKiboFilter(data, kibo) {
    return data.filter(x => (''+x.kibopush) === kibo)
  }

  applyDefaultFilter(data, def) {
    return data.filter(x => (''+x.default) === def)
  }

  onTagNameSearch (event) {
      this.setState({searchValue: event.target.value}, () => {
          this.applyNecessaryFilters()
      })
  }

  onFbFilter (event) {
    this.setState({fbValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  onKiboFilter (event) {
    this.setState({kiboValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  onDefaultFilter (event) {
    this.setState({defaultValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
  }

  applyNecessaryFilters() {
      //debugger;
      let filteredData = this.state.pageTags
      let filter = false
      if (this.state.selectedValue === 'incorrect') {
        filteredData = this.state.incorrectRecords
      } else if (this.state.selectedValue === 'correct') {
        filteredData = this.state.correctRecords
      }
      if (this.state.fbValue !== '' && this.state.fbValue !== 'all') {
        filteredData = this.applyFbFilter(filteredData, this.state.fbValue)
        filter = true
      }
      if (this.state.kiboValue !== '' && this.state.kiboValue !== 'all') {
        filteredData = this.applyKiboFilter(filteredData, this.state.kiboValue)
        filter = true
      }
      if (this.state.defaultValue !== '' && this.state.defaultValue !== 'all') {
        filteredData = this.applyDefaultFilter(filteredData, this.state.defaultValue)
        filter = true
      }
      if (this.state.searchValue !== '') {
        console.log(`applying search filter ${this.state.searchValue} ${JSON.stringify(filteredData)}`)
        filteredData = this.applySearchFilter(filteredData, this.state.searchValue)
        filter = true
      }
      console.log('after applying filters', filteredData)
      this.setState({filteredData, filter, totalLength: filteredData.length})
      this.displayData(0, filteredData)
  }

  applySearchFilter(data, search) {
    return data.filter(x => x.tagName.includes(search))
  }

  applyFbFilter(data, fb) {
      return data.filter(x => (''+x.facebook) === fb)
  }

  applyKiboFilter(data, kibo) {
    return data.filter(x => (''+x.kibopush) === kibo)
  }

  applyDefaultFilter(data, def) {
    return data.filter(x => (''+x.default) === def)
  }

  onFilterChange (event) {
    this.setState({selectedValue: event.target.value}, () => {
        this.applyNecessaryFilters()
    })
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('UNSAFE_componentWillReceiveProps in broadcastbydays', nextProps)
    this.loadedTags = true
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
        let correctRecords = pageTagsData.filter(pageTag => pageTag.facebook === pageTag.kibopush)
        console.log('pageTagsData', pageTagsData)
        this.displayData(0, pageTagsData)
        this.setState({ kiboPageTags: nextProps.pageTags.kiboPageTags, fbPageTags: nextProps.pageTags.fbPageTags, totalLength: pageTagsData.length , pageTags: pageTagsData, filteredData: pageTagsData, incorrectRecords, correctRecords})
    } else {
        this.setState({pageTagsData: [], totalLength: 0})
    }
  }


  handlePageClick (data) {
    this.setState({pageNumber: data.selected})
    if (this.state.selectedValue === 'incorrect' && !this.state.filter) {
        this.displayData(data.selected, this.state.incorrectRecords)
    } else if (this.state.selectedValue === 'correct' && !this.state.filter) {
        this.displayData(data.selected, this.state.correctRecords)
    } else if (this.state.filter) {
        this.displayData(data.selected, this.state.filteredData)
    } else {
        this.displayData(data.selected, this.state.filteredData)
    }
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

                <h1 style={{marginBottom: '-30px'}}>
                    {this.props.location.state.pageName}
                    <span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'block', marginLeft: '10px', display: 'inline', fontSize: '0.4em'}}>{this.state.filteredData.length} Tags</span>
                </h1>


                <div style={{textAlign: 'right', marginBottom: '30px'}}>
                    <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.selectedValue} onChange={this.onFilterChange}>
                        <option value='all'>Show all records</option>
                        <option value='incorrect'>Show incorrect records</option>
                        <option value='correct'>Show correct records</option>
                    </select>
                </div>

                <div className='m-portlet__body'>
                    <div className='row m-row--full-height'>
                        <div className='col-sm-12 col-md-12 col-lg-3' style={{paddingRight: '2px'}}>
                            <div className='m-portlet m-portlet--border-bottom-brand'>
                                <div className='m-portlet__body'>
                                    <div className='m-widget26'>
                                        <div className='m-widget26__number'>
                                            {this.state.kiboPageTags.length}
                                            <small>
                                                KiboPush Tags
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-12 col-md-12 col-lg-3' style={{paddingRight: '2px'}}>
                            <div className='m-portlet m-portlet--border-bottom-danger'>
                                <div className='m-portlet__body'>
                                    <div className='m-widget26'>
                                        <div className='m-widget26__number'>
                                            {this.state.fbPageTags.length}
                                            <small>
                                                Facebook Tags
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-12 col-md-12 col-lg-3' style={{paddingRight: '2px'}}>
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

                        <div className='col-sm-12 col-md-12 col-lg-3' style={{paddingRight: '2px'}}>
                            <div className='m-portlet m-portlet--border-bottom-accent'>
                                <div className='m-portlet__body'>
                                    <div className='m-widget26'>
                                        <div className='m-widget26__number'>
                                            {this.state.correctRecords && this.state.correctRecords.length}
                                            <small>
                                                Correct Records
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


              <div className='m-portlet'>
                <div className='m-portlet__body'>
                  <div>
                  <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>


                    <div>
                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <input type='text' placeholder='Search by tag name' className='form-control' value={this.state.searchValue} onChange={this.onTagNameSearch} />
                    </div>
                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <select className='custom-select' style={{width: '100%'}} value={this.state.defaultValue} onChange={this.onDefaultFilter} >
                        <option value='' disabled>Filter by default</option>
                        <option value='true'>default</option>
                        <option value='false'>not default</option>
                        <option value='all'>all</option>
                      </select>
                    </div>

                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <select className='custom-select' style={{width: '100%'}} value={this.state.kiboValue} onChange={this.onKiboFilter} >
                        <option value='' disabled>Filter by kibopush</option>
                        <option value='true'>kibopush</option>
                        <option value='false'>not kibopush</option>
                        <option value='all'>all</option>
                      </select>
                    </div>

                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <select className='custom-select' style={{width: '100%'}} value={this.state.fbValue} onChange={this.onFbFilter} >
                        <option value='' disabled>Filter by facebook</option>
                        <option value='true'>facebook</option>
                        <option value='false'>not facebook</option>
                        <option value='all'>all</option>
                      </select>
                    </div>
                  </div>


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

                      {
                        this.state.pageTagsData && this.state.pageTagsData.length > 0 ?
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
                        :
                        <span>
                            <h4 style={{margin: '20px', textAlign: 'center'}}> {this.loadedTags ? 'No Tags Found' : 'Loading Tags...'} </h4>
                        </span>
                      }
                    </table>
                    {
                     this.state.pageTagsData && this.state.pageTagsData.length > 0 &&
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a href='#/'>...</a>}
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
                    }
                  </div>
                  <div className='m-form m-form--label-align-right m--margin-bottom-30'>
                      <Link to='/operationalDashboard' className='btn btn-primary m-btn m-btn--icon pull-right'> Back </Link>
                  </div>
                  {/* : <span>
                    <p> No data to display </p>
                  </span>
                } */}

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
