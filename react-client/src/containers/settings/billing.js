/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getuserdetails, updatePlan } from '../../redux/actions/basicinfo.actions'
import AlertContainer from 'react-alert'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class Billing extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    this.state = {
      selectedRadio: props.pro === 'true' ? 'premium' : 'free',
      change: props.pro ? props.pro : false
    }
    this.change = this.change.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.save = this.save.bind(this)
    this.goToPayment = this.goToPayment.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  closeDialog () {
    this.setState({change: false})
  }

  componentDidMount () {
    document.title = 'KiboPush | api_settings'
  }
  componentWillReceiveProps (nextProps) {
    console.log('nextProps.user', nextProps.user)
    if (nextProps.user) {
      if (this.props.pro === true) {
        this.setState({selectedRadio: 'premium'})
      } else if (nextProps.user.currentPlan.unique_ID === 'plan_A' || nextProps.user.currentPlan.unique_ID === 'plan_C') {
        this.setState({selectedRadio: 'premium'})
      } else if (nextProps.user.currentPlan.unique_ID === 'plan_B' || nextProps.user.currentPlan.unique_ID === 'plan_D') {
        this.setState({selectedRadio: 'free'})
      }
    }
    if (nextProps.error) {
      if (nextProps.error === 'success') {
        this.setState({change: false})
      } else {
        this.msg.error(nextProps.error)
      }
    }
  }
  handleRadioButton (e) {
    console.log('e.currentTarget.value', e.currentTarget.value)
    this.setState({
      selectedRadio: e.currentTarget.value
    })
  }
  change (value) {
    this.setState({change: value})
  }
  save () {
    console.log('change', this.state.change)
    if (this.state.selectedRadio === 'free') {
      if (this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_B') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_B'}, this.msg)
      } else if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_D'}, this.msg)
      }
    } else if (this.state.selectedRadio === 'premium') {
      if (this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_B') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_A'}, this.msg)
      } else if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_C'}, this.msg)
      }
    }
  }

  goToPayment () {
    this.props.showPaymentMethods()
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Billing
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='row'>
              <div className='col-md-8 col-lg-8 col-xl-8'>
                <div className='m-widget24'>
                  <div className='m-widget24__item' style={{border: 'solid 1px #ccc'}}>
                    <div style={{borderBottom: 'solid 1px #ccc'}}>
                      <h4 className='m-widget24__title'>
                        Billing Plan
                      </h4>
                      <br />
                      {this.props.user && (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_A') && this.props.user.last4 &&
                      <div>
                        <span style={{marginLeft: '1.8rem'}}>
                          <i className='fa fa-credit-card-alt' />&nbsp;&nbsp;
                            xxxx xxxx xxxx xxxx {this.props.user.last4}
                        </span>
                        <br />
                      </div>
                      }
                      <a className='m-widget24__desc' style={{color: 'blue', cursor: 'pointer'}}>
                        <u>Learn more about pricing</u>
                      </a>
                      {this.props.user && (this.props.user.currentPlan.unique_ID === 'plan_B' || this.props.user.currentPlan.unique_ID === 'plan_D')
                      ? <span className='m-widget24__stats m--font-brand'>
                        FREE
                      </span>
                      : <span className='m-widget24__stats m--font-brand'>
                        PREMIUM
                      </span>
                      }
                      <br /><br />
                    </div>
                    <center style={{marginTop: '15px', marginBottom: '15px'}}>
                      <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={() => this.change(true)} data-toggle='modal' data-target='#m_modal_1_2'>
                        {this.props.user && (this.props.user.currentPlan.unique_ID === 'plan_B' || this.props.user.currentPlan.unique_ID === 'plan_D')
                        ? <span>
                          Upgrade to Pro
                        </span>
                        : <span>
                          Change Plan
                        </span>
                      }
                      </button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
            {/*this.state.change &&
              <ModalContainer style={{width: '500px'}}
                onClose={this.closeDialog}>
                <ModalDialog style={{width: '500px'}}
                  onClose={this.closeDialog}>
                  <center><h3>Change Plan</h3></center>
                  <br /><br />
                  <div className='col-12'>
                    <label>Billing Plan:</label>
                    <div className='radio-buttons' style={{marginLeft: '37px'}}>
                      <div className='radio'>
                        <input id='segmentAll'
                          type='radio'
                          value='free'
                          name='segmentationType'
                          onChange={this.handleRadioButton}
                          checked={this.state.selectedRadio === 'free'} />
                        <label>Free</label>
                      </div>
                      <div className='radio'>
                        <input id='segmentList'
                          type='radio'
                          value='premium'
                          name='segmentationType'
                          onChange={this.handleRadioButton}
                          checked={this.state.selectedRadio === 'premium'} />
                        <label>Premium</label>
                      </div>
                    </div>
                  </div>
                  {this.state.selectedRadio === 'premium' &&
                  <div className='col-12'>
                    <label>Select Payment Method:</label>
                    <br />
                    {this.props.user && this.props.user.last4
                    ? <div className='m-widget4__info'>
                      <i className='fa fa-credit-card-alt' />&nbsp;&nbsp;
                      <span className='m-widget4__title'>
                       xxxx xxxx xxxx {this.props.user.last4}
                      </span>
                    </div>
                    : <div className='btn' onClick={this.goToPayment} style={{border: '1px solid #cccc', borderStyle: 'dotted', marginLeft: '15px'}}>
                      <i className='fa fa-plus' style={{marginRight: '10px'}} />
                      <span>Add Payment Method</span>
                    </div>
                  }
                  </div>
                  }
                  <br /><br />
                  <button className='btn btn-primary' style={{marginRight: '10px', float: 'right'}} onClick={this.save.bind(this)} data-dismiss='modal' aria-label='Close'>
                    Change
                  </button>
                </ModalDialog>
              </ModalContainer>
          */}
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    error: (state.basicInfo.error)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlan: updatePlan,
    getuserdetails: getuserdetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Billing)
