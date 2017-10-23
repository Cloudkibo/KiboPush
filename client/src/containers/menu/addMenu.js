import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Select from 'react-select'

class AddMenu extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }
  render () {
    return (
      <div className='ui-block'>
        <div className='ui-block-title'>
          <div className='col-auto'>
            <div className='row _1itvFUcECHlUBFcTqPlKTP'>
              <i className='i-Drag-Hexa _35O0HGNSxbAR7AqvIFSm4S' />
              <div className='p-l-2 col-auto'>
                <div className='_3UbZsDX2IcIP1-qgw9j9dD'>
                  <div data-slate-editor='true' contenteditable='true' className='_1mnpI9N_T5WFXL302izGVM _2pxTma-wKIFpLeHZrjJaYP' autocorrect='true' spellcheck='true' role='textbox' data-gramm='false'>
                    <div>
                      <span><span>new menu item</span>
                      </span>

                    </div></div>
                  <div >
                    <div className='_2W_I5HcmSHiAGNSb7qv-Ph'><div className='_3fs94LHJ4UdYTwEI-rtKHB'>Powered By ManyChat</div>
                      <span style={{display: 'none'}} /></div><p className='_23Q3Eeng22xq_MbSLZ6RFA'>Top level of the menu is limited to 3 items max. Submenus are limited to 5.</p>
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
export default AddMenu
