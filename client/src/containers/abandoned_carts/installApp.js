/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { installShopifyApp } from '../../redux/actions/abandonedCarts.actions'

class InstallApp extends React.Component {
  constructor () {
    super()
    this.state = {
      pageUrl: '',
      selectedPage: ''
    }
  }

  componenWillReceiveProps (nextProps) {
    if (nextProps.pages && this.state.selectedPage === '' && nextProps.pages.length > 0) {
      this.setState({selectedPage: nextProps.pages[0].pageId})
    }
  }

  componentDidMount () {
    if (this.props.pages && this.state.selectedPage === '' && this.props.pages.length > 0) {
      this.setState({selectedPage: this.props.pages[0].pageId})
    }
  }

  install (event) {

  }

  selectPage (event) {
    this.setState({selectedPage: event.target.value})
  }

  render () {
    console.log('Selected Page', this.state.selectedPage)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>

          <div className='row'>
            <div className='col-xl-12'>
              <div style={{margin: 150 + 'px', textAlign: 'center'}}>
                <h1> KiboPush </h1>
                <h1> Install Shopify App </h1>
                <br />
                <input autoFocus className='form-control m-input' type='text' placeholder='Shop Url e.g. mystore.myshopify.com' ref='domain' required
                  style={{ WebkitBoxShadow: 'none', boxShadow: 'none', height: '45px' }}
                  value={this.state.pageUrl} onChange={(event) => { this.setState({pageUrl: event.target.value}) }} />
                <br />
                <select style={{height: '45px', width: 80 + '%'}} onChange={this.selectPage.bind(this)}>
                  { (this.props.pages)
                    ? this.props.pages.map((page) => {
                      return <option value={page.pageId} key={page._id}> {page.pageName} </option>
                    }) : <option>No Pages Found</option>
                  }
                </select>
                <br />
                <br />
                <button type='button' className='btn  btn-success btn-lg' style={{marginTop: 25 + 'px'}} onClick={this.install.bind(this)}>Install</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state', state)
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    bots: (state.botsInfo.bots),
    count: (state.botsInfo.count),
    analytics: (state.botsInfo.analytics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadMyPagesList: loadMyPagesList,
      installShopifyApp: installShopifyApp
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InstallApp)
