import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import YouTube from 'react-youtube'
import { loadTags, deleteTag } from '../../redux/actions/tags.actions'
import CreateTag from './createTag'
import AlertContainer from 'react-alert'

class Tags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTag: null,
      displayVideo: true,
      totalLength: 0,
      filter: false,
      search_value: '',
      pageNumber: 0,
      showingSearchResult: true,
      openVideo: false
    }
    props.loadTags()
    this.createTag = this.createTag.bind(this)
    this.updateTag = this.updateTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoTags.click()
  }
  

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Tags`;
  }

  deleteTag (tag) {
    this.setState({
        currentTag: tag
    }, () => { 
        this.refs.DeleteModal.click()
    })
  }

  createTag () {
      this.setState({
        currentTag: null
      }, () => {
        this.refs.TagModal.click()
      })
  }

  updateTag (tag) {
      this.setState({
        currentTag: tag
      }, () => {
        this.refs.TagModal.click()
      })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextProps in tags', nextProps)
  }

  render() {
    console.log('showingSearchResult', this.state.showingSearchResult)
    let alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='TagModal' data-toggle='modal' data-target='#create_modal'>TagModal</a>
        <a href='#/' style={{ display: 'none' }} ref='DeleteModal' data-toggle='modal' data-target='#delete_confirmation_modal'>DeleteModal</a>
        <CreateTag tag={this.state.currentTag} />
        <div style={{background: 'rgba(33, 37, 41, 0.6)', zIndex: 99991}} className='modal fade' id='delete_confirmation_modal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div style={{ transform: 'translate(0, 0)', paddingLeft: '70px', marginTop: '150px' }} className='modal-dialog' role='document'>
            <div className='modal-content' style={{ width: '400px' }} >
              <div style={{ display: 'block' }} className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Are You Sure?
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5' }} type='button' className='close'
                  data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>
                    &times;
                  </span>
                </button>
              </div>
              <div className='modal-body'>
                <p>Are you sure you want to delete this tag? It will be removed and unassigned from all subscribers.</p>
                <button style={{float: 'right', marginLeft: '10px'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deleteTag(this.state.currentTag.tag, this.msg)
                  }} data-dismiss='modal'>Yes
                </button>
                <button style={{float: 'right'}} className='btn btn-primary btn-sm' data-dismiss='modal'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='videoTags' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoTags">videoMessengerRefModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoTags" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Tags Video Tutorial
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" 
                aria-label="Close"
                onClick={() => {
                  this.setState({
                    openVideo: false
                  })}}>
                    <span aria-hidden="true">
                        &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              {this.state.openVideo && <YouTube
                  videoId='S7JmK_YINu0'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
                }
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='zeroModal' data-toggle="modal" data-target="#zeroModal">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="zeroModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div>
                  <YouTube
                    videoId='S7JmK_YINu0'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Tags</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {/* {
            this.props.pages && this.props.pages.length === 0 && !this.state.showingSearchResult
            ? <AlertMessage type='page' />
          : this.props.subscribers && this.props.subscribers.length === 0 &&
            <AlertMessage type='subscriber' />
          } */}
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding tags? Here is the <a href='https://kibopush.com/segmentation-using-tags/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>

          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        {/* <span className='m-portlet__head-icon'>
                          <i className='flaticon-interface-9' />
                        </span> */}
                        <h3 className='m-portlet__head-text m--font-primary'>
                          User Tags
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      <ul className='m-portlet__nav'>
                        <li className='m-portlet__nav-item'>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.createTag}>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                New Tag
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    {/* <div className='row align-items-center'>
                      <div className='col-xl-4 col-lg-4 col-md-4'>
                        <div className='m-input-icon m-input-icon--left'>
                          <input type='text' className='form-control m-input m-input--solid' onChange={this.searchPages} placeholder='Search...' id='generalSearch' />
                          <span className='m-input-icon__icon m-input-icon__icon--left'>
                            <span><i className='la la-search' /></span>
                          </span>
                        </div>
                      </div>
                    </div> */}
                    {this.props.tags && this.props.tags.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='name'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Name</span>
                              </th>
                              <th data-field='status'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Status</span>
                              </th>
                              <th data-field='subscriberCount'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Subscriber Count</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.props.tags.map((tag, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '150px' }}>{tag.tag}</span></td>
                                  <td data-field='status' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{tag.status}</span></td>
                                  <td data-field='subscriberCount' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{tag.subscribersCount}</span></td>
                                  <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '150px' }}>
                                        <button className='btn btn-primary btn-sm'
                                            onClick={() => this.deleteTag(tag)}
                                            style={{ float: 'right', margin: 2 }}>
                                            Delete
                                        </button>
                                        <button className='btn btn-primary btn-sm'
                                            onClick={() => this.updateTag(tag)}
                                            style={{ float: 'right', margin: 2 }}>
                                            Edit
                                        </button>
                                    </span>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                        {/* <div className='pagination'>
                          <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={<a href='#/'>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            forcePage={this.state.pageNumber} />
                        </div> */}
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

function mapStateToProps(state) {
  return {
    tags: (state.tagsInfo.tags)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadTags,
    deleteTag
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Tags)
