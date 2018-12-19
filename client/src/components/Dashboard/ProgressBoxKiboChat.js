/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import IconStack from './IconStack'
import ProgressBar from './ProgressBar'

class ProgressBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false

    }
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.calculateProgressRates = this.calculateProgressRates.bind(this)
  }
  showProDialog () {
    this.setState({isShowingModalPro: true})
  }
  showDropDown () {
    this.setState({showDropDown: true})
  }
  hideDropDown () {
    this.setState({showDropDown: false})
  }
  calculateProgressRates () {
    var progressRates = {}
    if (this.props.selectedPage) {
      progressRates.unsubscribeRate = (this.props.selectedPage.unsubscribes && this.props.selectedPage.subscribers) ? (this.props.selectedPage.unsubscribes / (this.props.selectedPage.unsubscribes + this.props.selectedPage.subscribers) * 100).toFixed(1) + '%' : '0%'
    } else {
      progressRates.unsubscribeRate = (this.props.firstPage.unsubscribes && this.props.firstPage.subscribers) ? (this.props.firstPage.unsubscribes / (this.props.firstPage.unsubscribes + this.props.firstPage.subscribers) * 100).toFixed(1) + '%' : '0%'
    }
    progressRates.resolveRate = this.props.data.sessions.count !== 0 ? ((this.props.data.sessions.resolved / this.props.data.sessions.count) * 100).toFixed(1) + '%' : '0%'
    progressRates.botResponseRate = this.props.data.bots.count !== 0 ? ((this.props.data.bots.responded / this.props.data.bots.count) * 100).toFixed(1) + '%' : '0%'
    return progressRates
  }

  render () {
    console.log('selecetedPage', this.props.selectedPage)
    console.log('first page', this.props.firstPage)
    var rates = this.calculateProgressRates()
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>
                  {this.props.selectedPage ? this.props.selectedPage.pageName : this.props.firstPage.pageName}
                </h3>
              </div>
            </div>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <a onClick={this.showDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                    Change Page
                  </a>
                  {
                    this.state.showDropDown &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <ul className='m-nav'>
                              <li className='m-nav__section m-nav__section--first'>
                                <span className='m-nav__section-text'>
                                  Connected Pages
                                </span>
                              </li>
                              {
                                this.props.pages.map((page, i) => (
                                  <li key={page.pageId} className='m-nav__item'>
                                    <a onClick={() => this.props.changePage(page.pageId)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                      <span className='m-nav__link-text'>
                                        {page.pageName}
                                      </span>
                                    </a>
                                  </li>
                                ))
                              }
                              <li className='m-nav__separator m-nav__separator--fit' />
                              <li className='m-nav__item'>
                                <a onClick={() => this.hideDropDown} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='tab-content'>
              <div className='row'>
                <div className='col-6' style={{margin: '10px'}}>
                  <div className='row'>
                    <div className='col-3' style={{minWidth: '150px'}}>
                      <IconStack
                        path='/subscribers'
                        state={{page: this.props.selectedPage ? this.props.selectedPage : this.props.firstPage, filterStatus: 'subscribed'}}
                        icon='flaticon-user-ok'
                        title={this.props.selectedPage ? this.props.selectedPage.subscribers : this.props.firstPage.subscribers}
                        subtitle='Subscribes'
                      />
                    </div>
                    <div className='col-3' style={{minWidth: '150px'}}>
                      <IconStack
                        path='/subscribers'
                        state={{page: this.props.selectedPage ? this.props.selectedPage : this.props.firstPage, filterStatus: 'unsubscribed'}}
                        icon='flaticon-users'
                        title={this.props.selectedPage ? this.props.selectedPage.unsubscribes : this.props.firstPage.unsubscribes}
                        subtitle='Unsubscribes'
                      />
                    </div>
                  </div>
                  <div className='m--space-30' />
                  <ProgressBar
                    rate={rates.unsubscribeRate}
                    label='Unsubscribe rate'
                    progressStyle='brand'
                  />
                </div>
                <div className='col-3' style={{margin: '10px 50px 0px 50px'}}>
                  <IconStack
                    path='/liveChat'
                    state={{}}
                    icon='flaticon-chat-1'
                    title={this.props.data.sessions.count !== null ? this.props.data.sessions.count : 0}
                    subtitle='Sessions'
                  />
                  <div className='m--space-30' />
                  <ProgressBar
                    rate={rates.resolveRate}
                    label='Resolve rate'
                    progressStyle='success'
                  />
                </div>
                <div className='col-3' style={{margin: '10px'}}>
                  <IconStack
                    path='/bots'
                    state={{}}
                    icon='flaticon-questions-circular-button'
                    title={this.props.data.bots.count !== null ? this.props.data.bots.count : 0}
                    subtitle='Bot Queries'
                  />
                  <div className='m--space-30' />
                  <ProgressBar
                    rate={rates.botResponseRate}
                    label='Response rate'
                    progressStyle='danger'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProgressBox
