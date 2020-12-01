import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import YouTube from 'react-youtube'
import { getMessengerComponents } from '../../redux/actions/messengerComponents.actions'
import AlertContainer from 'react-alert'

class MessengerComponents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openVideo: false
    }
    props.getMessengerComponents()
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.video.click()
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Messenger Components`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextProps in messengerComponents', nextProps)
  }

  render() {
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
        <a href='#/' style={{ display: 'none' }} ref='modal' data-toggle='modal' data-target='#create_modal'>Modal</a>
        <a href='#/' style={{ display: 'none' }} ref='DeleteModal' data-toggle='modal' data-target='#delete_confirmation_modal'>DeleteModal</a>
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
                <p>Are you sure you want to delete this custom field? It will be removed and unassigned from all subscribers.</p>
                <button style={{float: 'right', marginLeft: '10px'}}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.props.deleteCustomField(this.state.currentCustomField._id, this.msg)
                  }} data-dismiss='modal'>Yes
                </button>
                <button style={{float: 'right'}} className='btn btn-primary btn-sm' data-dismiss='modal'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='video' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#video">videoMessengerRefModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Messenger Components Video Tutorial
                </h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                        &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              {this.state.openVideo && <YouTube
                  videoId='4l788ODM90s'
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
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
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
                <div>
                {this.state.openVideo && <YouTube
                    videoId='9kY3Fmj_tbM'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Messenger Components</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Messenger Components? Here is the <a href='http://kibopush.com/custom-fields/' target='_blank' rel='noopener noreferrer'>documentation</a>.
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
                        <h3 className='m-portlet__head-text'>
                          Messenger Components by CloudKibo
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      <ul className='m-portlet__nav'>
                        <li className='m-portlet__nav-item'>
                          <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'
                            onClick={() => {
                              this.props.history.push({
                                pathname: `/createMessengerComponent`
                              })
                            }}>
                            <span>
                              <i className='la la-plus' />
                              <span>
                                Create New
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    {this.props.messengerComponents && this.props.messengerComponents.length > 0
                      ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                        <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflowX: 'auto' }}>
                          <thead className='m-datatable__head'>
                            <tr className='m-datatable__row'
                              style={{ height: '53px' }}>
                              <th data-field='name'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Name</span>
                              </th>
                              <th data-field='category'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Category</span>
                              </th>
                              <th data-field='status'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '100px' }}>Status</span>
                              </th>
                              <th data-field='actions'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{ width: '150px' }}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.props.messengerComponents.map((messengerComponent, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{ height: '55px' }} key={i}>
                                  <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{messengerComponent.componentName}</span></td>
                                  <td data-field='category' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{messengerComponent.category}</span></td>
                                  <td data-field='status' className='m-datatable__cell--center m-datatable__cell'><span style={{ width: '100px' }}>{messengerComponent.status}</span></td>
                                  <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{ width: '150px' }}>
                                        <button className='btn btn-primary btn-sm'
                                            style={{margin: 2}}>
                                            View
                                        </button>
                                        <button className='btn btn-primary btn-sm'
                                            style={{margin: 2}}>
                                            Edit
                                        </button>
                                    </span>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
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
    messengerComponents: (state.messengerComponentsInfo.messengerComponents)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMessengerComponents
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessengerComponents)
