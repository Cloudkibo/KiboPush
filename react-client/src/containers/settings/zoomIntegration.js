/* eslint-disable no-useless-constructor */
import React from 'react'
import { getZoomIntegrations, integrateZoom } from '../../redux/actions/settings.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import CONFIRMATIONMODAL from '../../components/extras/confirmationModal'

class ZoomIntegration extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      deleteZoomIngeration: {
        firstName: '',
        lastName: ''
      },
      openVideo: false,
      zoomIntegration: {
        name: 'Zoom Meetings',
        icon: 'fa fa-video-camera',
        enabled: false,
        description: 'Zoom integration allows you to create Zoom meetings and send invitations to subscribers in order to quickly resolve their queries.',
        color: '#4A8CFF'
      }
    }
    props.getZoomIntegrations()
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
    this.redirectToAuthorizeZoom = this.redirectToAuthorizeZoom.bind(this)
    this.setDeleteZoomIntegration = this.setDeleteZoomIntegration.bind(this)
  }

  setDeleteZoomIntegration (integration) {
    this.setState({deleteZoomIngeration: integration}, () => {
      this.refs.toggleDisconnectZoom.click()
    })
  }

  redirectToAuthorizeZoom(url) {
    window.location.replace(url)
  }

  openVideoTutorial() {
    this.setState({
      openVideo: true
    })
    this.refs.videoTutorial.click()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('nextProps in ZoomIntegration', nextProps)
    if (nextProps.zoomIntegration && nextProps.zoomIntegration.connected) {
      let zoomIntegration = this.state.zoomIntegration
      zoomIntegration.enabled = true
      this.setState({ zoomIntegration })
    } else if (!nextProps.zoomIntegration || !nextProps.zoomIntegration.connected) {
      let zoomIntegration = this.state.zoomIntegration
      zoomIntegration.enabled = false
      this.setState({ zoomIntegration })
    }
  }

  render() {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <button ref='toggleDisconnectZoom' data-toggle='modal' data-target='#_confirm_zoom_disconnect' style={{ display: 'none' }} />
        <a ref='disconnectZoom' style={{ display: 'none' }} target='_blank' rel="noopener noreferrer" href={`https://marketplace.zoom.us/user/installed`}>Disconnect Zoom</a>
        <CONFIRMATIONMODAL
          id='_confirm_zoom_disconnect'
          title='Disconnect Zoom Integration'
          description={`Are you sure you want to disconnect this Zoom integration?\n\nPlease make sure you are logged in on the Zoom platform from "${this.state.deleteZoomIngeration.firstName} ${this.state.deleteZoomIngeration.lastName}" account before clicking on "Yes".\n\n`}
          onConfirm={() => this.refs.disconnectZoom.click()}
        />
        <button style={{ display: 'none' }} ref='videoTutorial' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoTutorial">videoTutorial</button>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoTutorial" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Video Tutorial
                </h5>
                <button
                  style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })
                  }}
                >
                  <span aria-hidden="true">
                    &times;
                  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                {
                  this.state.openVideo &&
                  <YouTube
                    videoId='qATErwH93f0'
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
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Zoom Integration
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              <div style={{ textAlign: 'center' }} className='alert m-alert m-alert--default' role='alert'>
                Need help in understanding Zoom Integration? Here is the <a href='https://kibopush.com/livechat/#zoomIntegration' target='_blank' rel='noopener noreferrer'>documentation</a>.
                Or check out this  <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a> to understand this feature.
              </div>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
                    <div style={{ padding: '5px', paddingLeft: '20px' }} className='alert m-alert--default'>
                      <div className='tab-content'>
                        <div className='tab-pane active' id='m_widget4_tab1_content'>
                          <div className='m-widget4'>

                            <div className='m-widget4__item'>
                              <div className='m-widget4__img m-widget4__img--logo'>
                                <span className='btn btn-success m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill' style={{ width: '50px', height: '50px', cursor: 'initial', backgroundColor: 'white', borderColor: this.state.zoomIntegration.color }}>
                                  <i className={this.state.zoomIntegration.icon} style={{ color: this.state.zoomIntegration.color, fontSize: 'x-large' }}></i>
                                </span>
                              </div>
                              <span style={{ paddingLeft: '25px' }} className='m-widget4__ext'>
                                {this.state.zoomIntegration.description}
                              </span>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

              <div>
                {
                this.props.zoomIntegrations.map((integration, i) => (
                  <div style={{display: 'flex', justifyContent: 'center', marginTop: '25px'}} className='m-widget4'>
                    <div style={{borderBottom: '1px dashed', paddingBottom: '25px'}} className='m-widget4__item' key={i}>
                      <div className='m-widget4__img m-widget4__img--logo'>
                        <span className='btn m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill' style={{width: '50px', height: '50px', cursor: 'initial', backgroundColor: 'white'}}>
                          <img alt='' style={{width: '100%', height: '100%'}} onError={(e) => e.target.src = 'https://login.vivaldi.net/profile/avatar/default-avatar.png'} src={integration.profilePic ? integration.profilePic : 'https://login.vivaldi.net/profile/avatar/default-avatar.png'}/>
                        </span>
                      </div>
                      <div className='m-widget4__info' style={{width: '140px'}}>
                        <span className='m-widget4__title'>
                          {integration.firstName + " " + integration.lastName}
                        </span>
                      </div>
                      <span className='m-widget4__ext' style={{paddingLeft: '150px'}}>
                          {integration.connected
                            ? <button onClick={() => this.setDeleteZoomIntegration(integration)} className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' style={{borderColor: '#f4516c', color: '#f4516c', marginRight: '10px'}}>
                              Disconnect
                            </button>
                            : <button onClick={() => this.props.integrateZoom(this.redirectToAuthorizeZoom)} className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}}>
                            Connect
                          </button>
                                }
                              </span>
                              <hr style={{ borderTop: '1px dashed #36a3f7' }} />
                            </div>
                          </div>
                        ))
                      }
                    </div>


                    {
                      this.props.zoomIntegrations.length < 3 &&
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                        <button
                          onClick={() => this.props.integrateZoom(this.redirectToAuthorizeZoom)}
                          style={{ border: '1px dashed #36a3f7', cursor: 'pointer' }}
                          type="button"
                          className="btn m-btn--pill btn-outline-info m-btn m-btn--custom"
                        >
                          {this.props.zoomIntegrations.length > 0 ? '+ Connect New' : '+ Connect'}
                        </button>
                      </div>
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
    user: (state.basicInfo.user),
    zoomIntegrations: (state.settingsInfo.zoomIntegrations)
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getZoomIntegrations,
    integrateZoom
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ZoomIntegration)
