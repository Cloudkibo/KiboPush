/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Header extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <header id='headerDiv' className='m-grid__item m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
        <div className='m-container m-container--fluid m-container--full-height'>
          <div className='m-stack m-stack--ver m-stack--desktop'>
            <div style={{width: '220px'}} className='m-stack__item m-brand  m-brand--skin-dark' />
            <div className='m-stack__item m-brand  m-brand--skin-dark '>
              <div className='m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                  <h4 className='m-brand__logo-wrapper' style={{color: 'white'}}>
                    KIBOPUSH
                  </h4>
                </div>
              </div>
            </div>
            <div style={{background: '#282a3c'}} className='m-stack__item m-stack__item--fluid m-header-head' id='m_header_nav'>
              <div id='m_header_topbar' className='m-topbar  m-stack m-stack--ver m-stack--general'>
                <div className='m-stack__item m-topbar__nav-wrapper'>
                  <ul className='m-topbar__nav m-nav m-nav--inline'>
                    <li style={{marginTop: '20px'}} className=' btn btn-sm m-btn m-btn--pill m-btn--gradient-from-focus m-btn--gradient-to-danger'>
                      <a href='https://www.ssa.gov/' target='_blank' rel='noopener noreferrer' style={{color: 'white', textDecoration: 'none'}}> Visit Website </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{width: '220px'}} className='m-stack__item m-brand  m-brand--skin-dark' />
          </div>
        </div>
      </header>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)
