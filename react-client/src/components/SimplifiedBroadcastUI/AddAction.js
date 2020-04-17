import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isWebURL } from '../../utility/utils'
import { fetchWhiteListedDomains } from '../../redux/actions/settings.actions'
import URL from 'url'

class AddAction extends React.Component {
  constructor (props) {
    super(props)
    let openWebView = !!props.webviewurl || (props.default_action && props.default_action.messenger_extensions)
    let openWebsite = !!props.elementUrl || (props.default_action && !props.default_action.messenger_extensions)
    let webviewurl = props.webviewurl ? props.webviewurl : null
    let elementUrl = props.elementUrl ? props.elementUrl : null
    let webviewsize = props.webviewsize ? props.webviewsize : 'FULL'
    if (props.default_action) {
      if (openWebView) {
        webviewurl = props.default_action.url
        webviewsize = props.default_action.webview_height_ratio
      }
      if (openWebsite) {
        elementUrl = props.default_action.url
      }
    }
    this.state = {
      whitelistedDomains: [],
      errorMsg: '',
      default_action: props.default_action ? props.default_action : null,
      actionDisabled: !(webviewurl || elementUrl),
      openPopover: webviewurl || elementUrl,
      openWebView,
      openWebsite,
      webviewsize,
      webviewurl,
      elementUrl,
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      buttonActions: props.buttonActions ? props.buttonActions : ['open website', 'open webview']
    }
    this.handleClick = this.handleClick.bind(this)
    this.showWebView = this.showWebView.bind(this)
    this.showWebsite = this.showWebsite.bind(this)
    this.changeWebviewUrl = this.changeWebviewUrl.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
    this.onChangeWebviewSize = this.onChangeWebviewSize.bind(this)
    this.closeWebsite = this.closeWebsite.bind(this)
    this.closeWebview = this.closeWebview.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.getDefaultAction = this.getDefaultAction.bind(this)
    this.handleFetch = this.handleFetch.bind(this)
    props.fetchWhiteListedDomains(props.pageId, this.handleFetch)
  }

  handleFetch(resp) {
    console.log('done fetching whitelisted domains', resp)
    if (resp.status === 'success') {
      console.log('fetched whitelisted domains', resp.payload)
      this.setState({ whitelistedDomains: resp.payload })
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps AddAction', nextProps)
    let openWebView = nextProps.webviewurl === '' || !!nextProps.webviewurl || (nextProps.default_action && nextProps.default_action.messenger_extensions)
    let openWebsite = nextProps.elementUrl === '' || !!nextProps.elementUrl || (nextProps.default_action && !nextProps.default_action.messenger_extensions)
    let webviewurl = nextProps.webviewurl ? nextProps.webviewurl : null
    let elementUrl = nextProps.elementUrl ? nextProps.elementUrl : null
    let webviewsize = nextProps.webviewsize ? nextProps.webviewsize : 'FULL'
    let newState = {
      default_action: nextProps.default_action ? nextProps.default_action : null,
      actionDisabled: !(webviewurl || elementUrl),
      openPopover: openWebView || openWebsite,
      openWebView,
      openWebsite,
      webviewsize,
      webviewurl,
      elementUrl,
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      buttonActions: nextProps.buttonActions ? nextProps.buttonActions : ['open website', 'open webview']
    }
    console.log('AddAction newState', newState)
    this.setState(newState)
  }


  getDefaultAction (url, webviewsize) {
    let default_action = this.state.default_action
    if (this.state.openWebView) {
      default_action = {
        type: 'web_url',
        url,
        messenger_extensions: true,
        webview_height_ratio: webviewsize ? webviewsize : this.state.webviewsize
      }
    } else if (this.state.openWebsite) {
      default_action = {
        type: 'web_url',
        url
      }
    }
    return default_action
  }

  handleClick (e) {
    if (this.state.elementUrl !== '' && isWebURL(this.state.elementUrl)) {
      this.setState({actionDisabled: false, openWebsite: true})
      this.props.updateActionStatus({actionDisabled: false})
    }
    if (this.state.webviewurl !== '' && isWebURL(this.state.webviewurl)) {
      this.setState({actionDisabled: false, openWebView: true})
      this.props.updateActionStatus({actionDisabled: false})
    }
    this.setState({openPopover: true})
  }

  changeUrl (event) {
    console.log('event', event.target.value)
    if (isWebURL(event.target.value)) {
      this.setState({actionDisabled: false})
      this.props.updateActionStatus({actionDisabled: false})
    } else {
      this.setState({actionDisabled: true})
      this.props.updateActionStatus({actionDisabled: true})
    }
    let default_action = this.getDefaultAction(event.target.value)
    console.log('changing url', event.target.value)
    this.setState({elementUrl: event.target.value, webviewurl: null, webviewsize: 'FULL', default_action}, () => {
      console.log('AddAction state after changing url', this.state)
    })
    this.props.updateActionStatus({elementUrl: event.target.value, webviewurl: null, webviewsize: 'FULL', default_action})
  }

  changeWebviewUrl (e) {
    let validDomain = false
    for (let i = 0; i < this.state.whitelistedDomains.length; i++) {
      let domain = this.state.whitelistedDomains[i]
      if (URL.parse(e.target.value).href === URL.parse(domain).href) {
        validDomain = true
        break
      }
    }
    if (validDomain) {
      this.setState({actionDisabled: false, errorMsg: ''})
      this.props.updateActionStatus({actionDisabled: false})
    } else {
      this.setState({actionDisabled: true, errorMsg: 'The given domain is not whitelisted. Please add it to whitelisted domains.' })
      this.props.updateActionStatus({actionDisabled: true})
    }
    let default_action = this.getDefaultAction(e.target.value)
    this.setState({webviewurl: e.target.value, elementUrl: null, default_action})
    this.props.updateActionStatus({webviewurl: e.target.value, elementUrl: null, default_action})
  }

  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      let default_action = this.getDefaultAction(null, event.target.value)
      this.setState({webviewsize: event.target.value, default_action})
      this.props.updateActionStatus({webviewsize: event.target.value, default_action})
    }
  }

  closeWebview () {
    this.setState({openWebView: false, webviewurl: null, webviewsize: 'FULL', actionDisabled: true})
    this.props.updateActionStatus({webviewurl: null, webviewsize: 'FULL', actionDisabled: true, default_action: null})
  }

  closeWebsite () {
    this.setState({openWebsite: false, elementUrl: null, actionDisabled: true})
    this.props.updateActionStatus({elementUrl: null, actionDisabled: true, default_action: null})
  }

  showWebView () {
    this.setState({openWebView: true})
  }

  showWebsite () {
    this.setState({openWebsite: true})
  }

  handleClose () {
    this.setState({openPopover: false, elementUrl: null, webviewurl: null, webviewsize: 'FULL', openWebsite: false, openWebView: false})
    this.props.updateActionStatus({default_action: null, elementUrl: null, webviewurl: null, webviewsize: 'FULL', actionDisabled: false})
  }

  render () {
    return (
      <div>
        {
          !this.props.noHeader && <h5 style={{marginBottom: '10px', textAlign: 'left'}}>Action (Optional):</h5>
        }
        {
          this.state.openPopover &&
          <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '200px', marginBottom: '30px', padding: '20px'}} >
            <div onClick={this.handleClose} style={{marginLeft: '100%', marginTop: '-10px', marginBottom: '15px', cursor: 'pointer'}}><span role='img' aria-label='times'>❌</span></div>
            <div>
            This can be used to open a web page on the card click
            {
                !this.state.openWebsite && !this.state.openWebView &&
                <div>
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginTop: '10px'}} onClick={this.showWebsite}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                  </div>
                  { (this.state.buttonActions.indexOf('open webview') > -1) &&
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer', marginTop: '10px'}} onClick={this.showWebView}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a webview</h7>
                  </div>
                }
                </div>
            }
              {
                this.state.openWebsite &&
                <div className='card'>
                  <h7 className='card-header'>Open Website <i style={{float: 'right', cursor: 'pointer', marginTop: '10px'}} className='la la-close' onClick={this.closeWebsite} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <input type='text' value={this.state.elementUrl} className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
                  </div>
                </div>
            }
              {
                this.state.openWebView &&
                <div className='card'>
                  <h7 className='card-header'>Open WebView <i style={{float: 'right', cursor: 'pointer', marginTop: '10px'}} className='la la-close' onClick={this.closeWebview} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <div>
                      <Link to='/settings' state={{tab: 'whitelistDomains'}} style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}>Whitelist url domains to open in-app browser</Link>
                    </div>
                    <label className='form-label col-form-label' style={{textAlign: 'left'}}>Url</label>
                    <input type='text' value={this.state.webviewurl} className='form-control' onChange={this.changeWebviewUrl} placeholder='Enter link...' />
                    <div style={{ marginBottom: '30px', color: 'red' }}>{this.state.errorMsg}</div>
                    <label className='form-label col-form-label' style={{textAlign: 'left'}}>WebView Size</label>
                    <select className='form-control m-input' value={this.state.webviewsize} onChange={this.onChangeWebviewSize}>
                      {
                        this.state.webviewsizes && this.state.webviewsizes.length > 0 && this.state.webviewsizes.map((size, i) => (
                          <option key={i} value={size} selected={size === this.state.webviewsize}>{size}</option>
                        ))
                    }
                    </select>
                  </div>
                </div>
            }
            </div>
          </div>
        }
        {
          !this.state.openPopover && <div className='ui-block hoverborder' style={{minHeight: '30px', width: '100%', marginLeft: '0px', marginBottom: '20px'}} onClick={this.handleClick}>
            <div ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
              <h6> + Add Action </h6>
            </div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchWhiteListedDomains,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAction)
