/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import YouTube from 'react-youtube'

class MessageUs extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.onChange = this.onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.props.loadMyPagesList()
    this.state = {
      'buttonText': 'Message Us',
      'buttonColor': 'blue',
      'fontColor': 'white',
      'pageid': '',
      'showbutton': true,
      'fblink': 'https://m.me/',
      'copied': false,
    }
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.pages && nextprops.pages.length > 0) {
      if (nextprops.pages[0].pageUserName) {
        this.setState({
          'pageid': nextprops.pages[0].pageId,
          'fblink': 'https://m.me/' + nextprops.pages[0].pageUserName
        })
      } else {
        this.setState({
          'pageid': nextprops.pages[0].pageId,
          'fblink': 'https://m.me/' + nextprops.pages[0].pageId
        })
      }
    } else if (nextprops.pages && nextprops.pages.length === 0) {
      // user has no connected pages
      this.setState({
        'showbutton': false
      })
    }
  }

  onChangeValue(event) {
    let page
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageId === event.target.value) {
        page = this.props.pages[i]
        break
      }
    }
    if (page.pageUserName) {
      this.setState({
        'pageid': page.pageId,
        'fblink': 'https://m.me/' + page.pageUserName
      })
    } else {
      this.setState({
        'pageid': page.pageId,
        'fblink': 'https://m.me/' + page.pageId
      })
    }
  }

  onChange(event) {
    this.setState({
      'buttonText': event.target.value
    })
  }

  handleChange(e) {
    this.setState({
      'buttonColor': e.target.value,
      'fontColor': e.target.value === 'blue' ? 'white' : 'black'
    })
  }

  componentDidMount() {
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Message Us`;
  }
  render() {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Message Us Widget Video Tutorial
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <YouTube
                  videoId='_E6gGHBEaEU'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {this.state.showbutton !== true &&
            <div
              className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
              role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation m--font-danger' />
              </div>
              <div className='m-alert__text'>
                You do nott have any connected pages. Please click
                <Link to='/addpages' style={{ color: 'blue', cursor: 'pointer' }}> here </Link> to connect Facebook pages to get the widget code.
              </div>
            </div>
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Message Us Widget? Here is the <a href='http://kibopush.com/messageus/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' data-toggle="modal" data-target="#video">video tutorial</a>
            </div>
          </div>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Message Us Widget
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='form-group m-form__group row'>
                {
                  this.state.showbutton === true &&
                  <div>
                    <div className='input-group'>
                      <span>Add the Message Us Widget to your website by copying the code below in your website HTML. This widget will help you
                      start a conversation and send the person to Messenger.</span>
                      <br />
                      <br />
                      <h5 className='m-portlet__head-text'>
                        Get Widget code
                      </h5>
                      <br />
                    </div>
                    {this.props.pages &&
                      <div>
                        <label>
                          Choose Page
                        </label>
                        <div>
                          <select
                            className='form-control'
                            onChange={this.onChangeValue}
                          >
                            {this.props.pages.map((page, i) => (
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
                    <br />
                    <div className='alert alert-success'>
                      <h4 className='block'>Code for Message Us Widget</h4>
                      To embed the Message Us widget on your website, you
                      need to put this line inside &lt;body&gt; tag of HTML of your
                      website&#39;s each page.
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
                      Note: For css, we are using Bootstrap library. The
                      class btn
                      is defined in Bootrap css file.
                      <br />
                    </div>
                    <div className='tab-content'>
                      <div className='tab-pane active' id='home-1'
                        role='tabpanel'
                        aria-expanded='true'
                        style={{ display: 'flex', flexDirection: 'row' }}
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
                            <a className='btn' href='#/' style={{
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
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadMyPagesList: loadMyPagesList }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageUs)
