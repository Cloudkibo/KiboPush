/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { isWebURL, isWebViewUrl } from './../../utility/utils'
import { saveWhiteListDomains, fetchWhiteListedDomains, deleteDomain } from '../../redux/actions/settings.actions'
import URL from 'url'

class WhiteListDomains extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      domainText: '',
      domains: [],
      selectPage: {}
    }
    this.onDomainTextChange = this.onDomainTextChange.bind(this)
    this.saveDomain = this.saveDomain.bind(this)
    this.removeDomain = this.removeDomain.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.handleSaveDomain = this.handleSaveDomain.bind(this)
    this.handleFetch = this.handleFetch.bind(this)
    this.handleDeleteDomain = this.handleDeleteDomain.bind(this)
  }

  handleFetch (resp) {
    if (resp.status === 'success') {
      this.setState({domains: resp.payload})
    }
  }
  handleDeleteDomain (resp) {
    if (resp.status === 'success') {
      this.setState({domains: resp.payload})
      this.msg.success('Domain deleted successfully')
    }
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

  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.props.fetchWhiteListedDomains(this.props.pages[0].pageId, this.handleFetch)
      this.setState({
        selectPage: this.props.pages[0]
      })
    } else {
      this.setState({
        selectPage: {}
      })
    }
  }
  onPageChange (event) {
    if (event.target.value !== -1) {
      let page
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === event.target.value) {
          page = this.props.pages[i]
          break
        }
      }
      if (page) {
        this.setState({
          selectPage: page,
          domainText: ''
        })
      }
      this.props.fetchWhiteListedDomains(page.pageId, this.handleFetch)
    } else {
      this.setState({
        selectPage: {},
        domainText: '',
        domains: []
      })
    }
  }
  componentDidMount () {
    this.selectPage()
    document.title = 'KiboPush | Whitelist Domains'
  }
  onDomainTextChange (e) {
    this.setState({
      domainText: e.target.value
    })
  }
  removeDomain (value) {
    var payload = {page_id: this.state.selectPage.pageId, whitelistDomain: value}
    this.props.deleteDomain(payload, this.msg, this.handleDeleteDomain)
  }
  saveDomain () {
    let domains = this.state.domains
    console.log('entered domain', URL.parse(this.state.domainText))
    for (var i = 0; i < domains.length; i++) {
      console.log('domains', URL.parse(domains[i]))
       if (URL.parse(domains[i]).href === URL.parse(this.state.domainText).href) {
         this.msg.error('Domain is already whitelisted')
         return
       }

    }
    if (isWebURL(this.state.domainText)) {
      if (!isWebViewUrl(this.state.domainText)) {
        return this.msg.error('Webview must include a protocol identifier e.g.(https://)')
      }
      var payload = {page_id: this.state.selectPage.pageId, whitelistDomains: [this.state.domainText]}
      this.props.saveWhiteListDomains(payload, this.msg, this.handleSaveDomain)
    } else {
      this.msg.error('Please enter a valid URL, including the protocol identifier (e.g. "https://"")')
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Whitelist Domains
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='tab-pane active' id='m_user_profile_tab_1'>
              <div className='m-portlet__body'>
                <div className='m-form '>
                  <div className='form-group m-form__group row'>
                    <label className='col-3 col-form-label' style={{textAlign: 'left'}}>Select Page</label>
                    <div className='col-8 input-group'>
                      <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.onPageChange}>
                        {
                          this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                            <option key={page.pageId} value={page.pageId} selected={page.pageId === this.state.selectPage.pageId}>{page.pageName}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                  <p>Third-party domains that are accessible in the Messenger webview.</p>
                  {this.state.domains && this.state.domains.length > 0 &&
                    <div className='row' style={{minWidth: '150px', padding: '10px'}}>
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
                  <div className='form-group m-form__group m--margin-top-10'>
                    <input className='form-control m-input m-input--air' placeholder='Enter valid domain' value={this.state.domainText} onChange={this.onDomainTextChange} />
                  </div>
                  <div className='input-group pull-right'>
                    <button className='btn btn-primary pull-right' disabled={this.state.domainText === ''} onClick={this.saveDomain}>Save</button>
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
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchWhiteListedDomains: fetchWhiteListedDomains,
    saveWhiteListDomains: saveWhiteListDomains,
    deleteDomain: deleteDomain
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WhiteListDomains)
