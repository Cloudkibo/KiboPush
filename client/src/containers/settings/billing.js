/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
class Billing extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.save = this.save.bind(this)
  }
  save (event) {
    event.preventDefault()
    if (this.state.ismatch) {
      this.props.changePass({old_password: this.refs.current.value, new_password: this.refs.new.value}, this.msg)
    }
  }

  componentDidMount () {
    document.title = 'KiboPush | api_settings'
  }
  componentWillReceiveProps (nextProps) {
  }
  render () {
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
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
              <div className='col-md-6 col-lg-6 col-xl-6'>
                <div className='m-widget24'>
                  <div className='m-widget24__item' style={{border: 'solid 1px #ccc'}}>
                    <div style={{borderBottom: 'solid 1px #ccc'}}>
                      <h4 className='m-widget24__title'>
                        Billing Plan
                      </h4>
                      <br />
                      <a className='m-widget24__desc' style={{color: 'blue', cursor: 'pointer'}}>
                        <u>Learn more about pricing</u>
                      </a>
                      <span className='m-widget24__stats m--font-brand'>
                        FREE
                      </span>
                      <br /><br />
                    </div>
                    <center style={{marginTop: '15px', marginBottom: '15px'}}>
                      <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' data-toggle='modal' data-target='#m_modal_1_2'>
                        <span>
                          Upgrade to Pro
                        </span>
                      </button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
            <div style={{background: 'rgba(33, 37, 41, 0.6)'}} className='modal fade' id='m_modal_1_2' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
              <div style={{transform: 'translate(0, 0)'}} className='modal-dialog' role='document'>
                <div className='modal-content'>
                  <div style={{display: 'block'}} className='modal-header'>
                    <h5 className='modal-title' id='exampleModalLabel'>
                      Change Plan
                    </h5>
                    <button style={{marginTop: '-10px', opacity: '0.5'}} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                      <span aria-hidden='true'>
                        &times;
                      </span>
                    </button>
                  </div>
                  <div className='modal-body'>
                    <div className='col-12'>
                      <label>Billing Plan:</label>
                      <div className='radio-buttons' style={{marginLeft: '37px'}}>
                        <div className='radio'>
                          <input id='segmentAll'
                            type='radio'
                            value='segmentation'
                            name='segmentationType'
                            onChange={this.handleRadioButton} />
                          <label>Free</label>
                        </div>
                        <div className='radio'>
                          <input id='segmentList'
                            type='radio'
                            value='list'
                            name='segmentationType'
                            onChange={this.handleRadioButton} />
                          <label>Premium $10.00/month</label>
                        </div>
                      </div>
                    </div>
                    <div className='col-12'>
                      <label>Select Payment Method:</label>
                      <br />
                      <div className='btn' onClick={this.showDialog} style={{border: '1px solid #cccc', borderStyle: 'dotted', marginLeft: '15px'}}>
                        <i className='fa fa-plus' style={{marginRight: '10px'}} />
                        <span>Add Payment Method</span>
                      </div>
                    </div>
                    <br /><br />
                    <button className='btn btn-primary' style={{marginRight: '10px', float: 'right'}} onClick={this.onPrevious}>
                      Change
                    </button>
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
    // changeSuccess: (state.settingsInfo.changeSuccess),
    // changeFailure: (state.settingsInfo.changeFailure)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Billing)
