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
  addPages,
  enablePage,
  removePage
} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'

class AddPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {counter: 0}
  }

  componentWillMount () {
    this.props.addPages()
  }

  gotoView () {
    this.props.history.push({
      pathname: `/pages`

    })
    // browserHistory.push(`/pollResult/${poll._id}`)
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

  componentWillReceiveProps (nextprops) {
    if (nextprops.otherPages && nextprops.otherPages.length <= 0 &&
      this.state.counter < 2) {
      console.log('calling addPages')
      this.props.addPages()
      this.setState({counter: this.state.counter + 1})
    }
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-6 push-xl-3 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12'>
              <h3>Add Pages</h3>
              {
                (this.props.otherPages) &&
                this.props.otherPages.map((page, i) => (
                  <div className='ui-block'>
                    <div className='birthday-item inline-items'>

                      <div className='birthday-author-name'>
                        <a href='#'
                          className='h6 author-name'>{page.pageName} </a>

                      </div>
                      {(page.connected) &&
                      <button onClick={() => this.props.removePage(page)}
                        className='btn btn-sm bg-blue'>Disconnect
                      </button>
                      }
                      {(!page.connected) &&
                      <button onClick={() => this.props.enablePage(page)}
                        className='btn btn-sm bg-blue'>Connect
                      </button>
                      }
                    </div>
                  </div>
                ))
              }
              <button onClick={() => this.gotoView()}
                className='btn btn-sm bg-blue'>Done
              </button>
            </main>

          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    otherPages: (state.pagesInfo.otherPages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    enablePage: enablePage,
    removePage: removePage,
    addPages: addPages
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPage)
