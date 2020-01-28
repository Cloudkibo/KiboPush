/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'
import CopyToClipboard from 'react-copy-to-clipboard'
import AlertContainer from 'react-alert'
import { isWebURL, isWebViewUrl, getHostName } from './../../utility/utils'
import { saveWhiteListDomains, fetchWhiteListedDomains, deleteDomain } from '../../redux/actions/settings.actions'

class JSSnippet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      snippet: '<Script />',
      domainText: '',
      domains: '',
      copied: false
    }
    
    this.changeTab = this.changeTab.bind(this)
    this.onDomainTextChange = this.onDomainTextChange.bind(this)
    this.saveDomain = this.saveDomain.bind(this)
    this.removeDomain = this.removeDomain.bind(this)
    this.handleSaveDomain = this.handleSaveDomain.bind(this)
    props.fetchWhiteListedDomains(props.fbPageId)
  }
  
  componentDidMount () {
  }

  handleSaveDomain (resp) {
    if (resp.status === 'success') {
      var domains = resp.payload
      this.setState({
        domains: domains,
        domainText: ''
      })
      this.msg.success('Domain saved successfully')
    }
  }
  onDomainTextChange (e) {
    this.setState({
      domainText: e.target.value
    })
  }
  removeDomain (value) {
    var payload = {page_id: this.props.fbPageId, whitelistDomain: value}
    this.props.deleteDomain(payload, this.msg,  () => { this.props.fetchWhiteListedDomains(this.props.fbPageId)})
  }
  saveDomain () {
    let domains = this.state.domains
    for (var i = 0; i < domains.length; i++) {
      console.log(getHostName(domains[i]))
      console.log(getHostName(this.state.domainText))
       if (getHostName(domains[i]) === getHostName(this.state.domainText)) {
         this.msg.error('Domain is already whitelisted')
         return
       }

    }
    if (isWebURL(this.state.domainText)) {
      if (!isWebViewUrl(this.state.domainText)) {
        return this.msg.error('Url must include a protocol identifier e.g.(https://)')
      }
      var payload = {page_id: this.props.fbPageId, whitelistDomains: [this.state.domainText]}
      this.props.saveWhiteListDomains(payload, this.msg, this.handleSaveDomain)
    } else {
      this.msg.error('Please enter a valid URL, including the protocol identifier (e.g. "https://"")')
    }
  }
  changeTab (tab) {
    $('#authorize_tab').removeClass('active')
    $('#snippet_tab').removeClass('active')
    $('#authorize').removeClass('active')
    $('#snippet').removeClass('active')
    if (tab === 'authorize') {
      $('#authorize_tab').addClass('active')
      $('#authorize').addClass('active')
    } else if (tab === 'snippet') {
      $('#snippet_tab').addClass('active')
      $('#snippet').addClass('active')
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.whitelistDomains) {
      this.setState({
        domains: nextProps.whitelistDomains
      })
    }
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
      <div>
         <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='row' style={{display: 'flex', justifyContent: 'center'}}>
          <ul className='nav nav-tabs m-tabs-line m-tabs-line--primary m-tabs-line--2x' role='tablist'>
            <li className='nav-item m-tabs__item'>
              <a id='authorize' href='#/' className="active in nav-link m-tabs__link" onClick={() => { this.changeTab('authorize') }}>
                <i className='fa fa-check-circle'></i>
                  Authorize
              </a>
            </li>
            <li className='nav-item m-tabs__item'>
              <a id='snippet' href='#/' className="nav-link m-tabs__link" onClick={() => { this.changeTab('snippet') }}>
                <i className="fa fa-download"></i>
                  Install Snippet
              </a>
            </li>
          </ul>
        </div>
        <div className='row'>
          <div className="tab-content col-12">
            <div className="active in tab-pane" id="authorize_tab">
              {this.state.domains && this.state.domains.length > 0 &&
                <div className='row' style={{minWidth: '150px', padding: '10px', maxHeight: '150px', overflow: 'scroll'}}>
                  {
                    this.state.domains.map((domain, i) => (
                      <span key={i} style={{display: 'flex'}} className='tagLabel'>
                        <label className='tagName'>{domain}</label>
                        <div className='deleteTag' style={{marginLeft: '10px'}}>
                          <i className='fa fa-times fa-stack' style={{marginRight: '-8px', cursor: 'pointer'}} onClick={() => this.removeDomain(domain)} />
                        </div>
                      </span>
                    ))
                  }
                </div>
              }
              <br />
              <div className='row'>
                <div className='col-8'>
                  <input style={{width: '100%'}} className='form-control m-input' placeholder='Enter valid domain' value={this.state.domainText} onChange={this.onDomainTextChange} />
                </div>
                <br />
                <div className='col-4'>
                  <button className='btn btn-primary pull-right' disabled={this.state.domainText === ''} onClick={this.saveDomain}>Add</button>
                </div>
              </div>
            </div>
            <div className="tab-pane" id="snippet_tab">
               <p>
                 This code allows us to put overlay widget on your websites and track subscribers activity. Place it in the &lt;head&gt;
                of every page of your website
               </p>
               <br />
               <div style={{background: 'lightgray', padding: '10px', marginLeft: '10px', marginRight: '10px'}}>
                  {this.state.snippet}
                </div>
                <br />
                <center>
                  <CopyToClipboard text={this.state.snippet}
                    onCopy={() => {
                      this.setState({copied: true})
                      toastr.options = {
                        'closeButton': true,
                        'debug': false,
                        'newestOnTop': false,
                        'progressBar': false,
                        'positionClass': 'toast-bottom-right',
                        'preventDuplicates': false,
                        'showDuration': '300',
                        'hideDuration': '1000',
                        'timeOut': '5000',
                        'extendedTimeOut': '1000',
                        'showEasing': 'swing',
                        'hideEasing': 'linear',
                        'showMethod': 'fadeIn',
                        'hideMethod': 'fadeOut'
                      }

                      toastr.success('Script Copied Successfully', 'Copied!')
                    }
                  }>
                    <button type='button' className='btn btn-success'>
                      Copy to Clipboard
                    </button>
                </CopyToClipboard>
              </center>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    currentWidget: (state.overlayWidgetsInfo.currentWidget),
    pages: (state.pagesInfo.pages),
    whitelistDomains: (state.settingsInfo.whitelistDomains)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateWidget: updateWidget,
    saveWhiteListDomains: saveWhiteListDomains,
    fetchWhiteListedDomains: fetchWhiteListedDomains,
    deleteDomain: deleteDomain
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(JSSnippet)
