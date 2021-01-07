/* eslint-disable no-useless-constructor */
import React from 'react'
import {
  getIntegrations,
  updateIntegration,
  createIntegration
} from '../../redux/actions/settings.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { findIndex } from 'lodash'
import YouTube from 'react-youtube'

class Integrations extends React.Component {
  constructor (props, context) {
    super(props, context)
    const url = window.location.hostname
    console.log('url', url)
    this.state = {
      deleteIngerationId: '',
      openVideo: false,
      integrations: [
        {
          name: 'Google Sheets',
          icon: 'fa fa-file-excel-o',
          enabled: false,
          description: 'This integration can help you save data from KiboPush to Google Sheets or vice versa',
          color: 'green'
        },
        {
          name: 'Hubspot',
          icon: 'fa fa-transgender-alt',
          enabled: false,
          description: 'This integration can help you save data from KiboPush to HubSpot or vice versa',
          color: 'orangered'
        }
      ]
    }
    props.getIntegrations()
    this.disconnect = this.disconnect.bind(this)
    this.saveIntegerationId = this.saveIntegerationId.bind(this)
    this.connect = this.connect.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoTutorial.click()
  }

  saveIntegerationId (id) {
    this.setState({deleteIngerationId:id})
  }

  disconnect (id) {
    this.props.updateIntegration(id, {enabled: false}, this.msg)
  }

  connect (id) {
    if (id) {
      this.props.updateIntegration(id, {enabled: true}, this.msg)
    } else {
      this.props.history.push({
        pathname: '/api/sheetsIntegrations/auth'
      })
      // this.props.createIntegration()
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in integrations', nextProps)
    if (nextProps.integrations && nextProps.integrations.length > 0) {
      let index
      let integrations = this.state.integrations
      for (let i = 0; i < nextProps.integrations.length; i++) {
        index = findIndex(this.state.integrations, function(o) { return o.name === nextProps.integrations[i].integrationName })
        integrations[index].enabled = nextProps.integrations[i].enabled
        integrations[index]._id = nextProps.integrations[i]._id
      }
      this.setState({integrations: integrations})
    }
  }

  render () {
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
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="deleteIntegeration" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Integration
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
									</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to disable this integration? When you will connect again your old integration will be overridden.</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    this.disconnect(this.state.deleteIngerationId)
                  }}
                  data-dismiss='modal'>Disable
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{height: '82vh'}} className='m-portlet m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Integrations
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
               <div style={{textAlign: 'center', marginBottom: '0'}} className='alert m-alert m-alert--default' role='alert'>
                Need help in understanding Zoom Integration? Here is the <a href='https://kibopush.com/livechat/#zoomIntegration' target='_blank' rel='noopener noreferrer'>documentation</a>.
                Or check out this  <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a> to understand this feature.
                </div>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
              <div className='m-portlet__body'>
                <div className='tab-content'>
                  <div className='tab-pane active' id='m_widget4_tab1_content'>
                    <div className='m-widget4'>
                      {
                      this.state.integrations.map((integration, i) => (
                        <div className='m-widget4__item' key={i}>
                          <div className='m-widget4__img m-widget4__img--logo'>
                            <span className='btn btn-success m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill' style={{backgroundColor: integration.color, borderColor: integration.color}}>
                              <i className={integration.icon} style={{color: 'white', fontSize: 'large'}}></i>
                            </span>
                          </div>
                          <div className='m-widget4__info' style={{width: '140px'}}>
                            <span className='m-widget4__title'>
                              {integration.name}
                            </span>
                          </div>
                          <span className='m-widget4__ext' style={{width: '140px'}}>
                            {integration.enabled
                              ? <button className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' data-target="#deleteIntegeration" data-toggle="modal" style={{borderColor: '#f4516c', color: '#f4516c', marginRight: '10px'}} onClick={() => this.saveIntegerationId(integration._id)}>
                                Disconnect
                              </button>
                              : <button onClick={() => {
                                if (this.props.superUser) {
                                  this.msg.error('You are not allowed to perform this action')
                                } else {
                                  let url = integration.name === 'Hubspot'? '/api/hubspotIntegrations/auth':'/api/sheetsIntegrations/auth'
                                  window.location.replace(url)
                                }
                              }}
                              className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}}>
                              Connect
                            </button>
                            }
                          </span>
                        <span className='m-widget4__ext'>
                          {integration.description}
                        </span>
                      </div>
                      ))
                    }
                    </div>
                  </div>
                </div>
              </div>
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
    integrations: (state.settingsInfo.integrations),
    user: (state.basicInfo.user),
    superUser: (state.basicInfo.superUser)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getIntegrations,
    updateIntegration,
    createIntegration
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Integrations)
