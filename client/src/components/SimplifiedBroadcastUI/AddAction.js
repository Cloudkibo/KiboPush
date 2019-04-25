import React from 'react'
import { Link } from 'react-router'
import { isWebURL } from '../../utility/utils'

class AddAction extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openPopover: false,
      openWebView: false,
      openWebsite: false,
      webviewsize: 'FULL',
      webviewurl: '',
      elementUrl: '',
      webviewsizes: ['COMPACT', 'TALL', 'FULL'],
      defaultAction: '',
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview']
    }
  }

  handleClick (e) {
    if (this.state.elementUrl !== '' && isWebURL(this.state.elementUrl)) {
      this.setState({disabled: false, openWebsite: true})
    }
    if (this.state.webviewurl !== '' && isWebURL(this.state.webviewurl)) {
      this.setState({disabled: false, openWebView: true})
    }
    this.setState({openPopover: true})
  }

  changeUrl (event) {
    console.log('event', event.target.value)
    if (isWebURL(this.state.elementUrl)) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({elementUrl: event.target.value, webviewurl: '', webviewsize: 'FULL'})
  }

  changeWebviewUrl (e) {
    if (isWebURL(this.state.webviewurl)) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
    this.setState({webviewurl: e.target.value, elementUrl: ''})
  }

  onChangeWebviewSize (event) {
    if (event.target.value !== -1) {
      this.setState({webviewsize: event.target.value})
    }
  }

  closeWebview () {
    this.setState({openWebView: false, webviewurl: '', webviewsize: 'FULL', disabled: true})
  }

  closeWebsite () {
    this.setState({openWebsite: false, elementUrl: '', disabled: true})
  }

//   handleDone () {
//     if (this.state.webviewurl !== '') {
//       this.props.checkWhitelistedDomains({pageId: this.props.pageId, domain: this.state.webviewurl}, this.handleWebView)
//     } else if (this.state.elementUrl !== '') {
//       let defaultAction
//       defaultAction = {
//         type: 'web_url', url: this.state.elementUrl
//       }
//       this.setState({
//         defaultAction: defaultAction
//       })
//       this.props.handleCard({id: this.props.id,
//         componentType: 'card',
//         fileurl: this.state.fileurl,
//         image_url: this.state.image_url,
//         fileName: this.state.fileName,
//         type: this.state.type,
//         size: this.state.size,
//         title: this.state.title,
//         description: this.state.subtitle,
//         buttons: this.state.buttons,
//         default_action: defaultAction
//       })
//       this.setState({
//         openPopover: false
//       })
//     }
//   }

  render () {
    return (
      <div>
        <h4 style={{marginBottom: '20px'}}>Buttons (Optional):</h4>
        {
          this.state.openPopover && <div>
            This can be used to open a web page on the card click
            {
                !this.state.openWebsite && !this.state.openWebView &&
                <div>
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebsite}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a website</h7>
                  </div>
                  { (this.state.buttonActions.indexOf('open webview') > -1) &&
                  <div style={{border: '1px dashed #ccc', padding: '10px', cursor: 'pointer'}} onClick={this.showWebView}>
                    <h7 style={{verticalAlign: 'middle', fontWeight: 'bold'}}><i className='fa fa-external-link' /> Open a webview</h7>
                  </div>
                }
                </div>
            }
            {
                this.state.openWebsite &&
                <div className='card'>
                  <h7 className='card-header'>Open Website <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebsite} /></h7>
                  <div style={{padding: '10px'}} className='card-block'>
                    <input type='text' value={this.state.elementUrl} className='form-control' onChange={this.changeUrl} placeholder='Enter link...' />
                  </div>
                </div>
            }
            {
                this.state.openWebView &&
                <div className='card'>
                  <h7 className='card-header'>Open WebView <i style={{float: 'right', cursor: 'pointer'}} className='la la-close' onClick={this.closeWebview} /></h7>
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
            <br />
            <br />
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
