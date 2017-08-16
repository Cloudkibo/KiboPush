/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Dashboard from '../dashboard/dashboard'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { loadMyPagesList, removePage, addPages } from '../../redux/actions/pages.actions'
import {getuserdetails} from '../../redux/actions/basicinfo.actions'
import { bindActionCreators } from 'redux'

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.removePage = this.removePage.bind(this)
  }

  componentWillMount () {
    this.props.getuserdetails()
    this.props.loadMyPagesList()
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

  // addPages(fbId){
  //  this.props.addPages(fbId);
  //  // this.props.history
  // }

  removePage (page) {
    console.log('This is the page', page)
    this.props.removePage(page)
  }
  inviteSubscribers (page) {
    console.log('invite Subscribers')
    this.props.history.push({
      pathname: '/invitesubscribers/',
      state: {pageName: page.pageName, pageId: page.pageId}

    })
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
            <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h3>Pages</h3>
                  <Link to='addPages' className='btn btn-primary btn-sm' style={{float: 'right'}}>Add Pages</Link>

                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Page Pic</th>
                          <th>Page Name</th>
                          <th>Likes</th>
                          <th>Followers</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>

                        { (this.props.pages)
                ? this.props.pages.map((page, i) => (
                  <tr>
                    <td>{page.pagePic}</td>
                    <td>{page.pageName}</td>
                    <td>{page.likes}</td>
                    <td>{page.numberOfFollowers}</td>
                    <td>
                      <button onClick={() => this.removePage(page)} className='btn btn-primary btn-sm' style={{float: 'left'}}>Remove</button>
                      <button onClick={() => this.inviteSubscribers(page)} className='btn btn-primary btn-sm' style={{float: 'left'}}>Invite Subscribers</button>
                    </td>

                  </tr>

                )) : <tr />

              }

                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

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
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadMyPagesList: loadMyPagesList, getuserdetails: getuserdetails, removePage: removePage, addPages: addPages}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Page)
