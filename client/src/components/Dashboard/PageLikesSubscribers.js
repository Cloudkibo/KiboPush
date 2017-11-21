/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'

class PageLikesSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedPage: this.props.connectedPages[0].pageName,
      likes: this.props.connectedPages[0].likes,
      subscribers: this.props.connectedPages[0].subscribers,
      showDropDown: false
    }
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.changePage = this.changePage.bind(this)
  }

  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }

  changePage (page) {
    var index = 0
    for (var i = 0; i < this.props.connectedPages.length; i++) {
      if (page === this.props.connectedPages[i].pageName) {
        index = i
        break
      }
    }
    this.setState({
      selectedPage: this.props.connectedPages[index].pageName,
      likes: this.props.connectedPages[index].likes,
      subscribers: this.props.connectedPages[index].subscribers
    })
  }

  render () {
    var convertRate = this.state.likes ? (this.state.subscribers / this.state.likes) * 100 + '%' : 0
    return (
      <div className='col-xl-6'>
        <div className='m-portlet m-portlet--full-height m-portlet--skin-light m-portlet--fit'>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>
                  {this.state.selectedPage.length > 15 ? this.state.selectedPage.substring(0, 15) + '...' : this.state.selectedPage}
                </h3>
              </div>
            </div>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li onClick={this.showDropDown} className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <a className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
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
                                this.props.connectedPages.map((page, i) => (
                                  <li key={page.pageId} className='m-nav__item'>
                                    <a onClick={() => this.changePage(page.pageName)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                      <span className='m-nav__link-text'>
                                        {page.pageName}
                                      </span>
                                    </a>
                                  </li>
                                ))
                              }
                              <li className='m-nav__separator m-nav__separator--fit' />
                              <li className='m-nav__item'>
                                <a onClick={() => this.hideDropDown} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
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
            <div className='m-widget21'>
              <div className='row'>
                <div className='col'>
                  <div className='m-widget21__item m--pull-right'>
                    <span className='m-widget21__icon'>
                      <a className='btn btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                        <i className='fa flaticon-users m--font-light' />
                      </a>
                    </span>
                    <div className='m-widget21__info'>
                      <span className='m-widget21__title'>
                        {this.state.subscribers}
                      </span>
                      <br />
                      <span className='m-widget21__sub'>
                        Subscribers
                      </span>
                    </div>
                  </div>
                </div>
                <div className='col m--align-left'>
                  <div className='m-widget21__item m--pull-left'>
                    <span className='m-widget21__icon'>
                      <a className='btn btn-accent m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill'>
                        <i className='fa fa-thumbs-o-up m--font-light' />
                      </a>
                    </span>
                    <div className='m-widget21__info'>
                      <span className='m-widget21__title'>
                        {this.state.likes}
                      </span>
                      <br />
                      <span className='m-widget21__sub'>
                        Likes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='m--space-30' />
              <div className='m-widget15'>
                <div className='m-widget15__item'>
                  <span style={{fontSize: '1.1rem', fontWeight: '600', color: '#6f727d'}}>
                    {convertRate}
                  </span>
                  <span style={{fontSize: '0.85rem', float: 'right', marginTop: '0.3rem', color: '#9699a2'}}>
                    Followers converted into Subscribers
                  </span>
                  <div className='m--space-10' />
                  <div className='progress m-progress--sm'>
                    <div className='progress-bar bg-success' role='progressbar' style={{width: convertRate}} aria-valuenow={(this.state.subscribers / this.state.likes) * 100} aria-valuemin='0' aria-valuemax='100' />
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

export default PageLikesSubscribers
