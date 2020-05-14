import React from 'react'
import PropTypes from 'prop-types'
import { isWebURL, isWebViewUrl, getHostName } from '../../utility/utils'

class WhiteListDomains extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      domainText: '',
      domains: []
    }
    this.onDomainTextChange = this.onDomainTextChange.bind(this)
    this.saveDomain = this.saveDomain.bind(this)
    this.removeDomain = this.removeDomain.bind(this)
    this.handleSaveDomain = this.handleSaveDomain.bind(this)
    this.handleFetch = this.handleFetch.bind(this)
    this.handleDeleteDomain = this.handleDeleteDomain.bind(this)
  }

  componentDidMount () {
    this.props.fetchWhiteListedDomains(this.props.pages[0].pageId, this.handleFetch)
  }

  handleFetch (resp) {
    if (resp.status === 'success') {
      this.setState({domains: resp.payload})
    }
  }

  handleDeleteDomain (resp) {
    if (resp.status === 'success') {
      this.setState({domains: resp.payload})
      this.props.alertMsg.success('Domain deleted successfully')
    }
  }

  handleSaveDomain (resp) {
    if (resp.status === 'success') {
      var domains = resp.payload
      this.setState({
        domains: domains,
        domainText: ''
      })
      this.props.alertMsg.success('Domain saved successfully')
    }
  }

  onDomainTextChange (e) {
    this.setState({
      domainText: e.target.value
    })
  }

  removeDomain (value) {
    const payload = {page_id: this.props.pages[0].pageId, whitelistDomain: value}
    this.props.deleteDomain(payload, this.props.alertMsg, this.handleDeleteDomain)
  }

  saveDomain () {
    let domains = this.state.domains
    for (let i = 0; i < domains.length; i++) {
       if (getHostName(domains[i]) === getHostName(this.state.domainText)) {
         this.props.alertMsg.error('Domain is already whitelisted')
         return
       }
    }
    if (isWebURL(this.state.domainText)) {
      if (!isWebViewUrl(this.state.domainText)) {
        return this.props.alertMsg.error('Webview must include a protocol identifier e.g.(https://)')
      }
      const payload = {page_id: this.props.pages[0].pageId, whitelistDomains: [this.state.domainText]}
      this.props.saveWhiteListDomains(payload, this.props.alertMsg, this.handleSaveDomain)
    } else {
      this.props.alertMsg.error('Please enter a valid URL, including the protocol identifier (e.g. "https://"")')
    }
  }

  render () {
    return (
      <div className='m-portlet__body'>
        <div className='m-form '>
          <div className='form-group m-form__group row'>
            <label className='col-3 col-form-label' style={{textAlign: 'left'}}>Page</label>
            <div className='col-8 input-group'>
              <select className='form-control m-input' disabled>
                {
                  this.props.pages.map((page, i) => (
                    <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <p>Third-party domains that are accessible in the Messenger webview.</p>
          {
            this.state.domains && this.state.domains.length > 0 &&
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
    )
  }
}

WhiteListDomains.propTypes = {
  'pages': PropTypes.array.isRequired,
  'alertMsg': PropTypes.element.isRequired,
  'deleteDomain': PropTypes.func.isRequired,
  'saveWhiteListDomains': PropTypes.func.isRequired,
  'fetchWhiteListedDomains': PropTypes.func.isRequired
}

export default WhiteListDomains
