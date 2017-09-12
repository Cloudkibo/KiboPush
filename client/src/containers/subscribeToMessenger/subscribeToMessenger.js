/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import {
  loadMyPagesList

} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Alert } from 'react-bs-notifier'

class SubscribeToMessenger extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.subscribeToMessenger = this.subscribeToMessenger.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.props.loadMyPagesList()
    this.state = {
      'buttonText': 'Send to Messenger',
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
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
  }

  subscribeToMessenger () {
    // this.props.addBroadcast('', {platform: 'Facebook', type: 'message', created_at: '15th Aug 2017', sent: 41});
    // console.log("Broadcast added");
   // alert('poll created')
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container'>
          <br />
          <br />
          <br />
          {this.state.showbutton === true
            ? <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <h2 className='presentation-margin'>Subscribe to Messenger</h2>
              <div className='ui-block'>
                <div className='news-feed-form'>
                  {this.props.pages &&
                  <div>
                    <label>Choose Page</label>

                    <div className='form-group form-inline'>

                      <select className='input-sm' onChange={this.onChangeValue}>

                        {this.props.pages.map((page, i) => (
                          <option value={page.pageId}>{page.pageName}</option>
                      ))
                  }
                      </select>
                    </div>
                    <br />
                  </div>
              }
                  <div className='alert alert-success'>
                    <h4 className='block'>Code for Send To Messenger Button</h4>
                  To embed the facebook messenger button on your website, you
                  need to put this line inside &lt;body&gt; tag of HTML of your
                  website's each page.
                  <br /><br />
                    <center>
                      <code className='codeBox'>

                      &lt;a class='btn' href="https://m.me/{this.state.pageid}"
                      style='{'background:' + this.state.buttonColor +
                    ';color: ' + this.state.fontColor +
                    '; border-color: white;'}' &gt;&lt;i class="fa fa-facebook
                      fa-lg" &gt; &lt;/i&gt;{this.state.buttonText} &lt;/a&gt;
                    </code>
                    </center>
                    <br />
                  Note: For css, we are using Bootstrap library. The class btn
                  is defined in Bootrap css file.<br />

                  </div>

                  <div className='tab-content'>
                    <div className='tab-pane active' id='home-1' role='tabpanel'
                      aria-expanded='true'>

                      <br />

                      <div className='col-xl-12'>
                        <div className='form-group'>
                          <label for='colorbtn'> Choose Color</label>
                          <select className='form-control' id='colorbtn'
                            ref='colorbtn'
                            onChange={this.handleChange.bind(this)}>
                            <option value='blue'>Blue</option>
                            <option value='white'>White</option>

                          </select>
                        </div>
                        <div className='form-group'>
                          <label for='textbtn'> Button Text</label>
                          <input type='text' className='form-control'
                            ref='textbtn' placeholder='Send on Messenger'
                            id='textbtn' onChange={this.onChange} />
                        </div>
                        <br />
                        <br />
                        <div className='form-group'>
                          <label for='textbtn'> Button Preview</label>
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

                         This is a link to your page, you can send it to your friends
                  <br />

                        <input value={this.state.fblink} />

                        <CopyToClipboard text={this.state.fblink}
                          onCopy={() => this.setState({copied: true})}>
                          <button onClick={() => { this.setState({copied: true}) }}
                            className='uk-button uk-button-small uk-button-primary'
                            style={{margin: 5}}>Copy
                    </button>
                        </CopyToClipboard>
                        {this.state.copied &&
                        <center>
                          <Alert type='success'>
                      Copied!
                    </Alert>
                        </center>
                    }
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          : <div className='alert alert-success'>
            <h4 className='block'>Code for Send To Messenger Button</h4>
                  You dont have any connected pages. Please connect pages first.
                  <Link to='/addpages' className='btn btn-sm btn-blue'> Add Pages</Link>
          </div>
        }
        </div>
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages)

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ loadMyPagesList: loadMyPagesList }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(
  SubscribeToMessenger)
