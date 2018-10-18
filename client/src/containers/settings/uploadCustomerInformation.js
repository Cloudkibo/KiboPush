/**
 * Created by imran on 17/10/2018.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'

class ResetPassword extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      file: ''
    }
    this.onFileChange = this.onFileChange.bind(this)
  }

  onFileChange (e) {
    console.log('selected file', e.target.files)
    this.setState({file: e.target.files[e.target.files.length - 1]})
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Upload Customer Information
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='tab-pane active' id='m_user_profile_tab_1'>
              <form className='m-form m-form--fit m-form--label-align-right'>
                <div className='m-portlet__body'>
                  <div className='form-group m-form__group row'>
                    <div className='col-lg-4 col-md-9 col-sm-12' />
                    <div className='col-lg-4 col-md-9 col-sm-12'>
                      <div onClick={() => this.refs.selectFile.click()} className='m-dropzone dropzone dz-clickable' id='m-dropzone-one'>
                        {
                          this.state.file === ''
                          ? <div className='m-dropzone__msg dz-message needsclick'>
                            <h3 className='m-dropzone__msg-title'>
                              Drop files here or click to upload.
                            </h3>
                          </div>
                          : <div className='m-dropzone__msg dz-message needsclick'>
                            <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='File' style={{maxHeight: 25}} />
                            <h3 className='m-dropzone__msg-title'>
                              {this.state.file.name}
                            </h3>
                          </div>
                        }
                        <input type='file' accept='.csv' onChange={this.onFileChange} style={{display: 'none'}} ref='selectFile' />
                      </div>
                    </div>
                  </div>
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
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
