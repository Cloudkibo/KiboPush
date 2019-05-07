import React from 'react'
import { Link } from 'react-router'
import { isWebURL } from '../../utility/utils'

class AddAction extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      actionDisabled: !(props.webviewurl || props.elementUrl),
      openPopover: props.webviewurl || props.elementUrl,
      openWebView: !!props.webviewurl,
      openWebsite: !!props.elementUrl,
      webviewsize: props.webviewsize ? props.webviewsize : 'FULL',
      webviewurl: props.webviewurl ? props.webviewurl : '',
      elementUrl: props.elementUrl ? props.elementUrl : '',
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
    if (isWebURL(this.state.elementUrl)) {
      this.setState({actionDisabled: false})
      this.props.updateActionStatus({actionDisabled: false})
    } else {
      this.setState({actionDisabled: true})
      this.props.updateActionStatus({actionDisabled: true})
    }
    this.setState({elementUrl: event.target.value, webviewurl: '', webviewsize: 'FULL'})
    this.props.updateActionStatus({elementUrl: event.target.value, webviewurl: '', webviewsize: 'FULL'})
  }

  changeWebviewUrl (e) {
    if (isWebURL(this.state.webviewurl)) {
      this.setState({actionDisabled: false})
      this.props.updateActionStatus({actionDisabled: false})
    } else {
      this.setState({actionDisabled: true})
      this.props.updateActionStatus({actionDisabled: true})
    }
    this.setState({webviewurl: e.target.value, elementUrl: ''})
    this.props.updateActionStatus({webviewurl: e.target.value, elementUrl: ''})
  }

  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      this.setState({webviewsize: event.target.value})
      this.props.updateActionStatus({webviewsize: event.target.value})
    }
  }

  closeWebview () {
    this.setState({openWebView: false, webviewurl: '', webviewsize: 'FULL', actionDisabled: true})
    this.props.updateActionStatus({webviewurl: '', webviewsize: 'FULL', actionDisabled: true})
  }

  closeWebsite () {
    this.setState({openWebsite: false, elementUrl: '', actionDisabled: true})
    this.props.updateActionStatus({elementUrl: '', actionDisabled: true})
  }

  showWebView () {
    this.setState({openWebView: true})
  }

  showWebsite () {
    this.setState({openWebsite: true})
  }

  handleClose () {
    this.setState({openPopover: false, elementUrl: '', webviewurl: '', webviewsize: 'FULL', openWebsite: false, openWebView: false})
    this.props.updateActionStatus({elementUrl: '', webviewurl: '', webviewsize: 'FULL', actionDisabled: false})
  }

  render () {
    return (
      <div>
        <h4 style={{marginBottom: '20px'}}>Action (Optional):</h4>
        {
          this.state.openPopover &&
          <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '200px', marginBottom: '30px', padding: '20px'}} >
            <div onClick={this.handleClose} style={{marginLeft: '100%', marginTop: '-10px', marginBottom: '15px', cursor: 'pointer'}}>❌</div>
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
          <div className='ui-block hoverborder' style={{minHeight: '30px', width: '100%', marginLeft: '0px', marginBottom: '30px'}} onClick={this.handleClick}>
            <div ref={(b) => { this.target = b }} style={{paddingTop: '5px'}} className='align-center'>
              <h6> + Add Action </h6>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default AddAction
