import React from 'react'
import PropTypes from 'prop-types'

import TIMEPICKER from '../../components/extras/timePicker'
import TimezoneSelect from 'react-timezone-select'

class BusinessHours extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      opening: '',
      closing: '',
      timezone: ''
    }

    this.putBusinessHours = this.putBusinessHours.bind(this)
    this.setOpeningTime = this.setOpeningTime.bind(this)
    this.setClosingTime = this.setClosingTime.bind(this)
    this.saveBusinessHours = this.saveBusinessHours.bind(this)
    this.setTimezone = this.setTimezone.bind(this)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = 'KiboPush'
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Business Hours`

    if (this.props.automatedOptions.businessHours) {
      this.putBusinessHours(this.props.automatedOptions.businessHours)
    }
  }

  putBusinessHours (data) {
    this.setState({
      opening: data.opening,
      closing: data.closing,
      timezone: data.timezone
    })
  }

  setOpeningTime (time) {
    this.setState({opening: time})
  }

  setClosingTime (time) {
    this.setState({closing: time})
  }

  saveBusinessHours () {
    const data = {
      opening: this.state.opening,
      closing: this.state.closing,
      timezone: this.state.timezone
    }
    let automatedOptions = JSON.parse(JSON.stringify(this.props.automatedOptions))
    automatedOptions.businessHours = data
    this.props.setBusinessHours(data, automatedOptions, (res) => {
      if (res.status === 'success') {
        this.props.alertMsg.success('Changes have been saved successfully!')
      } else {
        this.props.alertMsg.error(res.description)
      }
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.automatedOptions.businessHours) {
      this.putBusinessHours(nextProps.automatedOptions.businessHours)
    }
  }

  setTimezone (e) {
    console.log('setTimeZone', e)
    this.setState({timezone: e.value})
  }

  render () {
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <div style={{height: '82vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} className='m-portlet m-portlet--tabs'>
          <div style={{flex: '0 0 auto'}} className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Business Hours
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div style={{overflowY: 'scroll', flex: '1 1 auto'}} className='m-portlet__body'>
            <div className='form-group m-form__group row'>
              <div className='col-lg-1 col-md-1 col-sm-12' />
              <div className='col-lg-10 col-md-10 col-sm-12'>
                <div className='form-group m-form__group'>
                  <label>Select Time Zone:</label>
                  <div>
                    <TimezoneSelect
                      value={this.state.timezone}
                      onChange={this.setTimezone}
                      style={{width: '500px'}}
                      width='500'
                    />
                  </div>
                </div>
                <br />
                <div className='form-group m-form__group row'>
                  <div className='col-lg-5 col-md-5 col-sm-12'>
                    <TIMEPICKER
                      label='Opening'
                      value={this.state.opening}
                      onTimeChange={this.setOpeningTime}
                    />
                  </div>
                  <div style={{paddingLeft: '30px', display: 'flex', alignItems: 'center'}} className='col-lg-2 col-md-2 col-sm-12'>
                    <hr style={{border: '1px solid #999', width: '100%'}} />
                  </div>
                  <div className='col-lg-5 col-md-5 col-sm-12'>
                    <TIMEPICKER
                      label='Closing'
                      value={this.state.closing}
                      onTimeChange={this.setClosingTime}
                    />
                  </div>
                </div>
              </div>
              <div className='col-lg-1 col-md-1 col-sm-12' />
            </div>
            <div className='form-group m-form__group row'>
              <div className='col-lg-1 col-md-1 col-sm-12' />
              <div className='col-lg-10 col-md-10 col-sm-12'>
                <button
                  type="button"
                  className="btn btn-primary pull-right"
                  onClick={this.saveBusinessHours}
                  disabled={!(this.state.opening && this.state.closing && this.state.timezone)}
                >
                  Save
                </button>
              </div>
              <div className='col-lg-1 col-md-1 col-sm-12' />
            </div>
          </div>
      </div>
    </div>
    )
  }
}

BusinessHours.propTypes = {
  'setBusinessHours': PropTypes.func.isRequired,
  'automatedOptions': PropTypes.object.isRequired
}

export default BusinessHours
