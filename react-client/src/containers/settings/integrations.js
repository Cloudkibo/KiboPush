/* eslint-disable no-useless-constructor */
import React from 'react'
import { getIntegrations, updateIntegration, createIntegration } from '../../redux/actions/settings.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { findIndex } from 'lodash'

class Integrations extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      integrations: [
        {name: 'Google Sheets',
          icon: 'fa fa-file-excel-o',
          enabled: false,
          description: 'This integration can help you save data from KiboPush to Google Sheets or vice versa',
          color: 'green'
        },
        {name: 'DialogFlow',
          icon: 'fa fa-cube',
          enabled: false,
          description: 'This integration can help you link DailogFlow Agent with Facebook Page',
          color: 'orange'}
      ],
    }

    props.getIntegrations()

    this.disconnect = this.disconnect.bind(this)
    this.connect = this.connect.bind(this)
  }

  disconnect (id) {
    this.props.updateIntegration(id, {enabled: false})
  }

  connect (id) {
    if (id) {
      this.props.updateIntegration(id, {enabled: true})
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
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
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
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
                    <div className='m-portlet__body'>
                      <div className='form-group m-form__group'>
                        <div style={{textAlign: 'center'}} className='alert m-alert m-alert--default' role='alert'>
                        Need help in understanding Integrations? Here is the <a href='http://kibopush.com/webhook/' target='_blank' rel='noopener noreferrer'>documentation</a>.
                        Or check out this <a href='#/' data-toggle='modal' data-target='#video'>video tutorial</a> to understand this feature.
                        </div>
                      </div>
                      <div className='tab-content'>
                        <div className='tab-pane active' id='m_widget4_tab1_content'>
                          <div className='m-widget4'>
                            {this.state.integrations.map((integration, i) => (
                              <div className='m-widget4__item' key={i}>
        												<div className='m-widget4__img m-widget4__img--logo'>
                                  <a href='#/' className='btn btn-success m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill' style={{backgroundColor: 'white', borderColor: integration.color}}>
                                    <i className={integration.icon} style={{color: integration.color, fontSize: 'large'}}></i></a>
        												</div>
        												<div className='m-widget4__info' style={{width: '140px'}}>
        													<span className='m-widget4__title'>
        														{integration.name}
        													</span>
        												</div>
        												<span className='m-widget4__ext' style={{width: '140px'}}>
                                  {integration.enabled
                                   ? <button className='m-btn m-btn--pill m-btn--hover-danger btn btn-danger' style={{borderColor: '#f4516c', color: '#f4516c', marginRight: '10px'}} onClick={() => this.disconnect(integration._id)}>
                                     Disconnect
                                   </button>
                                   : <a href='/api/sheetsIntegrations/auth' className='m-btn m-btn--pill m-btn--hover-success btn btn-success' style={{borderColor: '#34bfa3', color: '#34bfa3', marginRight: '10px'}}>
                                   Connect
                                 </a>
                                 }
						                   </span>
                              <span className='m-widget4__ext'>
                                {integration.description}
      												</span>
      											</div>
                            ))}
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
    integrations: (state.settingsInfo.integrations)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getIntegrations: getIntegrations,
    updateIntegration: updateIntegration,
    createIntegration
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Integrations)
