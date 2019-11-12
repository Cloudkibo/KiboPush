/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
class SubmitSurvey extends React.Component {
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    } else {
      title = ''
    }
    document.title = `${title} | Submit Survey`;
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2 className='presentation-margin'>Thank you.</h2>
            <p>Response recorded successfully.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default (SubmitSurvey)
