/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link, browserHistory } from 'react-router'
import { savePageInformation, saveUserInformation } from '../../redux/dispatchers/backdoor.dispatcher'
import { fetchTopPages } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
class top10pages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      topValue: 10
    }
    this.onPageClick = this.onPageClick.bind(this)
    this.goToBroadcasts = this.goToBroadcasts.bind(this)
    this.showData = this.showData.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.changeTopValue = this.changeTopValue.bind(this)
  }
  onKeyDown (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }
  changeTopValue (e) {
    this.setState({topValue: parseInt(e.target.value)})
    console.log('e.target.value', e.target.value)
    console.log('e.target.value int', parseInt(e.target.value))
    if (parseInt(e.target.value) > 0) {
      console.log('inside')
      this.props.fetchTopPages(parseInt(e.target.value))
    }
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
    let table = []
    console.log('this.props.pagesData.length', this.props.pagesData.length)
    for (let i = 0; i < this.props.pagesData.length; i += 2) {
      console.log('this.props.pagesData[i]', this.props.pagesData[i])
      table.push(<div className='row' key={i}>
        <div className='col-md-6'>
          <div className='m-widget5__item' style={{borderBottom: '.07rem dashed #ebedf2'}}>
            <div className='m-widget5__pic' style={{verticalAlign: 'middle'}}>
              <img className='m-widget7__img' alt='pic' src={(this.props.pagesData[i].pagePic) ? this.props.pagesData[i].pagePic : ''} style={{borderRadius: '50%', width: '5rem'}} />
            </div>
            <div className='m-widget5__content'>
              <a className='m-widget5__title' style={{whiteSpace: 'nowrap', width: '100px', overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp: '1', webkitBoxOrient: 'vertical', display: 'block'}}
                href={'http://m.me/' + this.props.pagesData[i].pageId}
                target='_blank'>
                {this.props.pagesData[i].pageName}
              </a>
              <div className='m-widget5__info'>
                <span className='m-widget5__author'>
                  User:
                </span>
                <br />
                {
                  this.props.pagesData[i].userName && <span className='m-widget5__info-author m--font-info' onClick={() => this.goToBroadcasts(this.props.pagesData[i].userName)} style={{cursor: 'pointer', whiteSpace: 'nowrap', width: '100px', overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp: '1', webkitBoxOrient: 'vertical'}} > {this.props.pagesData[i].userName.name}
                  </span>
                }
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
                 Subscribers
               </Link>
              </span>
            </div>
          </div>
        </div>
        {this.props.pagesData[i + 1] &&
        <div className='col-md-6' style={{borderLeft: '.07rem dashed #ebedf2'}}>
          <div className='m-widget5__item' key={i + 1} style={{borderBottom: '.07rem dashed #ebedf2'}}>
            <div className='m-widget5__pic' style={{verticalAlign: 'middle'}}>
              <img className='m-widget7__img' alt='pic' src={(this.props.pagesData[i + 1].pagePic) ? this.props.pagesData[i + 1].pagePic : ''} style={{borderRadius: '50%', width: '5rem'}} />
            </div>
            <div className='m-widget5__content'>
              <a className='m-widget5__title' style={{whiteSpace: 'nowrap', width: '100px', overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp: '1', webkitBoxOrient: 'vertical', display: 'block'}}
                href={'http://m.me/' + this.props.pagesData[i + 1].pageId}
                target='_blank'>
                {this.props.pagesData[i + 1].pageName}
              </a>
              <div className='m-widget5__info'>
                <span className='m-widget5__author'>
                  User:
                </span>
                <br />
                { this.props.pagesData[i].userName &&
                <span className='m-widget5__info-author m--font-info' onClick={() => this.goToBroadcasts(this.props.pagesData[i + 1].userName)} style={{cursor: 'pointer', whiteSpace: 'nowrap', width: '100px', overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp: '1', webkitBoxOrient: 'vertical'}}>
                  {this.props.pagesData[i + 1].userName.name}
                </span>
                }
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
                 Subscribers
               </Link>
              </span>
            </div>
          </div>
        </div>
      }
      </div>
      )
    }
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
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <form className='m-form m-form--fit m-form--label-align-right'>
                    <div className='m-portlet__body'>
                      <div className='form-group m-form__group row'>
                        <span htmlFor='example-text-input' className='col-form-label'>
                          Show Top:&nbsp;&nbsp;
                        </span>
                        <div>
                          <input id='example-text-input' type='number' min='0' step='1' value={this.state.topValue} className='form-control' onKeyDown={this.onKeyDown} onChange={this.changeTopValue} />
                        </div>
                        <span htmlFor='example-text-input' className='col-form-label'>
                        &nbsp;&nbsp;Pages
                      </span>
                      </div>
                    </div>
                  </form>
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
                            this.props.pagesData && this.props.pagesData.length > 0
                            ? <div className='m-widget5'>
                              {this.showData()}
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

function mapStateToProps (state) {
  return {
    toppages: state.backdoorInfo.kiboTopPages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    savePageInformation: savePageInformation,
    saveUserInformation: saveUserInformation,
    fetchTopPages: fetchTopPages
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(top10pages)
