/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'

class MessageUs extends React.Component {
  constructor (props, context) {
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
      'copied': false
    }
  }

  componentWillReceiveProps (nextprops) {
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

  onChangeValue (event) {
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

  onChange (event) {
    this.setState({
      'buttonText': event.target.value
    })
  }

  handleChange (e) {
    this.setState({
      'buttonColor': e.target.value,
      'fontColor': e.target.value === 'blue' ? 'white' : 'black'
    })
  }

  componentDidMount () {
    document.title = 'KiboPush | Message Us'
  }
  render () {
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Message Us Widget
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='tab-pane active' id='m_user_profile_tab_1'>
              <form className='m-form m-form--fit m-form--label-align-right'>
                <div className='m-portlet__body'>
                  {this.state.showbutton !== true &&
                    <div className='form-group m-form__group row'>
                      <div className='input-group'>
                        <div className='alert alert-success'>
                        You don't have any connected pages. Please click
                        <Link to='/addpages' style={{color: 'blue', cursor: 'pointer'}}> here </Link> to connect facebook pages to get the HTML code.
                        </div>
                      </div>
                    </div>
                }
                  <div className='form-group m-form__group row'>
                    {
                      this.state.showbutton === true &&
                        <div>
                          <div className='input-group'>
                            <label>Add the Message Us Widget to your website by copying the code below in your website's HTML. This widget will help you
                             start a conversation and send the person to Messenger.</label>
                            <br />
                            <br />
                            <h5 className='m-portlet__head-text'>
                              Get Widget code
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
                                onChange={this.onChangeValue}>
                                { this.props.pages.map((page, i) => (
                                (
                                  page.connected &&
                                  <option
                                    value={page.pageId} key={page.pageId}>{page.pageName}</option>
                                )
                              ))
                              }
                              </select>
                            </div>
                          </div>
                        }
                          <br />
                          <br />
                          <div className='alert alert-success'>
                            <h4 className='block'>Code for Message Us
                            Widget</h4>
                          To embed the Message Us widget on your
                          website, you
                          need to put this line inside &lt;body&gt; tag of HTML
                          of your
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

                          {/* Below one is working, but it isn't from new template */}
                          <div className='tab-content'>
                            <div className='tab-pane active' id='home-1'
                              role='tabpanel'
                              aria-expanded='true'
                              style={{display: 'flex', flexDirection: 'row'}}>
                              <br />
                              <div className='col-xl-6'>
                                <div className='form-group'>
                                  <label htmlFor='colorbtn'> Choose Color</label>
                                  <select className='form-control' id='colorbtn'
                                    ref='colorbtn'
                                    onChange={this.handleChange.bind(this)}>
                                    <option value='blue'>Blue</option>
                                    <option value='white'>White</option>
                                  </select>
                                </div>
                                <div className='form-group'>
                                  <label htmlFor='textbtn'> Button Text</label>
                                  <input type='text' className='form-control'
                                    ref='textbtn'
                                    placeholder='Send on Messenger'
                                    id='textbtn' onChange={this.onChange} />
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
                                    <i
                                      className='fa fa-facebook fa-lg' /> {this.state.buttonText}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    }
                  </div>
                </div>
              </form>
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
  return bindActionCreators({loadMyPagesList: loadMyPagesList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageUs)
