/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { Link } from 'react-router'

class Finish extends React.Component {
  render () {
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-portlet m-portlet--full-height'>
                <div className='m-portlet__body m-portlet__body--no-padding'>
                  <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                    <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                      <Sidebar step='8' />
                      <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                        <div className='m-portlet__head'>
                          <div className='m-portlet__head-caption'>
                            <div className='m-portlet__head-title'>
                              <h3 className='m-portlet__head-text'>
                                Step 8: Finish Setup
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='m-portlet__body'>
                          <br />
                          <div className='swal2-icon swal2-success swal2-animate-success-icon' style={{display: 'block', borderColor: '#a5dc86', webkitTapHighlightColor: 'transparent', width: '80px', height: '80px', border: '4px solid transparent', borderRadius: '50%', margin: '20px auto 30px', padding: '0', position: 'relative', boxSizing: 'content-box', cursor: 'default', userSelect: 'none', webkitBoxDirection: 'normal', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', textAlign: 'center'}}>
                            <div className='swal2-success-circular-line-left' style={{background: 'rgb(255, 255, 255)', borderRadius: '120px 0 0 120px', top: '-7px', left: '-33px', transform: 'rotate(-45deg)', transformOrigin: '60px 60px', position: 'absolute', width: '60px', height: '120px', boxSizing: 'border-box', display: 'block'}}></div>
                            <span className='swal2-success-line-tip swal2-animate-success-line-tip' style={{width: '25px', left: '14px', top: '46px', transform: 'rotate(45deg)', height: '5px', backgroundColor: '#a5dc86', display: 'block', borderRadius: '2px', position: 'absolute', zIndex: '2'}}></span>
                            <span className='swal2-success-line-long swal2-animate-success-line-long' style={{width: '47px', right: '8px', top: '38px', transform: 'rotate(-45deg)', height: '5px', backgroundColor: '#a5dc86', display: 'block', borderRadius: '2px', position: 'absolute', zIndex: '2'}}></span>
                            <div className='swal2-success-ring' style={{width: '80px', height: '80px', border: '4px solid rgba(165, 220, 134, 0.2)', borderRadius: '50%', webkitBoxSizing: 'content-box', boxSizing: 'content-box', position: 'absolute', left: '-4px', top: '-4px', zIndex: '2', display: 'block'}}></div>
                            <div className='swal2-success-fix' style={{background: 'rgb(255, 255, 255)', width: '7px', height: '90px', position: 'absolute', left: '28px', top: '8px', zIndex: '1', webkitTransform: 'rotate(-45deg)'}}></div>
                            <div className='swal2-success-circular-line-right' style={{background: 'rgb(255, 255, 255)', borderRadius: '0 120px 120px 0', top: '-11px', left: '30px', transform: 'rotate(-45deg)', transformOrigin: '0 60px', position: 'absolute', width: '60px', height: '120px', display: 'block'}}></div>
                          </div>
                          <br />
                          <div className='form-group m-form__group row'>
                            <center>
                            <label style={{fontWeight: 'normal', paddingLeft: '100px'}}>Congratulations! Your basic setup is complete. You can make further changes by going to our settings page. </label>
                            </center>
                        </div>
                        </div>
                        <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                          <div className='m-form__actions'>
                            <div className='row'>
                              <div className='col-lg-6 m--align-left' >
                                <Link to='/menuWizard' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <i className='la la-arrow-left' />
                                    <span>Back</span>&nbsp;&nbsp;
                                  </span>
                                </Link>
                              </div>
                              <div className='col-lg-6 m--align-right'>
                                <Link to='/dashboard' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <span>Finish</span>&nbsp;&nbsp;
                                    <i className='la la-arrow-right' />
                                  </span>
                                </Link>
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
        </div>
      </div>
    )
  }
}
export default Finish
