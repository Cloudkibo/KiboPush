/* eslint-disable no-undef */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadCompanyInfo } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class CompanyInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      companyInfo: [],
      totalLength: 0,
      pageNumber: 1,
      searchValue: '',
      filter: false,
      filteredData: [],
      pageOwners: [],
      connectedUser: null
    }

    props.loadCompanyInfo({pageNumber: 1})
    this.searchCompanies = this.searchCompanies.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.dataLoaded = false
    this.loadMore = this.loadMore.bind(this)
    this.loadedMore = false
  }

  searchCompanies(event) {
      console.log('searching companies', event.target.value)
      this.setState({searchValue: event.target.value, reachedLimit: false}, () => {
        this.loadedMore = false
        this.props.loadCompanyInfo({pageNumber: 1, companyName: this.state.searchValue})
      })
  }

  loadMore () {
    this.setState({pageNumber: this.state.pageNumber+1}, () => {
        this.loadedMore = true
        this.props.loadCompanyInfo({pageNumber: this.state.pageNumber, companyName: this.state.searchValue})
    })
  }

  handleDate (d) {
    if (d) {
      let c = new Date(d)
      return c.toDateString()
    }
  }

  unique(array, propertyName) {
    return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.companyInfo) {
        if (this.loadedMore && nextProps.companyInfo.length === this.props.companyInfo.length) {
            this.setState({reachedLimit: true})
            this.loadedMore = false
        } 
        console.log('new companyInfo', nextProps.companyInfo)
        this.setState({companyInfo: nextProps.companyInfo})
    }
  }

  render () {
    console.log('companyInfo state', this.state)
    return (
        <div className='col-xl-12'>
            <div className='m-portlet m-portlet--full-height '>
            <div className='m-portlet__head'>
                <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                    <h3 className='m-portlet__head-text'>Companies</h3>
                </div>
                </div>
                <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                    <li className='nav-item m-tabs__item' style={{marginTop: '15px'}}>
                    <div className='m-input-icon m-input-icon--left'>
                        <input name='users_search' id='users_search' type='text' placeholder='Search Companies...' className='form-control m-input m-input--solid' value={this.state.searchValue} onChange={this.searchCompanies} />
                        <span className='m-input-icon__icon m-input-icon__icon--left'>
                        <span><i className='la la-search' /></span>
                        </span>
                    </div>
                    </li>
                </ul>
                </div>
            </div>
            <div className='m-portlet__body'>
                <div className='tab-content'>
                <div className='tab-pane active m-scrollable' role='tabpanel'>
                    <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                    <div style={{height: '393px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                        <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                        <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                            <div className='tab-pane active' id='m_widget5_tab1_content' aria-expanded='true'>
                            {
                                this.state.companyInfo && this.state.companyInfo.length > 0
                                ? <div style={{marginRight: '20px'}} className='m-widget5'>
                                { this.state.companyInfo.map((company, i) => (
                                    <div className='m-widget5__item' key={i} style={{borderBottom: '.07rem dashed #ebedf2'}}>
                                    <div className='m-widget5__pic'>
                                        <img className='m-widget7__img' alt='pic' src={(company.owner.facebookInfo) ? company.owner.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} style={{height: '100px', borderRadius: '50%', width: '7rem'}} />
                                    </div>
                                    <div className='m-widget5__content'>
                                        <h4 className='m-widget5__title'>
                                        {company.companyName}
                                        </h4>
                                        {company.owner.email &&
                                        <span className='m-widget5__desc'>
                                        <b>Email:</b> {company.owner.email}
                                        </span>
                                        }
                                        <br />
                                        <span className='m-widget5__desc'>
                                        <b>Created At:</b> {this.handleDate(company.owner.createdAt)}
                                        </span>
                                    </div>
                                    <div className='m-widget5__stats1'>
                                        <span className='m-widget5__number'>
                                        {company.numOfOwnedPages}
                                        </span>
                                        <br />
                                        <span className='m-widget5__sales'>
                                        Owned Pages
                                        </span>
                                    </div>
                                    <div className='m-widget5__stats1'>
                                        <span className='m-widget5__number'>
                                        {company.numOfConnectedPages}
                                        </span>
                                        <br />
                                        <span className='m-widget5__sales'>
                                        Connected Pages
                                        </span>
                                    </div>
                                    <div className='m-widget5__stats1'>
                                        <span className='m-widget5__number'>
                                        {company.numOfCompanyUsers}
                                        </span>
                                        <br />
                                        <span className='m-widget5__sales'>
                                        Company Users
                                        </span>
                                    </div>
                                    <div className='m-widget5__stats2'>
                                        <span className='m-widget5__number'>
                                        {company.numOfSubscribers}
                                        </span>
                                        <br />
                                        <span className='m-widget5__votes'>
                                        Total Subscribers
                                        </span>
                                    </div>
                                    </div>
                                    ))}
                                </div>
                                : <div>No Data to display</div>
                                }
                            {!this.state.reachedLimit && this.state.companyInfo.length >= 10 &&
                            <center>
                                <i className='fa fa-refresh' style={{color: '#716aca'}} />&nbsp;
                                <a id='assignTag' className='m-link' style={{color: '#716aca', cursor: 'pointer', marginTop: '20px'}} onClick={this.loadMore}>Load More</a>
                            </center>
                            }
                            </div>
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
  console.log(state)
  //console.log(state.backdoorInfo.subscribersWithTags)
  return {
    companyInfo: (state.backdoorInfo.companyInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadCompanyInfo
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfo)
