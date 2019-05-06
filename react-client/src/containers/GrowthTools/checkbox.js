/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import YouTube from 'react-youtube'
import { fetchWhiteListedDomains } from '../../redux/actions/settings.actions'
import { browserHistory } from 'react-router'

class CheckBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pageid: '',
      showVideo: false,
      domains: [],
      selectedDomain: ''
    }
    this.onChangeValue = this.onChangeValue.bind(this)
    this.changeDomain = this.changeDomain.bind(this)
    this.selectPage = this.selectPage.bind(this)
    this.handleFetch = this.handleFetch.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
  }

  goToSettings () {
    browserHistory.push({
      pathname: '/settings',
      state: {module: 'whitelistDomains'}
    })
  }

  componentWillReceiveProps (nextprops) {
    // if (nextprops.pages && nextprops.pages.length > 0) {
    //   if (nextprops.pages[0].pageUserName) {
    //     this.setState({
    //       'pageid': nextprops.pages[0].pageId,
    //       'fblink': 'https://m.me/' + nextprops.pages[0].pageUserName
    //     })
    //   } else {
    //     this.setState({
    //       'pageid': nextprops.pages[0].pageId,
    //       'fblink': 'https://m.me/' + nextprops.pages[0].pageId
    //     })
    //   }
    // } else if (nextprops.pages && nextprops.pages.length === 0) {
    //   // user has no connected pages
    //   this.setState({
    //     'showbutton': false
    //   })
    // }
  }

  changeDomain (event) {
    this.setState({selectedDomain: event.target.value})
  }

  onChangeValue (event) {
    let page
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageId === event.target.value) {
        page = this.props.pages[i]
        break
      }
    }
    if (page) {
      this.setState({
        pageid: page.pageId,
      })
      this.props.fetchWhiteListedDomains(page.pageId, this.handleFetch)
    }
  }

  handleFetch (resp) {
    if (resp.status === 'success') {
      this.setState({domains: resp.payload, selectedDomain: resp.payload[0]})
    }
  }

  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.props.fetchWhiteListedDomains(this.props.pages[0].pageId, this.handleFetch)
      this.setState({
        pageId: this.props.pages[0].pageId
      })
    }
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Checkbox Plugin`;
    this.selectPage()
  }
  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px',  top: 100}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px',  top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='_E6gGHBEaEU'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                  />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-content'>
          {this.state.showbutton !== true &&
            <div
              className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
              role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation m--font-danger' />
              </div>
              <div className='m-alert__text'>
                You do not have any connected pages. Please click
                <Link to='/addpages' style={{color: 'blue', cursor: 'pointer'}}> here </Link> to connect your facebook page.
              </div>
            </div>
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Checkbox? Here is the <a href='http://kibopush.com/messageus/' target='_blank'>documentation</a>.
              Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
            </div>
          </div>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Checkbox
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='form-group m-form__group row'>
                <div className='input-group'>
                  <span>This checkbox plugin allows you to display a checkbox in forms on your website that allows users to opt-in to receive messages. Plase copy the code below in your website form to add the checkbox. You might need to make some modifications in the code.</span>
                  <br />
                  <br />
                  <h5 className='m-portlet__head-text'>
                    Get Checkbox code
                  </h5>
                  <br />
                </div>
                { this.props.pages &&
                  <div>
                    <label>
                      Choose Page
                    </label>
                    <div>
                      <select
                        className='form-control'
                        onChange={this.onChangeValue}
                      >
                        { this.props.pages.map((page, i) => (
                          (
                            page.connected &&
                            <option value={page.pageId} key={page.pageId}>{page.pageName}</option>
                          )
                        ))}
                      </select>
                    </div>
                  </div>
                }
                <br />
                  { this.state.domains.length > 0
                    ? <div>
                      <label>
                        Choose WhiteListed Domain
                      </label>
                      <div>
                        <select
                          className='form-control'
                          onChange={this.changeDomain}
                        >
                          { this.state.domains.map((domain, i) => (
                            (
                              <option value={domain} key={i}>{domain}</option>
                            )
                          ))}
                        </select>
                      </div>
                    </div>
                    : <span>You do not have any whitelisted domains for the selected page. Please click
                  <Link onClick={this.goToSettings} style={{color: 'blue', cursor: 'pointer'}}> here </Link> to add whitelist domains.</span>
                  }
                <br />
                <div className='alert alert-success'>
                  <h4 className='block'>Code for Checkbox Plugin</h4>
                  <br /><br />
                  <center>
                    <code className='codeBox'>
                      &lt;a class='btn'
                      href="https://m.me/{this.state.pageid}"
                      style='{'background:' + this.state.buttonColor +
                      ';color: ' + this.state.fontColor +
                      '; border-color: white;'}' &gt;&lt;i class="fa
                      fa-facebook
                      fa-lg" &gt; &lt;/i&gt;{this.state.buttonText} &lt;
                      /a&gt;
                    </code>
                  </center>
                  <br />
                </div>
                <div className='tab-content'>
                  <div className='tab-pane active' id='home-1'
                    role='tabpanel'
                    aria-expanded='true'
                    style={{display: 'flex', flexDirection: 'row'}}
                  >
                    <br />
                    <div className='col-xl-6'>
                      <div className='form-group'>
                        <label htmlFor='colorbtn'> Choose Color</label>
                        <select className='form-control' id='colorbtn'
                          ref='colorbtn'
                          onChange={this.handleChange.bind(this)}
                        >
                          <option value='blue'>Blue</option>
                          <option value='white'>White</option>
                        </select>
                      </div>
                      <div className='form-group'>
                        <label htmlFor='textbtn'> Button Text</label>
                        <input type='text' className='form-control'
                          ref='textbtn'
                          placeholder='Send on Messenger'
                          id='textbtn' onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className='col-xl-6'>
                      <div className='form-group' style={{
                        textAlign: 'center',
                        border: 'dashed',
                        height: '135px',
                        padding: '20px',
                        color: '#3c763d'
                      }}>
                        <label htmlFor='textbtn'> Button Preview</label>
                        <br />
                        <a className='btn' href='#' style={{
                          'backgroundColor': this.state.buttonColor,
                          'color': this.state.fontColor,
                          'borderColor': this.state.fontColor
                        }}>
                          <i className='fa fa-facebook fa-lg' /> {this.state.buttonText}
                        </a>
                      </div>
                    </div>
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
    fetchWhiteListedDomains
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckBox)
