/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
class ConnectFB extends React.Component {
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
  UNSAFE_componentWillReceiveProps (nextProps) {
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
                    Connect with Facebook
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='tab-pane active' id='m_user_profile_tab_1'>
              <form className='m-form m-form--fit m-form--label-align-right'>
                <div className='m-portlet__body'>
                  <div className='form-group m-form__group m--margin-top-10 m--hide'>
                    <div className='alert m-alert m-alert--default' role='alert'>
                      The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classNamees.
                    </div>
                  </div>
                  <br /><br />
                  <center>
                    <div className='m-stack__item m-stack__item--center' style={{textAlign: 'center', paddingTop: '100px'}}>
                      <a href='/auth/facebook/' className='btn btn-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                        <span>
                          <i className='la la-power-off' />
                          <span>Connect with Facebook</span>
                        </span>
                      </a>
                    </div>
                  </center>
                </div>
              </form>
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
export default connect(mapStateToProps, mapDispatchToProps)(ConnectFB)
