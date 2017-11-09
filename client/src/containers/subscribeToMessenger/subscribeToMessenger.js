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
class SubscribeToMessenger extends React.Component {
  constructor (props, context) {
    super(props, context)
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
    document.title = 'KiboPush | Subscribe to Messenger'
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          {this.state.showbutton === true
            ? <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12' style={{top: '100px'}}>
              <h2 className='presentation-margin'>Subscribe to Messenger</h2>
              <div className='ui-block'>
                <div className='news-feed-form' style={{padding: '20px'}}>
                  { this.props.pages &&
                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6'>
                      <label>Choose Page</label>
                      <div className='form-group form-inline'>
                        <select className='input-sm' onChange={this.onChangeValue}>
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
                  <div className='alert alert-success'>
                    <h4 className='block'>Code for Send To Messenger Button</h4>
                    To embed the facebook messenger button on your website, you
                    need to put this line inside &lt;body&gt; tag of HTML of your
                    website&#39;s each page.
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
                    is defined in Bootrap css file.
                    <br />
                  </div>

                  <div className='tab-content'>
                    <div className='tab-pane active' id='home-1' role='tabpanel'
                      aria-expanded='true' style={{display: 'flex', flexDirection: 'row'}}>
                      <br />
                      <div className='col-xl-6'>
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
                      </div>
                      <div className='col-xl-6'>
                        <div className='form-group' style={{textAlign: 'center', border: 'dashed', height: '135px', padding: '20px', color: '#3c763d'}}>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          : <div className='alert alert-success' style={{marginTop: '150px'}}>
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
