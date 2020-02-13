/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class StepsBar extends React.Component {
  render () {
    return (
      <div>
      <div className='row'>
        <div className='col-md-3'>
              <a href='#/' style={{display: 'tableCell', verticalAlign: 'middle', textDecoration: 'none', padding: '0.0715rem 0px', cursor: 'pointer'}}>
                <span style={{backgroundColor: 'rgb(244, 245, 248)', width: '3rem', height: '3rem', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                  <span style={{color: 'rgb(164, 166, 174)', fontSize: '1.5rem', fontWeight: '500'}}>1</span>
                </span>
              </a>
            </div>
      </div>
      <div className="stepwizard">
  <div className="stepwizard-row">
    <div className="stepwizard-step"> <a class="btn btn-default btn-circle active-step" href="#step-1" data-toggle="tab" >1</a>
      <p>Title</p>
    </div>
    <div className="stepwizard-step"> <a class="btn btn-default btn-circle" disabled="disabled" href="#step-2" data-toggle="tab">2</a>
      <p>tag</p>
    </div>
    <div className="stepwizard-step"> <a class="btn btn-default btn-circle" disabled="disabled" href="#step-3" data-toggle="tab">3</a>
      <p>Description</p>
    </div>
    <div className="stepwizard-step"> <a class="btn btn-default btn-circle" disabled="disabled" href="#step-4" data-toggle="tab">4</a>
      <p>Preview</p>
    </div>
  </div>
</div>
</div>
    )
  }
}

export default StepsBar
