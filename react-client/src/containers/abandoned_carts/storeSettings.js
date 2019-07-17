import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'
import AlertContainer from 'react-alert'
import { updateStoreInfo } from '../../redux/actions/abandonedCarts.actions'

class ItemSettings extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      cartAlertEnabled: props.store[0].cartAlertEnabled,
      sendOrderUpdates: props.store[0].sendOrderUpdates,
      alertMessage: props.store[0].alertMessage,
      schedule: props.store[0].schedule,
      criteria: props.store[0].schedule.condition === 'immediately' ? 'immediately' : 'after'
    }
    this.handleAlertStatus = this.handleAlertStatus.bind(this)
    this.handleOrderUpdatesStatus = this.handleOrderUpdatesStatus.bind(this)
    this.handleAlertMessage = this.handleAlertMessage.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.changeCriteria = this.changeCriteria.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.changeValue = this.changeValue.bind(this)
  }

  componentDidMount () {
  }

  changeCondition (e) {
    let schedule = this.state.schedule
    schedule.condition = e.target.value
    this.setState({schedule: schedule})
  }

  changeCriteria (e) {
    let schedule = this.state.schedule
    if (e.target.value === 'immediately') {
      schedule.condition = 'immediately'
      this.setState({schedule: schedule, criteria: 'immediately'})
    } else {
      schedule.condition = this.state.schedule.condition
      this.setState({criteria: 'after', schedule: schedule})
    }
  }

  changeValue (e) {
    let schedule = this.state.schedule
    schedule.value = e.target.value
    this.setState({schedule: schedule})
  }

  handleSave () {
    if (this.state.cartAlertEnabled && this.state.alertMessage === '') {
      this.msg.error('Alert Message cannot be empty')
      return
    }
    if (this.state.schedule < this.props.store[0].schedule) {
      this.msg.error('Invalid Schedule')
      return
    }
    this.props.updateStoreInfo(this.props.store[0]._id, {cartAlertEnabled: this.state.cartAlertEnabled,
      sendOrderUpdates: this.state.sendOrderUpdates,
      alertMessage: this.state.alertMessage,
      schedule: this.state.schedule
    }, this.msg)
  }

  handleAlertMessage (e) {
    this.setState({alertMessage: e.target.value})
  }

  handleOrderUpdatesStatus (e) {
    this.setState({sendOrderUpdates: e.target.checked})
  }

  handleAlertStatus (e) {
    this.setState({cartAlertEnabled: e.target.checked})
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Configuration
                  </h3>
                </div>
              </div>
            </div>
            <form className='m-form m-form--label-align-right'>
              <div className='m-portlet__body'>
                <div className='m-form__section m-form__section--first'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      Abandoned Checkout
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Send Alert Message
                    </label>
                    <div className='col-lg-6'>
                      <span className='m-switch m-switch--icon m-switch--primary'>
                        <label>
                          <input type='checkbox' data-switch='true' checked={this.state.cartAlertEnabled} onChange={this.handleAlertStatus} />
                          <span></span>
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Alert Message
                    </label>
                    <div className='col-lg-6'>
                      <textarea className='form-control m-input' onChange={this.handleAlertMessage} value={this.state.alertMessage} disabled={!this.state.cartAlertEnabled} rows='3' />
                    </div>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Schedule
                    </label>
                    <div className='row col-lg-6'>
                      <div className='col-lg-5 col-md-5 col-sm-5' style={{ marginBottom: '10px' }}>
                        <select className='form-control m-input' onChange={(e, i) => this.changeCriteria(e, i)}
                          value={this.state.criteria}>
                          <option value='after'>After</option>
                          <option value='immediately'>Immediately</option>
                        </select>
                      </div>
                      <div className='col-lg-3 col-md-3 col-sm-3'>
                        <input id='example-text-input' type='number' min='0' step='1' value={this.state.schedule.value} className='form-control' onChange={this.changeValue}
                          disabled={this.state.criteria === 'immediately'} />
                      </div>
                      <div className='col-lg-4 col-md-4 col-sm-4'>
                        <select className='form-control m-input' disabled={this.state.criteria === 'immediately'}
                          value={this.state.schedule.condition} onChange={(e, i) => this.changeCondition(e, i)} >
                          <option value='minutes'>Minute(s)</option>
                          <option value='hours'>Hour(s)</option>
                          <option value='days'>Day(s)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{marginBottom: '40px'}} className='m-form__section m-form__section--last'>
                  <div className='m-form__heading'>
                    <h3 className='m-form__heading-title'>
                      New Order
                    </h3>
                  </div>
                  <div className='form-group m-form__group row'>
                    <label className='col-lg-2 col-form-label'>
                      Send Order Updates
                    </label>
                    <div className='col-lg-6'>
                      <span className='m-switch m-switch--icon m-switch--primary'>
                        <label>
                          <input type='checkbox' data-switch='true' checked={this.state.sendOrderUpdates} onChange={this.handleOrderUpdatesStatus} />
                          <span></span>
                        </label>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='m-portlet__foot m-portlet__foot--fit'>
                <div className='m-form__actions m-form__actions'>
                  <div className='row'>
                    <div className='col-lg-10' />
                    <div className='col-lg-2'>
                      <button className='btn btn-primary' type='button' onClick={this.handleSave} >
                        Save
                      </button>
                      <span>&nbsp;&nbsp;</span>
                      <Link to='/abandonedCarts'>
                        <button className='btn btn-secondary'>
                          Back
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    store: (state.abandonedInfo.storeList)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      updateStoreInfo
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemSettings)
