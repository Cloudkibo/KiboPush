/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadNewsIntegrationsSummary} from '../../redux/actions/dashboard.actions'
import IconStack from '../../components/Dashboard/IconStack'

class NewsSummary extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      days: 30,
      pageId: 'all',
      selectedPage: {},
      showDropDown: false
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.changeDays = this.changeDays.bind(this)
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)

    this.props.loadNewsIntegrationsSummary({days: 30, pageId: ''})

  }

  changePage (page) {
    if (page === 'all') {
      this.setState({pageId: 'all'})
      this.props.loadNewsIntegrationsSummary({pageId: 'all', days: this.state.days})
    } else {
      this.setState({pageId: page._id, selectedPage: page})
      this.props.loadNewsIntegrationsSummary({pageId: page._id, days: this.state.days})
    }
  }

  showDropDown () {
    this.setState({showDropDown: true})
  }
  hideDropDown () {
    this.setState({showDropDown: false})
  }

  UNSAFE_componentWillReceiveProps (nextprops) {
  }

  onKeyDown (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }
  changeDays (e) {
    this.setState({days: e.target.value})
    this.props.loadNewsIntegrationsSummary({days: e.target.value, pageId: this.state.pageId})
  }
  render () {
    return (
      <div className='col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12'>
        <div className='m-portlet m-portlet--full-height '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>News Channel Integrations</h3>
              </div>
            </div>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <form className='m-form m-form--fit m-form--label-align-right'>
                    <div className='m-portlet__body'>
                      <div className='form-group m-form__group row'>
                        <span htmlFor='example-text-input' className='col-form-label'>
                          Show records for last:&nbsp;&nbsp;
                        </span>
                        <div>
                          <input id='example-text-input' type='number' min='0' step='1' value={this.state.days} className='form-control' onKeyDown={this.onKeyDown} onChange={this.changeDays} />
                        </div>
                        <span htmlFor='example-text-input' className='col-form-label'>
                        &nbsp;&nbsp;days
                      </span>
                      </div>
                    </div>
                  </form>
                </li>
                <li className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <span>Select Page: </span>&nbsp;&nbsp;&nbsp;
                  <a href='#/' onClick={this.showDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                    {this.state.pageId === 'all' ? 'All' : this.state.selectedPage.pageName}
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
                                this.props.pages && this.props.pages.map((page, i) => (
                                  <li key={page.pageId} className='m-nav__item'>
                                    <button href='#/' onClick={() => this.changePage(page)} className='m-nav__link' style={{cursor: 'pointer', border: 'none'}}>
                                      <span className='m-nav__link-text'>
                                        {page.pageName}
                                      </span>
                                    </button>
                                  </li>
                                ))
                              }
                              <li key={'all'} className='m-nav__item'>
                                <button href='#/' onClick={() => this.changePage('all')} className='m-nav__link' style={{cursor: 'pointer', border: 'none'}}>
                                  <span className='m-nav__link-text'>
                                    All
                                  </span>
                                </button>
                              </li>
                              <li className='m-nav__separator m-nav__separator--fit' />
                              <li className='m-nav__item'>
                                <button href='#/' onClick={() => this.hideDropDown} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                  Cancel
                                </button>
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
          {this.props.newsSummary &&
            <div className='m-widget21'>
            <div className='row'>
              <div className='col-3'>
                <IconStack
                  path='/'
                  icon='fa fa-newspaper-o'
                  title={this.props.newsSummary.newsSections}
                  subtitle='News Sections'
                  iconStyle='success'
                />
              <div className='m--space-30' ></div>
              </div>
              <div className='col-3'>
                <IconStack
                  path='/'
                  icon='fa fa-send'
                  title={this.props.newsSummary.storiesSent}
                  subtitle='Stories Sent'
                  iconStyle='info'
                />
              <div className='m--space-30' ></div>
              </div>
              <div className='col-3'>
                <IconStack
                  path='/'
                  icon='fa fa-eye'
                  title={this.props.newsSummary.storiesSeen}
                  subtitle='Stories Seen'
                  iconStyle='danger'
                />
              <div className='m--space-30' ></div>
              </div>
              <div className='col-3'>
                <IconStack
                  path='/'
                  icon='fa fa-hand-pointer-o'
                  title={this.props.newsSummary.storiesClicked}
                  subtitle='Stories Clicked'
                  iconStyle='warning'
                />
              <div className='m--space-30' ></div>
              </div>
            </div>
          </div>
        }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    newsSummary: (state.dashboardInfo.newsSummary),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadNewsIntegrationsSummary: loadNewsIntegrationsSummary,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsSummary)
