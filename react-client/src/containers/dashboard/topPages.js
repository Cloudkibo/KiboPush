/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link } from 'react-router-dom'
import { savePageInformation } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class TopPages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPageClick = this.onPageClick.bind(this)
    this.goToSubscribers = this.goToSubscribers.bind(this)
  }
  onPageClick (e, page) {
    this.props.savePageInformation(page)
  }
  goToSubscribers (page) {
    this.props.browserHistory.push({
      pathname: `/subscribers`,
      state: {page: page}
    })
  }
  render () {
    return (
      <div className='col-xl-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>Top Pages</h3>
              </div>
            </div>
          </div>
          <div style={{padding: '1rem'}} className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active m-scrollable' role='tabpanel'>
                <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                  <div style={{height: '200px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
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
                                   <div style={{padding: '0px'}} className='row m-widget4__info'>
                                     <div style={{display: 'inline-block', padding: '0px', maxWidth: 'none'}} className='col-md-6'>
                                       <span style={{fontSize: '0.85rem', color: '#7b7e8a'}}>
                                        Likes: <strong>{page.likes}</strong>
                                       </span>
                                     </div>
                                     <div style={{display: 'inline-block', padding: '0px', maxWidth: 'none'}} className='col-md-6'>
                                       <span style={{fontSize: '0.85rem', color: '#7b7e8a'}}>
                                        Subscribers: <strong>{page.subscribers}</strong>
                                       </span>
                                     </div>
                                   </div>
                                 </div>
                                 <div className='m-widget4__ext'>
                                   <Link style={{marginRight: '20px', whiteSpace: 'normal'}} onClick={() => this.goToSubscribers(page)} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
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
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    savePageInformation: savePageInformation
  }, dispatch)
}
export default connect(null, mapDispatchToProps)(TopPages)
