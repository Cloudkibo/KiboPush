/* eslint-disable no-useless-constructor */
import React from 'react'
import { getAdvancedSettings, updateAdvancedSettings} from '../../redux/actions/settings.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

class AdvancedSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    props.getAdvancedSettings()
    this.onChangeSaveSetting = this.onChangeSaveSetting.bind(this)
  }
  onChangeSaveSetting (e) {
    var data = {
      updatedObject: {
        saveBroadcastInChat: e.target.checked
      }
    }
    this.props.updateAdvancedSettings(data, this.msg)
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
      <div className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Advanced Settings
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <span className='m-widget4__sub'>
                    <div className= 'm-form__group form-group row'>
                      <div className='col-6'>
                        Save broadcast messages in user chat
                      </div>
                      <div className='col-3'>
                        <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                          <label>
                            <input type='checkbox' data-switch='true' checked={this.props.advancedSettings && this.props.advancedSettings.saveBroadcastInChat ? this.props.advancedSettings.saveBroadcastInChat: false} onChange={(e) => {this.onChangeSaveSetting(e)}} />
                            <span></span>
                          </label>
                        </span>
                      </div>
                    </div>
                  </span>
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
    advancedSettings: (state.settingsInfo.advanced_settings)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getAdvancedSettings: getAdvancedSettings,
    updateAdvancedSettings: updateAdvancedSettings
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSettings)
