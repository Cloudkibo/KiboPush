import React from 'react'
import { Link } from 'react-router'

class Sidebar extends React.Component {
  render () {
    return (
      <div className='col-xl-3 col-lg-12 m--padding-top-20 m--padding-bottom-15' style={{paddingLeft: '0', paddingRight: '0', paddingTop: '20px !important', paddingBottom: '15px !important', position: 'relative', width: '100%', minHeight: '1px'}}>
        <div className='m-wizard__head' style={{padding: '0'}}>
          <div className='m-wizard__nav' style={{paddingBottom: '2rem', display: 'table', width: 'auto', margin: '2rem auto 0 auto'}}>
            <div className='m-wizard__steps' style={{display: 'block'}}>
              {this.props.step === '1'
                ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
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
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/addPageWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0'}}>
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
              }
              {this.props.step === '2'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/inviteUsingLinkWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>2</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Invite<br /> Subscribers
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/inviteUsingLinkWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>2</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Invite<br /> Subscribers
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
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/greetingTextWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>3</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Greeting<br /> Text
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/greetingTextWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>3</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Greeting<br /> Text
                  </div>
                  {this.props.step > 3 &&
                    <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                      <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                    </div>
                }
                </div>
              </div>
              }
              {this.props.step === '4'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/welcomeMessageWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>4</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Welcome<br /> Message
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='welcomeMessageWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>4</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Welcome<br /> Message
                  </div>
                  {this.props.step > 4 &&
                    <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                      <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                    </div>
                  }
                </div>
              </div>
              }
              {this.props.step === '5'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/autopostingWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>5</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Autoposting<br /> Feeds
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='autopostingWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>5</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Autoposting<br /> Feeds
                  </div>
                  {this.props.step > 5 &&
                    <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                      <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                    </div>
                }
                </div>
              </div>
              }
              {this.props.step === '6'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/workflowWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>6</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Setup<br /> Workflows
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/workflowWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>6</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Setup<br /> Workflows
                  </div>
                  {this.props.step > 6 &&
                    <div className='m-wizard__step-icon' style={{textAlign: 'right', paddingLeft: '6rem', display: 'table-cell', verticalAlign: 'middle', color: '#575962', fontSize: '13px', fontWeight: '300', fontFamily: 'Poppins'}}>
                      <i className='la la-check' style={{color: '#716aca', fontSize: '35px', fontWeight: 'normal', display: 'inline-block', font: 'normal normal normal "LineAwesome"', textDecoration: 'inherit', textRendering: 'optimizeLegibility', textTransform: 'none', textAlign: 'right'}} />
                    </div>
                }
                </div>
              </div>
              }
              {this.props.step === '7'
              ? <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0', backgroundColor: '#716aca'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/menuWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0', color: '#5867dd', backgroundColor: 'transparent'}}>
                    <span style={{backgroundColor: '#3d3698', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#ffffff', fontSize: '1.7rem', fontWeight: '500'}}>7</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#ffffff', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Persistent<br /> Menu
                </div>
                </div>
              </div>
              : <div className='m-wizard__step m-wizard__step--current' data-wizard-target='#m_wizard_form_step_1' style={{borderRadius: '2rem', marginBottom: '2rem', padding: '0.02rem 1rem 0.05rem 0'}}>
                <div className='m-wizard__step-info' style={{width: '100%', display: 'table'}}>
                  <Link to='/menuWizard' className='m-wizard__step-number' style={{display: 'table-cell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0 0.0715rem 0'}}>
                    <span style={{backgroundColor: '#f4f5f8', width: '4rem', height: '4rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                      <span style={{color: '#a4a6ae', fontSize: '1.7rem', fontWeight: '500'}}>7</span>
                    </span>
                  </Link>
                  <div className='m-wizard__step-label' style={{color: '#9699a2', width: '100%', display: 'table-cell', verticalAlign: 'middle', fontWeight: '500', paddingLeft: '2rem'}}>
                    Persistent<br /> Menu
                  </div>
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
