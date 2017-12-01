/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link } from 'react-router'
import { savePageInformation } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
class top10pages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPageClick = this.onPageClick.bind(this)
  }
  onPageClick (e, page) {
    console.log('Page Click', page)
    this.props.savePageInformation(page)
  }
  render () {
    return (
      <div className='col-xl-6'>
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
              <div className='tab-pane active' id='m_widget4_tab1_content'>
                {
                  this.props.pagesData && this.props.pagesData.length > 0
                ?
                <div className='m-widget4'>
                   { this.props.pagesData.map((page, i) => (
                   <div className='m-widget4__item'>
                    <div className='m-widget4__img m-widget4__img--pic'>
                      <img alt='pic' src={(page.pagePic) ? page.pagePic : ''} />
                    </div>
                    <div className='m-widget4__info'>
                      <span className='m-widget4__title'>
                        {page.pageName}
                      </span>
                      <br />
                      { page.pageUserName
                        ? <span className='m-widget4__sub'>
                          Page Username: {page.pageUserName}
                      </span>
                    : <span className='m-widget4__sub'>
                      <b>Page Id: </b>{page.pageId}
                  </span>}
                  <br />
                  <span className='m-widget4__sub'>
                      Likes: {page.likes}
                  </span>
                  <span className='m-widget4__sub' style={{float: 'right', marginRight: '100px'}}>
                      Subscribers: {page.subscribers}
                  </span>
                    </div>

                    <div className='m-widget4__ext'>
                      <Link onClick={(e) => { let pageSelected = page; this.onPageClick(e, pageSelected) }} to={'/pageSubscribers'} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
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
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    savePageInformation: savePageInformation
  }, dispatch)
}
export default connect(null, mapDispatchToProps)(top10pages)
