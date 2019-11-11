import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Alert } from 'react-bs-notifier'
import { connect } from 'react-redux'
import {
  loadMyPagesList

} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

class CopyLink extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.props.loadMyPagesList()
    this.state = {
      copyPopover: false,
      fblink: 'https://m.me/',
      copied: false,
      pageid: '',
      showCopyLink: true,
      disabled: true
    }
    this.showCopyPopover = this.showCopyPopover.bind(this)
    this.closeCopyPopover = this.closeCopyPopover.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
  }

  showCopyPopover () {
    this.setState({
      copyPopover: true
    })
  }

  closeCopyPopover () {
    this.setState({
      copyPopover: false
    })
  }

  onPageChange (event) {
    let page
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageId === event.target.value) {
        page = this.props.pages[i]
        break
      }
    }
    if (page.pageUserName) {
      this.setState({
        pageid: page.pageId,
        fblink: 'https://m.me/' + page.pageUserName
      })
    } else {
      this.setState({
        pageid: page.pageId,
        fblink: 'https://m.me/' + page.pageId
      })
    }
  }

  UNSAFE_componentWillReceiveProps (nextprops) {
    if (nextprops.pages && nextprops.pages.length > 0) {
      if (nextprops.pages[0].pageUserName) {
        this.setState({
          pageid: nextprops.pages[0].pageId,
          fblink: 'https://m.me/' + nextprops.pages[0].pageUserName,
          disabled: false
        })
      } else {
        this.setState({
          pageid: nextprops.pages[0].pageId,
          fblink: 'https://m.me/' + nextprops.pages[0].pageId,
          disabled: false
        })
      }
    } else if (nextprops.pages && nextprops.pages.length === 0) {
      // user has no connected pages
      this.setState({
        showCopyLink: false
      })
    }
  }

  componentDidMount () {
  }

  render () {
    return (
      <div>
        { this.state.showCopyLink === true
          ? <div>
            { this.props.pages &&
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <label>Choose Page</label>
              <div className='form-group form-inline'>
                <select className='input-sm' onChange={this.onPageChange}>
                  { this.props.pages.map((page, i) => (
                      (
                        page.connected &&
                        <option value={page.pageId}>{page.pageName}</option>
                      )
                    ))
                  }
                </select>
              </div>
            </div>
          }
            <div className='copylink col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <label>Link</label>
              <p>This is the link to your page. Copy this link and share it with your friends to let them become subscriber of your page
              </p>
              <input value={this.state.fblink} />

              <CopyToClipboard text={this.state.fblink}
                onCopy={() => this.setState({copied: true})}>
                { this.state.disabled === true
                ? <button disabled onClick={() => { this.setState({copied: true}) }}
                  className='uk-button uk-button-small uk-button-primary'
                  style={{margin: 5}}>Copy
                  </button>
                : <button onClick={() => { this.setState({copied: true}) }}
                  className='uk-button uk-button-small uk-button-primary'
                  style={{margin: 5}}>Copy
                  </button>
              }
              </CopyToClipboard>
              { this.state.copied &&
              <center>
                <Alert type='success'>
                Copied!
                </Alert>
              </center>
            }
            </div>
          </div>
          : <div className='alert alert-success'>
            You dont have any connected pages. Please connect pages first.
            <br />
            <Link to='/addpages' className='btn btn-sm btn-blue'> Add Pages</Link>
          </div>
      }
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
  return bindActionCreators({ loadMyPagesList: loadMyPagesList }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CopyLink)
