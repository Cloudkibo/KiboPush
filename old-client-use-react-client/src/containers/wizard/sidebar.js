import React from 'react'
import { Link, browserHistory } from 'react-router'
import {getCurrentProduct} from '../../utility/utils'
import $ from 'jquery'

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.redirectFunction = this.redirectFunction.bind(this)
  }
  componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }
  redirectFunction (redirectionLink) {
    browserHistory.push({
      pathname: redirectionLink,
      state: 'history'
    })
  }

  componentDidMount () {
    /* eslint-disable */
     $('#sidebarDiv').addClass('hideSideBar')
     /* eslint-enable */
  }
  render () {
    console.log('stepNumber', this.props.stepNumber)
    return (
      <div id='sidebarDiv' className='col-xl-3 col-lg-12 m--padding-top-20 m--padding-bottom-15' style={{paddingLeft: '0', paddingRight: '0', paddingTop: '20px !important', paddingBottom: '15px !important', position: 'relative', width: '100%', minHeight: '1px'}}>
        <div className='m-wizard__head' style={{padding: '0'}}>
          <div className='m-wizard__nav' style={{paddingBottom: '2rem', display: 'table', width: 'auto', margin: '2rem auto 0 auto'}}>
            <div className='m-wizard__steps' style={{display: 'block'}}>
              {/* this.props.step === '1'
                ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                  <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                    <Link to='/addPageWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                      <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>1</span>
                      </span>
                    </Link>
                    <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                      Connect<br /> Pages
                  </div>
                  </div>
                </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link onClick={() => this.redirectFunction('/addPageWizard')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>1</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                  Connect<br /> Pages
                  </div>
                  {this.props.step > 1 &&
                  <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                    <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                  </div>
                  }
                </div>
              </div>
              */}
              {this.props.step === '1'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/inviteUsingLinkWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>1</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Invite<br /> Subscribers
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link onClick={this.props.pages && this.props.pages.length === 0 ? this.props.showError : () => this.redirectFunction('/inviteUsingLinkWizard')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>1</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Invite<br /> Subscribers
                  </div>
                  {this.props.step > 1 &&
                    <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                      <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                    </div>
                  }
                </div>
              </div>
              }
              {this.props.step === '2'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/greetingTextWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>2</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Greeting<br /> Text
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link onClick={this.props.pages && this.props.pages.length === 0 ? this.props.showError : () => this.redirectFunction('/greetingTextWizard')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>2</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Greeting<br /> Text
                  </div>
                  {this.props.step > 2 &&
                    <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                      <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                    </div>
                }
                </div>
              </div>
              }
              {this.props.step === '3'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/welcomeMessageWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>3</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Welcome<br /> Message
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link onClick={this.props.pages && this.props.pages.length === 0 ? this.props.showError : () => this.redirectFunction('/welcomeMessageWizard')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>3</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Welcome<br /> Message
                  </div>
                  {this.props.step > 3 &&
                    <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                      <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                    </div>
                  }
                </div>
              </div>
              }
              {getCurrentProduct() === 'KiboEngage' &&
              <div>
                {this.props.step === '4'
                ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                  <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                    <Link to='/autopostingWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                      <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>4</span>
                      </span>
                    </Link>
                    <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                      Autoposting<br /> Feeds
                  </div>
                  </div>
                </div>
                : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                  <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                    <Link onClick={this.props.pages && this.props.pages.length === 0 ? this.props.showError : () => this.redirectFunction('/autopostingWizard')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                      <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>4</span>
                      </span>
                    </Link>
                    <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                      Autoposting<br /> Feeds
                    </div>
                    {this.props.step > 4 &&
                      <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                        <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                      </div>
                  }
                  </div>
                </div>
                }
              </div>
            }
              {this.props.step === '5'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/menuWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>{this.props.stepNumber}</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Persistent<br /> Menu
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link onClick={this.props.pages && this.props.pages.length === 0 ? this.props.showError : () => this.redirectFunction('/menuWizard')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>{this.props.stepNumber}</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Persistent<br /> Menu
                  </div>
                  {this.props.step > 5 &&
                    <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                      <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                    </div>
                }
                </div>
              </div>
              }
              {getCurrentProduct() === 'KiboChat' &&
                <div>
                  {this.props.step === '6'
                ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                  <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                    <Link to='/responseMethods' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                      <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>{this.props.stepNumber + 1}</span>
                      </span>
                    </Link>
                    <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                      Response<br /> Methods
                  </div>
                  </div>
                </div>
                : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                  <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                    <Link onClick={this.props.pages && this.props.pages.length === 0 ? this.props.showError : () => this.redirectFunction('/responseMethods')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                      <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>{this.props.stepNumber + 1}</span>
                      </span>
                    </Link>
                    <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                      Response<br /> Methods
                    </div>
                    {this.props.step > 6 &&
                      <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                        <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                      </div>
                  }
                  </div>
                </div>
                }
                </div>
              }
              {/* this.props.step === '8'
            ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
              <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                <Link to='/paymentMethodsWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                  <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>{(this.props.user.uiMode.mode === 'kiboengage' || this.props.user.uiMode.mode === 'kibocommerce') ? this.props.stepNumber + 1 : (this.props.user.uiMode.mode === 'kibochat' || this.props.user.uiMode.mode === 'all') ? this.props.stepNumber + 2 : this.props.stepNumber}</span>
                  </span>
                </Link>
                <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '1rem'}}>
                  Choose<br /> Plan
              </div>
              </div>
            </div>
            : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
              <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                <Link onClick={this.props.pages && this.props.pages.length === 0 ? this.props.showError : () => this.redirectFunction('/paymentMethodsWizard')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                  <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>{(this.props.user.uiMode.mode === 'kiboengage' || this.props.user.uiMode.mode === 'kibocommerce') ? this.props.stepNumber + 1 : (this.props.user.uiMode.mode === 'kibochat' || this.props.user.uiMode.mode === 'all') ? this.props.stepNumber + 2 : this.props.stepNumber}</span>
                  </span>
                </Link>
                <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                  Choose<br /> Plan
                </div>
                {this.props.step > 8 &&
                  <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                    <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                  </div>
              }
              </div>
            </div>
            */}
              {this.props.step === '7'
            ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
              <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                <Link to='/finish' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                  <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>{getCurrentProduct() === 'KiboEngage' ? this.props.stepNumber + 1 : this.props.stepNumber + 2}</span>
                  </span>
                </Link>
                <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                  Subscribe To<br /> KiboPush
              </div>
              </div>
            </div>
            : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '1rem', padding: '0.02rem 1rem 0.05rem 0'}}>
              <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                <Link onClick={this.props.pages && this.props.pages.length === 0 ? this.props.showError : () => this.redirectFunction('/finish')} className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', cursor: 'pointer'}}>
                  <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>{getCurrentProduct() === 'KiboEngage' ? this.props.stepNumber + 1 : this.props.stepNumber + 2}</span>
                  </span>
                </Link>
                <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                  Subscribe To<br /> KiboPush
                </div>
                {this.props.step > 7 &&
                  <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                    <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                  </div>
              }
              </div>
            </div>
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Sidebar
