/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link, browserHistory } from 'react-router'
import { savePageInformation, saveUserInformation } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
class top10pages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPageClick = this.onPageClick.bind(this)
    this.goToBroadcasts = this.goToBroadcasts.bind(this)
    this.showData = this.showData.bind(this)
  }
  onPageClick (e, page) {
    this.props.savePageInformation(page)
    browserHistory.push({
      pathname: `/pageSubscribers`,
      state: {module: 'top10pages'}
    })
  }
  goToBroadcasts (user) {
    this.props.saveUserInformation(user)
    browserHistory.push({
      pathname: `/userDetails`,
      state: user
    })
    // browserHistory.push(`/viewsurveydetail/${survey._id}`)
  }
  showData () {
    console.log('showData')
    let table = []
    for (let i = 0; i < this.props.pagesData.length; i += 2) {
      table.push(<div className='row'>
        <div className='col-md-6'>
          <div className='m-widget5__item' key={i} style={{borderBottom: '.07rem dashed #ebedf2'}}>
            <div className='m-widget5__pic' style={{verticalAlign: 'middle'}}>
              <img className='m-widget7__img' alt='pic' src={(this.props.pagesData[i].pagePic) ? this.props.pagesData[i].pagePic : ''} style={{borderRadius: '50%', width: '5rem'}} />
            </div>
            <div className='m-widget5__content'>
              <h4 className='m-widget5__title' style={{display: 'table-caption', overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp: '1', webkitBoxOrient: 'vertical'}}>
                {this.props.pagesData[i].pageName}
              </h4>
              <div className='m-widget5__info'>
                <span className='m-widget5__author'>
                  User:
                </span>
                <br />
                <span className='m-widget5__info-author m--font-info' onClick={() => this.goToBroadcasts(this.props.pagesData[i].userName)} style={{cursor: 'pointer', display: 'table-caption', overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp: '1', webkitBoxOrient: 'vertical'}} >
                  {this.props.pagesData[i].userName.name}
                </span>
              </div>
            </div>
            <div className='m-widget5__stats1'>
              <span className='m-widget5__number'>
                {this.props.pagesData[i].subscribers}
              </span>
              <br />
              <span className='m-widget5__sales'>
                Subscribers
              </span>
            </div>
            <div className='m-widget5__stats2'>
              <br />
              <span className='m-widget5__votes'>
                <Link onClick={(e) => { let pageSelected = this.props.pagesData[i]; this.onPageClick(e, pageSelected) }} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                 See Subscribers
               </Link>
              </span>
            </div>
          </div>
        </div>
        {this.props.pagesData[i + 1] &&
        <div className='col-md-6' style={{borderLeft: '.07rem dashed #ebedf2'}}>
          <div className='m-widget5__item' key={i} style={{borderBottom: '.07rem dashed #ebedf2'}}>
            <div className='m-widget5__pic' style={{verticalAlign: 'middle'}}>
              <img className='m-widget7__img' alt='pic' src={(this.props.pagesData[i + 1].pagePic) ? this.props.pagesData[i + 1].pagePic : ''} style={{borderRadius: '50%', width: '5rem'}} />
            </div>
            <div className='m-widget5__content'>
              <h4 className='m-widget5__title' style={{display: 'table-caption', overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp: '1', webkitBoxOrient: 'vertical'}}>
                {this.props.pagesData[i + 1].pageName}
              </h4>
              <div className='m-widget5__info'>
                <span className='m-widget5__author'>
                  User:
                </span>
                <br />
                <span className='m-widget5__info-author m--font-info' onClick={() => this.goToBroadcasts(this.props.pagesData[i + 1].userName)} style={{cursor: 'pointer', display: 'table-caption', overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp: '1', webkitBoxOrient: 'vertical'}}>
                  {this.props.pagesData[i + 1].userName.name}
                </span>
              </div>
            </div>
            <div className='m-widget5__stats1'>
              <span className='m-widget5__number'>
                {this.props.pagesData[i + 1].subscribers}
              </span>
              <br />
              <span className='m-widget5__sales'>
                Subscribers
              </span>
            </div>
            <div className='m-widget5__stats2'>
              <br />
              <span className='m-widget5__votes'>
                <Link onClick={(e) => { let pageSelected = this.props.pagesData[i + 1]; this.onPageClick(e, pageSelected) }} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                 See Subscribers
               </Link>
              </span>
            </div>
          </div>
        </div>
      }
      </div>
      )
    }
    console.log('subscribers', table)
    return table
  }
  render () {
    console.log('pagesData', this.props.pagesData)
    return (
      <div className='col-xl-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>Top 10 Pages</h3>
              </div>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active' id='m_widget5_tab1_content' aria-expanded='true'>
                {
                  this.props.pagesData && this.props.pagesData.length > 0
                  ? <div className='m-widget5'>
                    {this.showData()}
                  </div>
                    : <div>No Data to display</div>
                    }
              </div>
            </div>
          </div>
          {/* <div className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active m-scrollable' role='tabpanel'>
                <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                  <div style={{height: '393px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                    <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                      <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >

                        <div className='tab-pane active' id='m_widget4_tab1_content'>
                          {
                            this.props.pagesData && this.props.pagesData.length > 0
                          ? <div className='m-widget4' >
                            {
                             this.props.pagesData.map((page, i) => (
                               <div className='m-widget4__item' key={i}>
                                 <div className='m-widget4__img m-widget4__img--pic'>
                                   <img alt='pic' src={(page.pagePic) ? page.pagePic : ''} />
                                 </div>
                                 <div className='m-widget4__info'>
                                   <span className='m-widget4__title'>
                                     {page.pageName}
                                   </span>
                                   <br />
                                   {
                                   page.pageUserName
                                  ? <span className='m-widget4__sub'>
                                    Page Username: {page.pageUserName}
                                  </span>
                                  : <span className='m-widget4__sub'>
                                    <b>Page Id: </b>{page.pageId}
                                  </span>
                                  }
                                   <br />
                                   <span className='m-widget4__sub'>
                                  Likes: {page.likes}
                                   </span>&nbsp;&nbsp;&nbsp;
                                   <span className='m-widget4__sub'>
                                  Subscribers: {page.subscribers}
                                   </span>
                                 </div>
                                 <div className='m-widget4__ext'>
                                   <Link onClick={(e) => { let pageSelected = page; this.onPageClick(e, pageSelected) }} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                    See Subscribers
                                  </Link>
                                 </div>
                               </div>
                            ))}
                          </div>
                            : <div>No Data to display</div>
                }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */
        }
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    savePageInformation: savePageInformation,
    saveUserInformation: saveUserInformation
  }, dispatch)
}
export default connect(null, mapDispatchToProps)(top10pages)
