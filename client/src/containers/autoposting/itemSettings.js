import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'

class ItemSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleSelectChange = this.handleSelectChange.bind(this)
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

  handleSelectChange (value) {
    console.log('onChange function called')
  }

  render () {
    console.log(this.props.location.state)
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3><i style={{color: this.props.location.state.iconColor}} className={this.props.location.state.icon} aria-hidden='true' /> {this.props.location.state.title}</h3>
                  <br />
                  <div className='table-responsive'>
                    <form>
                      <div className='form-group'>
                        <label>Account Title</label>
                        <input type='text' className='form-control' placeholder={this.props.location.state.title} />
                      </div>
                      <div className='form-group'>
                        <label>Status</label>
                        <select value='Active' onChange={() => this.handleSelectChange}>
                          <option value='Active'>Active</option>
                          <option value='Disabled'>Disabled</option>
                        </select>
                      </div>
                      <div className='form-group'>
                        <label>Time Zone Setting</label>
                        <select value='Limit sending time' onChange={() => this.handleSelectChange}>
                          <option value='Send all at the same time'>Send all at the same time</option>
                          <option value='Limit sending time'>Limit sending time</option>
                        </select>
                      </div>
                      <div className='form-group'>
                        <label>Notification Setting</label>
                        <select value='Silent push' onChange={() => this.handleSelectChange}>
                          <option value='Regular push'>Regular push</option>
                          <option value='Silent push'>Silent push</option>
                        </select>
                      </div>
                      <fieldset className='form-group'>
                        <legend>Set Targetting</legend>
                        <div className='form-group'>
                          <label>Select Page</label>
                          <select multiple className='form-control'>
                            <option value='KiboPush'>KiboPush</option>
                            <option value='CloudKibo'>CloudKibo</option>
                            <option value='KiboEngage'>KiboEngage</option>
                          </select>
                        </div>
                        <div className='form-group'>
                          <label>Select Gender</label>
                          <select multiple className='form-control'>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                          </select>
                        </div>
                        <div className='form-group'>
                          <label>Select Locale</label>
                          <select multiple className='form-control'>
                            <option value='en_US'>en_US</option>
                            <option value='af_ZA'>af_ZA</option>
                            <option value='ar_AR'>ar_AR</option>
                            <option value='az_AZ'>az_AZ</option>
                            <option value='pa_IN'>pa_IN</option>
                          </select>
                        </div>
                      </fieldset>
                    </form>
                    <button className='btn btn-primary btn-sm'>Save Changes</button>
                    <Link
                      to='/autoposting'
                      className='btn btn-sm btn-border-think btn-transparent c-grey'
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

            </main>

          </div>
        </div>
      </div>
    )
  }
}

export default ItemSettings
