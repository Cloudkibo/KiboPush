/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'

class Intents extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
   
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Create Bot`;
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
            </div>
          </div>
        </div>
        <div className='m-content'>
            <div className='row'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                    <div id='identity' className='m-portlet m-portlet--mobile' style={{height: '100%'}}>
                        <div className='m-portlet__body'>
                            <h3 className='m-subheader__title'>Create Bot</h3>
                        </div>
                        <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
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
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {

    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Intents)
